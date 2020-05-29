import { createSelector } from 'reselect';
import { initialState } from './reducer';

const domain = state => state.get('BorrowBasketReport', initialState);

export const BorrowBasketReport = () =>
  createSelector(domain, state => state.toJS());

export const formData = () =>
  createSelector(domain, state => state.getIn(['form', 'data']));

export const formValues = () =>
  createSelector(domain, state => state.getIn(['table', 'data']));

export const formDefaultValues = () =>
  createSelector(domain, state => state.getIn(['form', 'defaultValues']));

export const formSubmittedValues = () =>
  createSelector(domain, state => state.getIn(['form', 'submittedValues']));

export const tableData = () =>
  createSelector(domain, state => state.getIn(['table', 'data']));

export const totalRowData = () =>
  createSelector(domain, state => state.getIn(['table', 'totalRowData']));

export const totalTable = () =>
  createSelector(domain, state => state.getIn(['table', 'total']));

export const tableSelectedRecords = () =>
  createSelector(domain, state => state.getIn(['table', 'selectedRecords']));

export const formIsSubmitted = () =>
  createSelector(domain, state => state.getIn(['form', 'isSubmitted']));

export default BorrowBasketReport;
