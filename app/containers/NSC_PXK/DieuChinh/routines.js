import { createRequestRoutine } from 'utils/sagaUtils';

export const masterRoutine = createRequestRoutine(
  'master',
  'fc40/PXKDieuChinh',
);

export const locatorRoutine = createRequestRoutine(
  'locator',
  'fc40/PXKDieuChinh',
);

export const receiptsRoutine = createRequestRoutine(
  'receipts',
  'fc40/PXKDieuChinh',
);

export const detailsRoutine = createRequestRoutine(
  'details',
  'fc40/PXKDieuChinh',
);
