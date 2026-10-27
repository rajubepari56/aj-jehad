# n8n lead workflow

```
Website form → POST /api/contact (server) → n8n Webhook → Google Sheets ("Client Inquiries")
                                                          → Gmail alert to jehadmahadihassan@gmail.com
                                                          → Respond to Webhook (200)
                                                          → Gmail auto-reply to the client
```

The browser never sees the webhook. `/api/contact` validates, sanitises and rate-limits, then forwards the JSON below to
`N8N_WEBHOOK_URL` (server env var) with an 8-second timeout.

## Fast path: import the workflow
1. n8n → **Workflows → Import from file** → `docs/n8n-lead-workflow.json`.
2. Open **Append to Client Inquiries**, pick your Google credential and replace `YOUR_GOOGLE_SHEET_ID`.
3. Open both **Gmail** nodes and pick your Gmail credential.
4. **Activate** the workflow. Set the Webhook node **Path** to the same value as the end of your existing webhook URL (so the URL you already put in `N8N_WEBHOOK_URL` keeps working): `https://YOUR-N8N-HOST/webhook/<path>`.

> The import file was written by hand and has not been executed against your n8n instance. Node parameter names can differ slightly between n8n versions; if a node shows a warning after import, re-select its options (the field mapping below is what matters).

## Payload the API sends

```json
{
  "submissionId": "uuid-v4",
  "timestamp": "2026-10-19T18:00:00.000Z",
  "client": {
    "name": "Alex Carter",
    "email": "alex@creatoragency.com",
    "channelOrBrand": "youtube.com/@AlexGaming",
    "service": "Gaming Content Editing",
    "budgetTier": "$750 – $1,500+",
    "footageVolume": "5–12 videos",
    "turnaround": "Within a week",
    "rawFootageLink": "https://drive.google.com/drive/folders/xyz",
    "projectScope": "…",
    "consentGiven": true
  },
  "metadata": { "source": "Website Inbound Lead", "locale": "en-US", "referrer": "direct" }
}
```
`footageVolume` and `turnaround` are optional extras (empty string when not chosen). Everything else matches the agreed scheme.
Honeypot/timing fields are checked and dropped on the server and are never forwarded.

## Nodes, step by step

### 1. Webhook
| Setting | Value |
|---|---|
| HTTP Method | `POST` |
| Path | `YOUR-WEBHOOK-PATH` |
| Respond | **Using 'Respond to Webhook' node** |
| Authentication | None (optional header check below) |

Payload arrives under `{{ $json.body }}`.

*Optional shared secret:* set `N8N_WEBHOOK_SECRET` in Vercel; the API then sends `X-Webhook-Secret`. Add an **IF** node after the Webhook:
`{{ $json.headers['x-webhook-secret'] }}` **is equal to** your secret. Send the false branch to a **Respond to Webhook** node returning 401.

### 2. Edit Fields (Set) – "Flatten lead"
Map each field from `$json.body…` (e.g. `name = {{ $json.body.client.name }}`, `submissionId = {{ $json.body.submissionId }}`, `source = {{ $json.body.metadata.source }}`).

### 3. Google Sheets – Append row
- Operation **Append Row**, Sheet name **Client Inquiries**.
- Create the header row exactly once:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Submission ID | Timestamp | Name | Email | Channel / Brand | Service | Budget | Footage Volume | Turnaround | Footage Link | Project Scope | Consent | Source | Locale | Referrer | Status |

- Mapping: each column ← the matching field from the Set node; `Consent = yes`, `Status = New`.
- Settings → **On Error: Continue** so a Sheets hiccup never blocks the email alert.

### 4. Gmail – Lead alert (to you)
- To: `jehadmahadihassan@gmail.com`
- Subject: `New inquiry: {{ name }} · {{ service }}`
- HTML body: table of the fields (see the import file). On Error: Continue.

### 5. Respond to Webhook
- Respond with **JSON**, body `{ "ok": true }`, code 200.
- It sits *after* the Sheets row and the alert so the API returns success only once the lead is stored and you've been notified. If this takes longer than 8 s the site shows its friendly fallback ("email me directly") and you still get the lead in the sheet.

### 6. Gmail – Auto-reply (to the client)
- To: `{{ email }}` (from the Set node)
- Subject: `I received your inquiry · Mahadi Jehad Edits`
- HTML body: thanks + the 24-hour promise + their `submissionId` reference. On Error: Continue.

## Testing without touching production
```bash
npm run test:contact                 # 29 checks against a local mock receiver. Nothing is sent to n8n.
npm run test:contact -- --live --email you@example.com   # ONE clearly-marked [TEST] lead through the real webhook
```
Live mode writes a `[TEST]` row to the sheet and emails you and the address you pass, so delete the row afterwards.

In n8n you can also use the Webhook node's **Test URL** (`/webhook-test/…`) by temporarily pointing `N8N_WEBHOOK_URL` at it in `.env.local`.
