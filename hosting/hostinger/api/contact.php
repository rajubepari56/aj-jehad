<?php
/**
 * POST /api/contact  (Hostinger / any PHP host)
 * Browser -> this file (server-side) -> n8n webhook -> Google Sheets + emails.
 * The webhook URL lives only in api/config.php on the server and is never sent to the browser.
 */
declare(strict_types=1);

const WINDOW_SECONDS = 15 * 60;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 16 * 1024;
const MIN_HUMAN_MS   = 1500;
const MAX_TIMEOUT_S  = 8;       // hard cap: 8 seconds
const SUPPORT_EMAIL  = 'jehadmahadihassan@gmail.com';

const SERVICES = [
    'Gaming Content Editing',
    'Viral Short-Form Growth',
    '2D / 3D Motion Graphics & Intro Packaging',
    'Long-Form YouTube Production & Sound Design',
    'Full-Time Dedicated Monthly Retainer',
];
const BUDGETS   = ['< $300', '$300 – $750', '$750 – $1,500+'];
const VOLUMES   = ['One video', '2–4 videos', '5–12 videos', '12+ videos per month', 'Not sure yet'];
const TURNAROUND = ['Rush (under 48h)', 'Within a week', '1–2 weeks', 'Flexible / ongoing'];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body, array $headers = []): void
{
    http_response_code($status);
    foreach ($headers as $k => $v) header("$k: $v");
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fallback_message(): string
{
    return "Sorry, I couldn't send your inquiry right now. Please email " . SUPPORT_EMAIL . " directly and I'll reply within 24 hours.";
}

/** Strip control characters and HTML tags; collapse whitespace. Output is plain text only. */
function clean(mixed $v, bool $multiline = false): string
{
    $s = is_string($v) ? $v : '';
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\x{200B}-\x{200F}\x{202A}-\x{202E}]/u', '', $s) ?? '';
    $s = strip_tags($s);
    if ($multiline) {
        $s = preg_replace('/[ \t]+/u', ' ', $s) ?? '';
        $s = preg_replace('/\n{3,}/', "\n\n", str_replace("\r\n", "\n", $s)) ?? '';
    } else {
        $s = preg_replace('/\s+/u', ' ', $s) ?? '';
    }
    return trim($s);
}

function uuid4(): string
{
    $d = random_bytes(16);
    $d[6] = chr((ord($d[6]) & 0x0f) | 0x40);
    $d[8] = chr((ord($d[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));
}

/** File-based limiter: 5 submissions / 15 min per IP. */
function rate_limited(string $ip): int
{
    $file = sys_get_temp_dir() . '/mje_rl_' . hash('sha256', $ip) . '.json';
    $now = time();
    $fh = @fopen($file, 'c+');
    if (!$fh) return 0; // never block real visitors if the temp dir is unwritable
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh);
    $times = array_values(array_filter((array) json_decode($raw ?: '[]', true), fn ($t) => is_int($t) && $now - $t < WINDOW_SECONDS));
    $retry = 0;
    if (count($times) >= MAX_PER_WINDOW) {
        $retry = WINDOW_SECONDS - ($now - $times[0]);
    } else {
        $times[] = $now;
    }
    ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($times));
    flock($fh, LOCK_UN); fclose($fh);
    return $retry;
}

// ── 1. method, origin, rate limit ────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'code' => 'method_not_allowed', 'message' => 'Method not allowed.'], ['Allow' => 'POST']);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $oh = parse_url($origin, PHP_URL_HOST) ?: '';
    $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    $strip = fn (string $h) => preg_replace('/^www\./i', '', strtolower($h));
    if ($strip($oh) !== $strip($host) && !in_array($oh, ['localhost', '127.0.0.1'], true)) {
        respond(403, ['ok' => false, 'code' => 'forbidden', 'message' => 'Request not allowed.']);
    }
}
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = trim(explode(',', $ip)[0]);
if (($retry = rate_limited($ip)) > 0) {
    respond(429, ['ok' => false, 'code' => 'rate_limited',
        'message' => 'Too many submissions. Please try again in ' . (int) ceil($retry / 60) . ' minutes, or email ' . SUPPORT_EMAIL . '.'],
        ['Retry-After' => (string) $retry]);
}

// ── 2. body ──────────────────────────────────────────────────────────────────
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    respond(415, ['ok' => false, 'code' => 'bad_request', 'message' => 'Unsupported content type.']);
}
$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1) ?: '';
if (strlen($raw) > MAX_BODY_BYTES) respond(413, ['ok' => false, 'code' => 'bad_request', 'message' => 'Message is too large.']);
$in = json_decode($raw, true);
if (!is_array($in)) respond(400, ['ok' => false, 'code' => 'bad_request', 'message' => 'Invalid request.']);

// ── 3. validate + sanitise ───────────────────────────────────────────────────
$errors = [];
$name  = clean($in['name'] ?? '');
if ($name === '') $errors['name'] = 'Full name is required';
elseif (mb_strlen($name) < 2) $errors['name'] = 'Full name is too short';
elseif (mb_strlen($name) > 80) $errors['name'] = 'Full name is too long';

$email = strtolower(trim(is_string($in['email'] ?? null) ? $in['email'] : ''));
if ($email === '') $errors['email'] = 'Email is required';
elseif (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email address';

$channel = clean($in['channelOrBrand'] ?? '');
if ($channel !== '' && (mb_strlen($channel) > 300
    || !(preg_match('~^(https?://)?[\w@.-]+(\.[a-z]{2,})?([/?#]\S*)?$~i', $channel) || preg_match('/^@[\w.]{2,40}$/', $channel)))) {
    $errors['channelOrBrand'] = 'Enter a valid link or @handle for channel or brand';
}

$service = clean($in['service'] ?? '');
if (!in_array($service, SERVICES, true)) $errors['service'] = 'Choose the service you need';
$budget = clean($in['budgetTier'] ?? '');
if (!in_array($budget, BUDGETS, true)) $errors['budgetTier'] = 'Choose a budget range';

$volume = clean($in['footageVolume'] ?? '');
if ($volume !== '' && !in_array($volume, VOLUMES, true)) $volume = '';
$turn = clean($in['turnaround'] ?? '');
if ($turn !== '' && !in_array($turn, TURNAROUND, true)) $turn = '';

$footage = clean($in['rawFootageLink'] ?? '');
if ($footage !== '' && (mb_strlen($footage) > 500 || !preg_match('~^https?://\S+\.\S+$~i', $footage))) {
    $errors['rawFootageLink'] = 'Enter a full link starting with https://';
}

$scope = clean($in['projectScope'] ?? '', true);
if ($scope === '') $errors['projectScope'] = 'Project scope is required';
elseif (mb_strlen($scope) < 20) $errors['projectScope'] = 'Project scope is too short';
elseif (mb_strlen($scope) > 3000) $errors['projectScope'] = 'Project scope is too long';

if (($in['consentGiven'] ?? false) !== true) $errors['consentGiven'] = 'Please accept the terms to continue';

if ($errors) respond(422, ['ok' => false, 'code' => 'validation', 'message' => 'Please check the highlighted fields.', 'fieldErrors' => $errors]);

// ── 4. bots: honeypot filled or submitted faster than a human. Pretend success, forward nothing ──
$elapsed = (int) ($in['elapsedMs'] ?? 0);
if (trim((string) ($in['company_website'] ?? '')) !== '' || ($elapsed > 0 && $elapsed < MIN_HUMAN_MS)) {
    respond(200, ['ok' => true, 'submissionId' => uuid4()]);
}

// ── 5. forward to n8n ────────────────────────────────────────────────────────
$cfgFile = __DIR__ . '/config.php';
$cfg = is_file($cfgFile) ? (array) require $cfgFile : [];
$url = (string) ($cfg['n8n_webhook_url'] ?? '');
$secret = (string) ($cfg['n8n_webhook_secret'] ?? '');

$id = uuid4();
$payload = [
    'submissionId' => $id,
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
    'client' => [
        'name' => $name, 'email' => $email, 'channelOrBrand' => $channel, 'service' => $service, 'budgetTier' => $budget,
        'footageVolume' => $volume, 'turnaround' => $turn, 'rawFootageLink' => $footage, 'projectScope' => $scope, 'consentGiven' => true,
    ],
    'metadata' => [
        'source' => 'Website Inbound Lead',
        'locale' => substr(trim(explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'en-US')[0]) ?: 'en-US', 0, 16),
        'referrer' => clean($in['referrer'] ?? '') ?: substr($_SERVER['HTTP_REFERER'] ?? '', 0, 300) ?: 'direct',
    ],
];

if ($url === '') {
    error_log("[contact] webhook unconfigured (submission $id)");
    respond(503, ['ok' => false, 'code' => 'upstream_unconfigured', 'message' => fallback_message()]);
}

$timeout = min((int) ($cfg['timeout_seconds'] ?? MAX_TIMEOUT_S), MAX_TIMEOUT_S);
$headers = ['Content-Type: application/json'];
if ($secret !== '') $headers[] = 'X-Webhook-Secret: ' . $secret;
$body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$status = 0; $errno = 0;
if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body, CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => min(5, $timeout), CURLOPT_TIMEOUT => $timeout]);
    curl_exec($ch);
    $errno = curl_errno($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
} else {
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'header' => implode("\r\n", $headers), 'content' => $body, 'timeout' => $timeout, 'ignore_errors' => true]]);
    $res = @file_get_contents($url, false, $ctx);
    $errno = $res === false ? 7 : 0;
    if (isset($http_response_header[0]) && preg_match('~\s(\d{3})\s~', $http_response_header[0], $m)) $status = (int) $m[1];
}

if ($errno === 0 && $status >= 200 && $status < 300) respond(200, ['ok' => true, 'submissionId' => $id]);

$kind = $errno === 28 ? 'timeout' : ($errno !== 0 ? 'unreachable' : 'rejected');
error_log("[contact] webhook $kind (submission $id)"); // never logs the URL or the lead's details
respond($kind === 'timeout' ? 504 : 502, ['ok' => false, 'code' => "upstream_$kind", 'message' => fallback_message()]);
