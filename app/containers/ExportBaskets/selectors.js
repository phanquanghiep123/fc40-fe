import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the exportBaskets state domain
 */

const selectExportBasketsDomain = state =>
  state.get('exportBaskets', initialState);
const makeSelectExportBaskets = () =>
  createSelector(selectExportBasketsDomain, substate => substate.toJS());
export const tableData = () =>
  createSelector(selectExportBasketsDomain, substate => substate.get('table'));
export const paramsSearchSelect = () =>
  createSelector(selectExportBasketsDomain, substate =>
    substate.get('paramsSearch'),
  );
export const listData = arr =>
  createSelector(selectExportBasketsDomain, substate => substate.get(arr));

export default makeSelectExportBaskets;
export { selectExportBasketsDomain };
