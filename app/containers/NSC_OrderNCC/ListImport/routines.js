import { createRequestRoutine } from 'utils/sagaUtils';

export const masterRoutine = createRequestRoutine(
  'master',
  'fc40/ListImportNCC',
);

export const importFilesRoutine = createRequestRoutine(
  'importFiles',
  'fc40/ListImportNCC',
);
