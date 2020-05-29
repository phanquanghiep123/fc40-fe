import { createRequestRoutine } from 'utils/sagaUtils';

export const masterRoutine = createRequestRoutine(
  'master',
  'fc40/ImportedStockReceipt',
);
export const receiptsRoutine = createRequestRoutine(
  'receipts',
  'fc40/ImportedStockReceipt',
);
export const productRoutine = createRequestRoutine(
  'product',
  'fc40/ImportedStockReceipt',
);
export const importedRoutine = createRequestRoutine(
  'imported',
  'fc40/ImportedStockReceipt',
);

export const customerRoutine = createRequestRoutine(
  'customer',
  'fc40/ImportedStockReceipt',
);
