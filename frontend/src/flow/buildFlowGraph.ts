import type { Edge, Node } from '@xyflow/react';
import type { ProcessResult } from '../types';
import { actorColor } from '../utils/actorColor';
import { buildFlowEdges } from './buildFlowEdges';
import { layoutGraph } from './layoutGraph';

export function buildFlowGraph(result: ProcessResult): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    ...result.steps.map((step) => ({
      id: step.id,
      type: 'task' as const,
      position: { x: 0, y: 0 },
      data: { label: step.label, actor: step.actor, color: actorColor(step.actor) },
    })),
    ...result.decisions.map((decision) => ({
      id: decision.id,
      type: 'decision' as const,
      position: { x: 0, y: 0 },
      data: { label: decision.label, actor: decision.actor, color: actorColor(decision.actor) },
    })),
  ];

  const edges = buildFlowEdges(result);
  const layoutNodes = layoutGraph(nodes, edges);

  return { nodes: layoutNodes, edges };
}
