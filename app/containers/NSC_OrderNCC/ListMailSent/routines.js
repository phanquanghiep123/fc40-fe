import { createRequestRoutine } from 'utils/sagaUtils';

export const masterRoutine = createRequestRoutine(
  'master',
  'fc40/ListMailSent',
);

export const suppliersRoutine = createRequestRoutine(
  'suppliers',
  'fc40/ListMailSent',
);
