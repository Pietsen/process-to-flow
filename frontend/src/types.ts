export interface ProcessStep {
  id: string;
  label: string;
  actor: string;
  type: 'task';
}

export interface ProcessDecision {
  id: string;
  label: string;
  actor: string;
  yesBranch: string;
  noBranch: string;
}

export interface ProcessResult {
  steps: ProcessStep[];
  decisions: ProcessDecision[];
  actors: string[];
}
