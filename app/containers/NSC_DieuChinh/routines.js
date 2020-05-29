import { createRequestRoutine } from 'utils/sagaUtils';

export const masterRoutine = createRequestRoutine(
  'master',
  'fc40/PhieuDieuChinh',
);
export const receiptsRoutine = createRequestRoutine(
  'receipts',
  'fc40/PhieuDieuChinh',
);
export const productsRoutine = createRequestRoutine(
  'products',
  'fc40/PhieuDieuChinh',
);
