# Graph visuell und automatisch prüfen

## In der UI

Nach **Generate** zeigt die Sidebar **Graph-Check**:

- **Struktur ok** — alle Kanten zeigen auf existierende Knoten, Entscheidungen haben gültige Ja/Nein-Zweige.
- **Fehler** (rot) — z. B. `yesBranch` zeigt auf eine unbekannte Step-ID (LLM-Output inkonsistent).
- **Hinweise** (gelb) — z. B. isolierte Knoten ohne Verbindung.

Visuell solltest du zusätzlich prüfen:

1. **Top-down-Fluss** — Start oben, Ende unten (Auto-Layout via dagre).
2. **Entscheidungen** — genau zwei ausgehende Kanten (**Ja** / **Nein**).
3. **Keine unnötigen Querverbindungen** — Zweige sollten nicht zusätzlich in der Hauptkette aller Steps hängen.

React Flow **Controls** (Zoom) und **MiniMap** helfen beim Review.

## Automatisiert (Frontend)

```bash
cd frontend
pnpm test
```

Die Tests nutzen ein festes Beispiel-JSON (`src/flow/fixtures/exampleProcessResult.ts`) und prüfen u. a.:

- Validierung ohne Fehler
- keine falsche Hauptketten-Kante zu Branch-Steps
- dagre vergibt eindeutige Positionen

## Rohdaten vom LLM

Im Browser DevTools → **Network** → `POST /api/process` → Response-JSON mit `steps`, `decisions`, `actors` vergleichen.

Wenn die Struktur stimmt, aber das Layout noch unschön wirkt, liegt es am **Mapping** (Frontend), nicht am LLM.
