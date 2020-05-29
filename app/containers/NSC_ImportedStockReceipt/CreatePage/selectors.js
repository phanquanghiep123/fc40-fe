import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectImportedStockReceipt = state =>
  state.get('importedStockReceipt', initialState);

const makeSelectInitialSchema = () =>
  createSelector(selectImportedStockReceipt, importedStockReceiptState =>
    importedStockReceiptState.get('initialSchema'),
  );

const makeSelectOrganizations = () =>
  createSelector(selectImportedStockReceipt, importedStockReceiptState =>
    importedStockReceiptState.get('organizations'),
  );

const makeSelectImportSubType = () =>
  createSelector(selectImportedStockReceipt, importedStockReceiptState =>
    importedStockReceiptState.get('importSubType'),
  );

const makeSelectOpenDl = () =>
  createSelector(selectImportedStockReceipt, importedStockReceiptState =>
    importedStockReceiptState.get('openDl'),
  );

const makeSelectItemId = () =>
  createSelector(selectImportedStockReceipt, importedStockReceiptState =>
    importedStockReceiptState.get('itemId'),
  );

export {
  makeSelectInitialSchema,
  makeSelectOrganizations,
  makeSelectImportSubType,
  makeSelectOpenDl,
  makeSelectItemId,
};
