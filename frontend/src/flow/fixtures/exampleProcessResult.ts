import type { ProcessResult } from '../../types';

/** Fixed LLM-shaped payload for tests and manual layout checks (see pnpm test). */
export const EXAMPLE_PROCESS_RESULT: ProcessResult = {
  steps: [
    { id: 's1', label: 'Bestellanforderung eintragen', actor: 'Mitarbeiter', type: 'task' },
    { id: 's2', label: 'Anforderung prüfen', actor: 'Vorgesetzter', type: 'task' },
    { id: 's3', label: 'Angebote einholen', actor: 'Einkauf', type: 'task' },
    { id: 's4', label: 'Bestellung erstellen', actor: 'Einkauf', type: 'task' },
    { id: 's5', label: 'Mitarbeiter informieren', actor: 'Einkauf', type: 'task' },
    { id: 's6', label: 'Ablehnung mitteilen', actor: 'Vorgesetzter', type: 'task' },
  ],
  decisions: [
    {
      id: 'd1',
      label: 'Genehmigt?',
      actor: 'Vorgesetzter',
      yesBranch: 's3',
      noBranch: 's6',
    },
    {
      id: 'd2',
      label: 'Betrag > 10.000 €?',
      actor: 'Einkauf',
      yesBranch: 's4',
      noBranch: 's5',
    },
  ],
  actors: ['Einkauf', 'Mitarbeiter', 'Vorgesetzter'],
};
