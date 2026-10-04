# Security & abuse prevention

The public demo calls OpenAI on every **Generate** request. The API key stays on the server, but anyone with the URL can trigger paid API usage.

## 1. OpenAI (mandatory)

In [OpenAI Billing](https://platform.openai.com/settings/organization/billing):

- Set a **monthly budget / hard limit**
- Enable **email alerts** at low thresholds
- Rotate the key if you suspect leakage

The key must **only** live in Render secrets (`OPENAI_API_KEY`), never in git or the frontend.

## 2. Rate limiting (built into the backend)

`POST /api/process` is limited by:

| Setting | Env var | Default |
|---------|---------|---------|
| Enable | `RATE_LIMIT_ENABLED` | `true` |
| Per client IP / minute | `RATE_LIMIT_PER_MINUTE` | `10` |
| Global per UTC day | `RATE_LIMIT_PER_DAY` | `500` (`0` = off) |

Exceeded limits → HTTP **429** with `{ "code": "rate_limited", ... }`.

On Render, clients are identified via `X-Forwarded-For`.

**Demo suggestion:** `RATE_LIMIT_PER_MINUTE=5`, `RATE_LIMIT_PER_DAY=100`.

## 3. Prompt injection filter (built into the backend)

Before calling the LLM, `POST /api/process` runs a **heuristic guard** on the description:

- Max length (`PROMPT_MAX_LENGTH`, default `8000`)
- Blocks common instruction-override / exfiltration phrases in **English and German** (e.g. “ignore previous instructions”, “Ignoriere alle vorherigen Anweisungen”, API key / API-Schlüssel patterns)

Rejected input → HTTP **400** with `{ "code": "prompt_rejected", ... }`.

| Env var | Default |
|---------|---------|
| `PROMPT_GUARD_ENABLED` | `true` |
| `PROMPT_MAX_LENGTH` | `8000` |

This is **not perfect** (heuristics + hardened system prompt + XML-style delimiters). Determined attackers may still probe the model — combine with rate limits and OpenAI budgets.

## 4. What does *not* protect you

- **CORS** — stops other websites in the browser, not `curl` or scripts
- **Hiding the URL** — security through obscurity is weak
- **Frontend env vars** — anything in the browser is public

## 5. Stronger options (later)

- **HTTP Basic Auth** in front of the app (Render paid features or Cloudflare)
- **Login** (OAuth) before calling the API
- **Invite-only** demo on a private network
- **Turn off** the public service when the HR test is done

## 6. Incident response

1. Revoke / rotate `OPENAI_API_KEY` on OpenAI
2. Update the secret on Render and redeploy
3. Lower `RATE_LIMIT_*` or set `RATE_LIMIT_ENABLED=false` and take the service offline
