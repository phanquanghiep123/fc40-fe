import { createSelector } from 'reselect';
import { initialState } from './reducer';

const Domain = state =>
  state.get('HistoryPhysicalInventoryReport', initialState);

export const HistoryPhysicalInventoryReport = () =>
  createSelector(Domain, state => state.toJS());

export const formData = () =>
  createSelector(Domain, state => state.getIn(['form', 'data']));

export const formValues = () =>
  createSelector(Domain, state => state.getIn(['table', 'data']));

export const formDefaultValues = () =>
  createSelector(Domain, state => state.getIn(['form', 'defaultValues']));

export const formSubmittedValues = () =>
  createSelector(Domain, state => state.getIn(['form', 'submittedValues']));

export const tableData = () =>
  createSelector(Domain, state => state.getIn(['table', 'data']));

export const tableSelectedRecords = () =>
  createSelector(Domain, state => state.getIn(['table', 'selectedRecords']));

export default HistoryPhysicalInventoryReport;
