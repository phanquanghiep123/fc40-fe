import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBBGNHH = state => state.get('BBGNHH', initialState);

export const tableData = () =>
  createSelector(selectBBGNHH, state => state.getIn(['table', 'data']));

export const formData = () =>
  createSelector(selectBBGNHH, state => state.getIn(['form', 'data']));
export const formDefaultValues = () =>
  createSelector(selectBBGNHH, state => state.getIn(['form', 'defaultValues']));
export const formSubmittedValues = () =>
  createSelector(selectBBGNHH, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectBBGNHH, state => state.getIn(['form', 'isSubmitted']));
export const tableSelectedRecords = () =>
  createSelector(selectBBGNHH, state =>
    state.getIn(['table', 'selectedRecords']),
  );
