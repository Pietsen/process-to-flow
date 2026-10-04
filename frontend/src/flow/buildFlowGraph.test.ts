import { describe, expect, it } from 'vitest';
import { buildFlowGraph } from './buildFlowGraph';
import { buildFlowEdges } from './buildFlowEdges';
import { EXAMPLE_PROCESS_RESULT } from './fixtures/exampleProcessResult';
import { validateProcessGraph } from './validateProcessGraph';

describe('buildFlowGraph', () => {
  it('produces a valid graph for the example process', () => {
    const edges = buildFlowEdges(EXAMPLE_PROCESS_RESULT);
    const validation = validateProcessGraph(EXAMPLE_PROCESS_RESULT, edges);

    expect(validation.ok).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it('does not chain branch-only steps on the main line', () => {
    const edges = buildFlowEdges(EXAMPLE_PROCESS_RESULT);
    const edgeIds = new Set(edges.map((edge) => edge.id));

    expect(edgeIds.has('flow-s2-s3')).toBe(false);
    expect(edgeIds.has('flow-s2-s6')).toBe(false);
  });

  it('assigns distinct positions via dagre layout', () => {
    const { nodes } = buildFlowGraph(EXAMPLE_PROCESS_RESULT);
    const positions = nodes.map((node) => `${node.position.x},${node.position.y}`);
    const unique = new Set(positions);

    expect(unique.size).toBe(nodes.length);
  });
});
