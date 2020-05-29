import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the exportImportPropertyList state domain
 */

const selectExportImportPropertyListDomain = state =>
  state.get('exportImportPropertyList', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExportImportPropertyList
 */

const makeSelectExportImportPropertyList = () =>
  createSelector(selectExportImportPropertyListDomain, substate =>
    substate.toJS(),
  );

export const tableData = () =>
  createSelector(selectExportImportPropertyListDomain, substate =>
    substate.get('table'),
  );
export const paramsSearchSelect = () =>
  createSelector(selectExportImportPropertyListDomain, substate =>
    substate.get('paramsSearch'),
  );
export const listData = arr =>
  createSelector(selectExportImportPropertyListDomain, substate =>
    substate.get(arr),
  );

export default makeSelectExportImportPropertyList;
export { selectExportImportPropertyListDomain };
