import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectExportStockListPageDomain = state =>
  state.get('ExportStockListPage', initialState);

export const importStockListPage = () =>
  createSelector(selectExportStockListPageDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectExportStockListPageDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectExportStockListPageDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectExportStockListPageDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const formSubmittedValues = () =>
  createSelector(selectExportStockListPageDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const tableData = () =>
  createSelector(selectExportStockListPageDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableSelectedRecords = () =>
  createSelector(selectExportStockListPageDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );

export default importStockListPage;
