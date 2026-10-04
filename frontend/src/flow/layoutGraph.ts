import dagre from 'dagre';
import type { Edge, Node } from '@xyflow/react';

const TASK_WIDTH = 200;
const TASK_HEIGHT = 72;
const DECISION_SIZE = 150;

export function layoutGraph(nodes: Node[], edges: Edge[]): Node[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: 'TB',
    nodesep: 60,
    ranksep: 90,
    marginx: 40,
    marginy: 40,
  });

  for (const node of nodes) {
    const isDecision = node.type === 'decision';
    graph.setNode(node.id, {
      width: isDecision ? DECISION_SIZE : TASK_WIDTH,
      height: isDecision ? DECISION_SIZE : TASK_HEIGHT,
    });
  }

  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target);
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const layoutNode = graph.node(node.id);
    const isDecision = node.type === 'decision';
    const width = isDecision ? DECISION_SIZE : TASK_WIDTH;
    const height = isDecision ? DECISION_SIZE : TASK_HEIGHT;
    return {
      ...node,
      position: {
        x: layoutNode.x - width / 2,
        y: layoutNode.y - height / 2,
      },
    };
  });
}
