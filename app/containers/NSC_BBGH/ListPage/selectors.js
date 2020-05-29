import { createSelector } from 'reselect/lib/index';
import { initialState } from './reducer';

const selectDomain = state => state.get('deliveryRecordListPage', initialState);

export const deliveryRecordListPage = () =>
  createSelector(selectDomain, state => state.toJS());

export const tableData = () =>
  createSelector(selectDomain, state => state.getIn(['table', 'data']));

export const tableSelectedRows = () =>
  createSelector(selectDomain, state => state.getIn(['table', 'selectedRows']));

export const formData = () =>
  createSelector(selectDomain, state => state.getIn(['form', 'data']));

export const formIsSubmitted = () =>
  createSelector(selectDomain, state => state.getIn(['form', 'isSubmitted']));

export const formDefaultValues = () =>
  createSelector(selectDomain, state => state.getIn(['form', 'defaultValues']));

export const formSubmittedValues = () =>
  createSelector(selectDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );
