import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectApprovalPriceListDomain = state =>
  state.get('ApprovalPriceList', initialState);

export const approvedPriceListPage = () =>
  createSelector(selectApprovalPriceListDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectApprovalPriceListDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectApprovalPriceListDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectApprovalPriceListDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectApprovalPriceListDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectApprovalPriceListDomain, state =>
    state.getIn(['table', 'data']),
  );

export default approvedPriceListPage;
