import { createRequestRoutine } from 'utils/sagaUtils';

export const masterRoutine = createRequestRoutine(
  'master',
  'fc40/PXKReceiptList',
);
export const productRoutine = createRequestRoutine(
  'product',
  'fc40/PXKReceiptList',
);
export const receiptsRoutine = createRequestRoutine(
  'receipts',
  'fc40/PXKReceiptList',
);
export const productsRoutine = createRequestRoutine(
  'products',
  'fc40/PXKReceiptList',
);
export const importedRoutine = createRequestRoutine(
  'imported',
  'fc40/PXKReceiptList',
);
export const customerRoutine = createRequestRoutine(
  'customer',
  'fc40/PXKReceiptList',
);
