<?php
// Copy this file to config.php and fill it in. config.php is blocked from direct web access by api/.htaccess.
return [
    'n8n_webhook_url'    => 'https://YOUR-N8N-HOST/webhook/YOUR-WEBHOOK-PATH',
    'n8n_webhook_secret' => '',   // optional: sent as the X-Webhook-Secret header
    'timeout_seconds'    => 8,    // never more than 8
];
