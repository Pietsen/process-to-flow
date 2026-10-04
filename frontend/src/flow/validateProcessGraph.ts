import type { Edge } from '@xyflow/react';
import type { ProcessResult } from '../types';

export interface GraphIssue {
  key: string;
  params?: Record<string, string>;
}

export interface GraphValidation {
  ok: boolean;
  errors: GraphIssue[];
  warnings: GraphIssue[];
}

export function validateProcessGraph(result: ProcessResult, edges: Edge[]): GraphValidation {
  const errors: GraphIssue[] = [];
  const warnings: GraphIssue[] = [];

  const nodeIds = new Set([
    ...result.steps.map((step) => step.id),
    ...result.decisions.map((decision) => decision.id),
  ]);

  for (const decision of result.decisions) {
    if (!nodeIds.has(decision.yesBranch)) {
      errors.push({
        key: 'graphCheck.decisionYesBranchMissing',
        params: { label: decision.label, branch: decision.yesBranch },
      });
    }
    if (!nodeIds.has(decision.noBranch)) {
      errors.push({
        key: 'graphCheck.decisionNoBranchMissing',
        params: { label: decision.label, branch: decision.noBranch },
      });
    }
    if (decision.yesBranch === decision.noBranch) {
      errors.push({
        key: 'graphCheck.decisionSameBranches',
        params: { label: decision.label },
      });
    }
  }

  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push({
        key: 'graphCheck.edgeSourceMissing',
        params: { edgeId: edge.id, nodeId: edge.source },
      });
    }
    if (!nodeIds.has(edge.target)) {
      errors.push({
        key: 'graphCheck.edgeTargetMissing',
        params: { edgeId: edge.id, nodeId: edge.target },
      });
    }
  }

  const connected = new Set<string>();
  for (const edge of edges) {
    connected.add(edge.source);
    connected.add(edge.target);
  }

  if (result.steps.length > 0) {
    connected.add(result.steps[0].id);
  }

  for (const step of result.steps) {
    if (!connected.has(step.id)) {
      warnings.push({
        key: 'graphCheck.stepDisconnected',
        params: { label: step.label, id: step.id },
      });
    }
  }

  for (const decision of result.decisions) {
    if (!connected.has(decision.id)) {
      warnings.push({
        key: 'graphCheck.decisionDisconnected',
        params: { label: decision.label, id: decision.id },
      });
    }
  }

  if (result.steps.length === 0) {
    warnings.push({ key: 'graphCheck.noSteps' });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
