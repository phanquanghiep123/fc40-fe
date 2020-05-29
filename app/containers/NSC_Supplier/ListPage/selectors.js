import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSupplierListPageDomain = state =>
  state.get('SupplierListPage', initialState);

export const SupplierListPage = () =>
  createSelector(selectSupplierListPageDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectSupplierListPageDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectSupplierListPageDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectSupplierListPageDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const tableData = () =>
  createSelector(selectSupplierListPageDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableSelectedRecords = () =>
  createSelector(selectSupplierListPageDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );

export default SupplierListPage;
