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
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ApiError, generateProcess } from './api';
import { buildFlowGraph } from './flow/buildFlowGraph';
import { buildFlowEdges } from './flow/buildFlowEdges';
import { validateProcessGraph, type GraphIssue } from './flow/validateProcessGraph';
import { DecisionNode } from './nodes/DecisionNode';
import { TaskNode } from './nodes/TaskNode';
import type { ProcessResult } from './types';
import styles from './App.module.css';

const nodeTypes = {
  task: TaskNode,
  decision: DecisionNode,
};

function formatIssue(issue: GraphIssue, translate: (key: string, params?: Record<string, string>) => string) {
  return translate(issue.key, issue.params);
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const branchLabels = useMemo(
    () => ({ yes: t('flow.yes'), no: t('flow.no') }),
    [t, i18n.language],
  );

  const graph = useMemo(
    () => (result ? buildFlowGraph(result, branchLabels) : { nodes: [], edges: [] }),
    [result, branchLabels],
  );

  const validation = useMemo(() => {
    if (!result) {
      return null;
    }
    return validateProcessGraph(result, buildFlowEdges(result, branchLabels));
  }, [result, branchLabels]);

  const onGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await generateProcess(description);
      setResult(parsed);
    } catch (err) {
      setResult(null);
      if (err instanceof ApiError && err.code === 'rate_limited') {
        setError(t('errors.rateLimited'));
      } else if (err instanceof ApiError && err.code === 'prompt_rejected') {
        setError(t('errors.promptRejected'));
      } else {
        setError(err instanceof Error ? err.message : t('errors.generateFailed'));
      }
    } finally {
      setLoading(false);
    }
  }, [description, t]);

  const onLoadExample = useCallback(() => {
    setDescription(t('examplePrompt'));
  }, [t]);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1>{t('app.title')}</h1>
            <LanguageSwitcher />
          </div>
          <p>{t('app.tagline')}</p>
        </header>

        <label className={styles.label} htmlFor="description">
          {t('form.descriptionLabel')}
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          placeholder={t('form.descriptionPlaceholder')}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={14}
        />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={onLoadExample}
            disabled={loading}
          >
            {t('form.loadExample')}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={onGenerate}
            disabled={loading || description.trim().length === 0}
          >
            {loading ? t('form.generating') : t('form.generate')}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {result && validation && (
          <>
            <div className={styles.summary}>
              <h2>{t('graphCheck.title')}</h2>
              {validation.ok ? (
                <p className={styles.checkOk}>
                  {validation.warnings.length > 0
                    ? t('graphCheck.okWithWarnings')
                    : t('graphCheck.ok')}
                </p>
              ) : (
                <p className={styles.checkError}>{t('graphCheck.invalid')}</p>
              )}
              {validation.errors.map((item) => (
                <p key={`${item.key}-${JSON.stringify(item.params)}`} className={styles.checkError}>
                  {formatIssue(item, t)}
                </p>
              ))}
              {validation.warnings.map((item) => (
                <p key={`${item.key}-${JSON.stringify(item.params)}`} className={styles.checkWarn}>
                  {formatIssue(item, t)}
                </p>
              ))}
            </div>
            <div className={styles.summary}>
              <h2>{t('actors.title')}</h2>
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
            <h2>{t('canvas.emptyTitle')}</h2>
            <p>{t('canvas.emptyHint')}</p>
          </div>
        )}

        {loading && (
          <div className={styles.emptyState}>
            <h2>{t('canvas.loadingTitle')}</h2>
            <p>{t('canvas.loadingHint')}</p>
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
