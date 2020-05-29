export const basketsInUseFields = {
  id: 'id',
  stt: 'stt',
  basketLocatorCode: 'basketLocatorCode',
  basketLocatorName: 'basketLocatorName',
  palletBasketShortName: 'palletBasketShortName',
  locatorType: 'locatorType',
  palletBasketCode: 'palletBasketCode',
  palletBasketName: 'palletBasketName',
  maxCancelQuantity: 'maxCancelQuantity',
  inStockQuantity: 'inStockQuantity',
  cancelQuantity: 'cancelQuantity',
  inStockQuantityDiff: 'inStockQuantityDiff',
  maxCancelQuantityDiff: 'maxCancelQuantityDiff',
  uom: 'uom',
  images: 'images',
  note: 'note',
  assetStatus: 'assetStatus',
  causeCode: 'causeCode',
  cause: 'cause',
  cancelRequestBasketDetailCode: 'cancelRequestBasketDetailCode',
  isLoadedFromServer: 'isLoadedFromServer',
  isDeleted: 'isDeleted',
  isDeletable: 'isDeletable',
  isRefactorImage: 'isRefactorImage',
};

/**
 * Assets table fields
 */
export const assetsTableFields = {
  stt: 'stt',
  id: 'id',
  assetCode: 'assetCode',
  ownerCode: 'ownerCode',
  ownerName: 'ownerName',
  palletBasketCode: 'palletBasketCode',
  palletBasketName: 'palletBasketName',
  cancelValue: 'cancelValue',
  currentCancelValue: 'currentCancelValue',
  cancelQuantity: 'cancelQuantity',
  unitPrice: 'unitPrice',
  currentUnitPrice: 'currentUnitPrice',
  uom: 'uom',
  causeCode: 'causeCode',
  cause: 'cause',
  assetStatus: 'assetStatus',
  // images: 'images',
  note: 'note',
  seqFC: 'seqFC',
  cancelRequestBasketDetailCode: 'cancelRequestBasketDetailCode',
  inventoryQuantity: 'inventoryQuantity',
  depreciationRemaining: 'depreciationRemaining',
};

/**
 * Baskets Info Table Fields
 */
export const basketsInfoFields = {
  stt: 'stt',
  palletBasketCode: 'palletBasketCode',
  palletBasketName: 'palletBasketName',
  cancelQuantityInUse: 'cancelQuantityInUse',
  cancelQuantityInStock: 'cancelQuantityInStock',
  inUseInStockDiff: 'inUseInStockDiff',
  uom: 'uom',
};
