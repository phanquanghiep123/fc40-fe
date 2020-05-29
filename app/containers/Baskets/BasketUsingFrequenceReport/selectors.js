import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBasketUsingFrequenceReportDomain = state =>
  state.get('basketUsingFrequenceReport', initialState);
const makeSelectBasketUsingFrequenceReport = () =>
  createSelector(selectBasketUsingFrequenceReportDomain, substate =>
    substate.toJS(),
  );
export const tableData = () =>
  createSelector(selectBasketUsingFrequenceReportDomain, substate =>
    substate.get('table'),
  );

export const paramsSearchSelect = () =>
  createSelector(selectBasketUsingFrequenceReportDomain, substate =>
    substate.get('paramsSearch'),
  );

export const formDataSelector = () =>
  createSelector(selectBasketUsingFrequenceReportDomain, substate =>
    substate.get('formData'),
  );

export const listData = arr =>
  createSelector(selectBasketUsingFrequenceReportDomain, substate =>
    substate.get(arr),
  );

export default makeSelectBasketUsingFrequenceReport;
export { selectBasketUsingFrequenceReportDomain };
