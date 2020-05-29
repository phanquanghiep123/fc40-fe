import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRetailListPageDomain = state =>
  state.get('RetailListPage', initialState);

export const RetailListPage = () =>
  createSelector(selectRetailListPageDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['table', 'data']),
  );
export const totalItem = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['table', ' totalItem']),
  );
export const pageIndex = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['table', ' pageIndex']),
  );
export const pageSize = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['table', ' pageSize']),
  );
export const tableSelectedRecords = () =>
  createSelector(selectRetailListPageDomain, state =>
    state.getIn(['table', 'selectedRecords']),
  );

export default RetailListPage;
