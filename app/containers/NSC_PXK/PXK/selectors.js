import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPXK = state => state.get('pxk', initialState);

const makeSelectData = (prop = 'units') =>
  createSelector(selectPXK, reducerState => reducerState.get(prop));

const makeSelectUnits = () =>
  createSelector(selectPXK, units => units.get('units'));

const makeSelectReceiverUnits = () =>
  createSelector(selectPXK, units => units.get('receiverUnits'));

const makeSelectExportTypes = () =>
  createSelector(selectPXK, exportTypes => exportTypes.get('exportTypes'));

const makeSelectWarehouse = () =>
  createSelector(selectPXK, warehouse => warehouse.get('warehouse'));

const makeSelectInitSchema = () =>
  createSelector(selectPXK, initSchema => initSchema.get('initSchema'));

const makeSelectListRequestDestroy = () =>
  createSelector(selectPXK, initSchema => initSchema.get('listRequestDestroy'));

export {
  selectPXK,
  makeSelectData,
  makeSelectUnits,
  makeSelectReceiverUnits,
  makeSelectExportTypes,
  makeSelectWarehouse,
  makeSelectInitSchema,
  makeSelectListRequestDestroy,
};
