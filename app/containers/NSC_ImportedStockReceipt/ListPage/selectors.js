import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectImportStockListPageDomain = state =>
  state.get('ImportStockListPage', initialState);

export const importStockListPage = () =>
  createSelector(selectImportStockListPageDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectImportStockListPageDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectImportStockListPageDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectImportStockListPageDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectImportStockListPageDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectImportStockListPageDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableSelectedRecords = () =>
  createSelector(selectImportStockListPageDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );

export default importStockListPage;
