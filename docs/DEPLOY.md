# Deployment (maintainers)

Public demo: [process-to-flow.onrender.com](https://process-to-flow.onrender.com/)

## Render (recommended)

1. Fork or clone [github.com/Pietsen/process-to-flow](https://github.com/Pietsen/process-to-flow).
2. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint** → connect the repo.
3. Use [`render.yaml`](../render.yaml) at the repository root (`Dockerfile` + blueprint in the same folder).
4. Set **`OPENAI_API_KEY`** (secret). Optional: `OPENAI_MODEL`, `LLM_PROVIDER`.
5. Deploy → share the `*.onrender.com` URL.

**Free tier:** service sleeps when idle; first request after idle may take 30–60 seconds.

## Environment variables

| Variable | Required | Default |
|----------|----------|---------|
| `OPENAI_API_KEY` | Yes (OpenAI) | — |
| `LLM_PROVIDER` | No | `openai` |
| `OPENAI_MODEL` | No | `gpt-4o-mini` |
| `PORT` | Set by Render | `10000` in image |

For local Ollama instead of OpenAI: `LLM_PROVIDER=ollama`, `OLLAMA_BASE_URL=http://host.docker.internal:11434` (Docker Desktop).

## Railway / other hosts

Build from the root **`Dockerfile`**, expose the platform `PORT`, inject `OPENAI_API_KEY`. One container serves static UI and proxies `/api` to Spring Boot on localhost.

## Security notes

- Never commit API keys; use platform secrets only.
- Public URL without auth → set OpenAI usage limits; consider rate limiting for production use.
