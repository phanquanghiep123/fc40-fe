import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectImportedStockReceiptDetail = state =>
  state.get('ImportedStockReceiptDetail', initialState);

const makeSelectInitialSchema = () =>
  createSelector(selectImportedStockReceiptDetail, importedStockReceiptState =>
    importedStockReceiptState.get('initialSchema'),
  );
const makeSelectData = () =>
  createSelector(selectImportedStockReceiptDetail, importedStockReceiptState =>
    importedStockReceiptState.get('data'),
  );

const makeSelectCompleteSuccess = () =>
  createSelector(selectImportedStockReceiptDetail, importedStockReceiptState =>
    importedStockReceiptState.get('completeSuccess'),
  );

export { makeSelectInitialSchema, makeSelectData, makeSelectCompleteSuccess };
