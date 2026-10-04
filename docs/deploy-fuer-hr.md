# Live stellen für HR-Tester (ohne lokale Installation)

Ziel: **eine URL** im Browser — z. B. `https://process-to-flow-xxxx.onrender.com`. Kein Java, Docker oder pnpm für die Tester.

## Empfohlen: Render (kostenloser Einstieg)

### Einmalig (du als Entwickler)

1. Projekt auf **GitHub** pushen (Account **Pietsen**):
   ```bash
   cd /Users/peter.kuhn/workspace/aris/process-to-flow
   git remote -v   # sollte Pietsen/process-to-flow zeigen
   git push -u origin main
   ```
   **403 / Permission denied:** macOS nutzt oft einen anderen GitHub-Login (z. B. `piets3n`). Alte Credentials löschen (Keychain → `github.com`), dann erneut pushen und als **Pietsen** anmelden — oder [Personal Access Token](https://github.com/settings/tokens) vom Account **Pietsen** (Scope `repo`) als Passwort verwenden. Alternative: SSH-Remote `git@github.com:Pietsen/process-to-flow.git` mit einem Key, der bei **Pietsen** hinterlegt ist.
2. Bei [render.com](https://render.com) anmelden → **New** → **Blueprint** (oder **Web Service** → Docker).
3. Repo **Pietsen/process-to-flow** verbinden. Git-Root = Projektordner ( `Dockerfile` und `render.yaml` liegen im Repo-Root).
4. Beim Deploy **`OPENAI_API_KEY`** als Secret setzen (Pflicht).
5. Warten bis **Live** — Link kopieren und an HR schicken.

### Was HR macht

1. Link öffnen.
2. Optional **Beispiel laden** klicken.
3. **Generate** — fertig.

Keine Installation, kein Login (Prototype).

### Hinweise für Tester

- **Kostenloser Render-Plan:** App schläft nach Inaktivität; erster Aufruf kann **30–60 Sekunden** dauern.
- **Daten:** Gespeicherte Prozesse sind **flüchtig** (Neustart = leer).
- **OpenAI:** Jeder Generate-Klick verbraucht wenig API-Guthaben — für Demos reicht meist wenige Euro.

## Alternative: Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub.
2. Service aus Root-**Dockerfile** (`process-to-flow/Dockerfile`) bauen.
3. Variable `OPENAI_API_KEY` setzen, `PORT` von Railway übernehmen lassen (Plattform setzt oft automatisch — ggf. `PORT=8080` im Service prüfen).
4. **Public URL** generieren und teilen.

## Lokal testen wie in Production (eine URL)

```bash
cd process-to-flow
export OPENAI_API_KEY='dein-key'
docker build -t process-to-flow .
docker run --rm -p 8080:10000 -e PORT=10000 -e OPENAI_API_KEY "$OPENAI_API_KEY" process-to-flow
```

Browser: http://localhost:8080

## Sicherheit vor öffentlichem Link

- API-Key **nur** auf der Plattform, nie im Frontend.
- Für breitere Nutzung später: Login, Rate-Limits, Usage-Cap bei OpenAI.
