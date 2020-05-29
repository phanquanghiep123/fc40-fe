import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBCDUSLDH = state => state.get('BCDUSLDHListPage', initialState);

export const tableData = () =>
  createSelector(selectBCDUSLDH, state => state.getIn(['table', 'data']));

export const formData = () =>
  createSelector(selectBCDUSLDH, state => state.getIn(['form', 'data']));
export const formDefaultValues = () =>
  createSelector(selectBCDUSLDH, state =>
    state.getIn(['form', 'defaultValues']),
  );
export const formSubmittedValues = () =>
  createSelector(selectBCDUSLDH, state =>
    state.getIn(['form', 'submittedValues']),
  );
export const formIsSubmitted = () =>
  createSelector(selectBCDUSLDH, state => state.getIn(['form', 'isSubmitted']));
