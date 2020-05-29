import { createRequestRoutine } from 'utils/sagaUtils';

export const masterRoutine = createRequestRoutine(
  'master',
  'fc40/BBGNHHCreate',
);

export const bbgnhhRoutine = createRequestRoutine(
  'bbgnhh',
  'fc40/BBGNHHCreate',
);

export const leadtimeRoutine = createRequestRoutine(
  'leadtime',
  'fc40/BBGNHHCreate',
);

export const exportReceiptsRoutine = createRequestRoutine(
  'exportReceipts',
  'fc40/BBGNHHCreate',
);

export const deliveryStocksRoutine = createRequestRoutine(
  'deliveryStocks',
  'fc40/BBGNHHCreate',
);
