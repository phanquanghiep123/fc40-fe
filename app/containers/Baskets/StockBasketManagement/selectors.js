import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectStockBasketManagementDomain = state =>
  state.get('stockBasketManagement', initialState);
const makeSelectStockBasketManagement = () =>
  createSelector(selectStockBasketManagementDomain, substate =>
    substate.toJS(),
  );
export const tableData = () =>
  createSelector(selectStockBasketManagementDomain, substate =>
    substate.get('table'),
  );
export const paramsSearchSelect = () =>
  createSelector(selectStockBasketManagementDomain, substate =>
    substate.get('paramsSearch'),
  );
export const formDataSelector = () =>
  createSelector(selectStockBasketManagementDomain, substate =>
    substate.get('formData'),
  );
export const listData = arr =>
  createSelector(selectStockBasketManagementDomain, substate =>
    substate.get(arr),
  );

export default makeSelectStockBasketManagement;
export { selectStockBasketManagementDomain };
