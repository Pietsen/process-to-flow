import type { Edge } from '@xyflow/react';
import type { ProcessResult } from '../types';

export interface BranchLabels {
  yes: string;
  no: string;
}

export function buildFlowEdges(
  result: ProcessResult,
  branchLabels: BranchLabels = { yes: 'Yes', no: 'No' },
): Edge[] {
  const edges: Edge[] = [];
  const branchTargets = new Set<string>();

  for (const decision of result.decisions) {
    branchTargets.add(decision.yesBranch);
    branchTargets.add(decision.noBranch);
  }

  for (let i = 1; i < result.steps.length; i += 1) {
    const current = result.steps[i].id;
    if (branchTargets.has(current)) {
      continue;
    }
    const previous = result.steps[i - 1].id;
    edges.push({
      id: `flow-${previous}-${current}`,
      source: previous,
      target: current,
      type: 'smoothstep',
    });
  }

  result.decisions.forEach((decision, index) => {
    const anchor = result.steps[index + 1]?.id ?? result.steps[index]?.id;
    if (anchor) {
      edges.push({
        id: `flow-${anchor}-${decision.id}`,
        source: anchor,
        target: decision.id,
        type: 'smoothstep',
      });
    }

    edges.push(
      {
        id: `${decision.id}-yes`,
        source: decision.id,
        sourceHandle: 'yes',
        target: decision.yesBranch,
        label: branchLabels.yes,
        type: 'smoothstep',
      },
      {
        id: `${decision.id}-no`,
        source: decision.id,
        sourceHandle: 'no',
        target: decision.noBranch,
        label: branchLabels.no,
        type: 'smoothstep',
      },
    );
  });

  return edges;
}
