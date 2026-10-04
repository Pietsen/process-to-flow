import { useCallback, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { generateProcess } from './api';
import { buildFlowGraph } from './flow/buildFlowGraph';
import { buildFlowEdges } from './flow/buildFlowEdges';
import { validateProcessGraph } from './flow/validateProcessGraph';
import { DecisionNode } from './nodes/DecisionNode';
import { TaskNode } from './nodes/TaskNode';
import { EXAMPLE_PROCESS_PROMPT } from './examplePrompt';
import type { ProcessResult } from './types';
import styles from './App.module.css';

const nodeTypes = {
  task: TaskNode,
  decision: DecisionNode,
};

export default function App() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const graph = useMemo(() => (result ? buildFlowGraph(result) : { nodes: [], edges: [] }), [result]);

  const validation = useMemo(() => {
    if (!result) {
      return null;
    }
    return validateProcessGraph(result, buildFlowEdges(result));
  }, [result]);

  const onGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await generateProcess(description);
      setResult(parsed);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Diagramm konnte nicht erstellt werden.');
    } finally {
      setLoading(false);
    }
  }, [description]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <header className={styles.header}>
          <h1>Process-to-Flow</h1>
          <p>
            Prozess in natürlicher Sprache beschreiben und als Flow-Diagramm darstellen.
          </p>
        </header>

        <label className={styles.label} htmlFor="description">
          Prozessbeschreibung
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          placeholder="Beschreibe den Ablauf in natürlicher Sprache (Akteure, Schritte, Wenn-dann-Entscheidungen)…"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={14}
        />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => setDescription(EXAMPLE_PROCESS_PROMPT)}
            disabled={loading}
          >
            Beispiel laden
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={onGenerate}
            disabled={loading || description.trim().length === 0}
          >
            {loading ? 'Erstelle…' : 'Diagramm erstellen'}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {result && (
          <>
            <div className={styles.summary}>
              <h2>Graph-Check</h2>
              {validation?.ok ? (
                <p className={styles.checkOk}>Struktur ok{validation.warnings.length ? ' (mit Hinweisen)' : ''}.</p>
              ) : (
                <p className={styles.checkError}>Struktur fehlerhaft — Diagramm kann unübersichtlich sein.</p>
              )}
              {validation?.errors.map((item) => (
                <p key={item} className={styles.checkError}>
                  {item}
                </p>
              ))}
              {validation?.warnings.map((item) => (
                <p key={item} className={styles.checkWarn}>
                  {item}
                </p>
              ))}
            </div>
            <div className={styles.summary}>
              <h2>Akteure</h2>
              <ul>
                {result.actors.map((actor) => (
                  <li key={actor}>{actor}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </aside>

      <main className={styles.canvas}>
        {!result && !loading && !error && (
          <div className={styles.emptyState}>
            <h2>Noch kein Diagramm</h2>
            <p>Prozessbeschreibung eingeben und „Diagramm erstellen“ wählen.</p>
          </div>
        )}

        {loading && (
          <div className={styles.emptyState}>
            <h2>Diagramm wird erstellt…</h2>
            <p>Die KI strukturiert deinen Prozess.</p>
          </div>
        )}

        {result && !loading && (
          <ReactFlow
            nodes={graph.nodes as Node[]}
            edges={graph.edges as Edge[]}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{ type: 'smoothstep' }}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap />
            <Controls />
            <Background gap={16} size={1} />
          </ReactFlow>
        )}
      </main>
    </div>
  );
}
