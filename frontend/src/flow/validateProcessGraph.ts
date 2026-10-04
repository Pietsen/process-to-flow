import type { Edge } from '@xyflow/react';
import type { ProcessResult } from '../types';

export interface GraphValidation {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateProcessGraph(result: ProcessResult, edges: Edge[]): GraphValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nodeIds = new Set([
    ...result.steps.map((step) => step.id),
    ...result.decisions.map((decision) => decision.id),
  ]);

  for (const decision of result.decisions) {
    if (!nodeIds.has(decision.yesBranch)) {
      errors.push(`Entscheidung „${decision.label}“: Ja-Zweig „${decision.yesBranch}“ existiert nicht.`);
    }
    if (!nodeIds.has(decision.noBranch)) {
      errors.push(`Entscheidung „${decision.label}“: Nein-Zweig „${decision.noBranch}“ existiert nicht.`);
    }
    if (decision.yesBranch === decision.noBranch) {
      errors.push(`Entscheidung „${decision.label}“: Ja- und Nein-Zweig sind identisch.`);
    }
  }

  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Kante „${edge.id}“: Quelle „${edge.source}“ fehlt.`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Kante „${edge.id}“: Ziel „${edge.target}“ fehlt.`);
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
      warnings.push(`Schritt „${step.label}“ (${step.id}) ist nicht mit dem Graphen verbunden.`);
    }
  }

  for (const decision of result.decisions) {
    if (!connected.has(decision.id)) {
      warnings.push(`Entscheidung „${decision.label}“ (${decision.id}) ist nicht mit dem Graphen verbunden.`);
    }
  }

  if (result.steps.length === 0) {
    warnings.push('Keine Schritte im LLM-Output.');
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}
