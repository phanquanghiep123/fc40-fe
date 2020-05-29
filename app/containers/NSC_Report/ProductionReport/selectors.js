import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCancelRequest = state =>
  state.get('productionReport', initialState);

export const tableData = () =>
  createSelector(selectCancelRequest, state => state.getIn(['table', 'data']));

export const totalRowData = () =>
  createSelector(selectCancelRequest, state =>
    state.getIn(['table', 'totalRowData']),
  );

export const formData = () =>
  createSelector(selectCancelRequest, state => state.getIn(['form', 'data']));
export const formDefaultValues = () =>
  createSelector(selectCancelRequest, state =>
    state.getIn(['form', 'defaultValues']),
  );
export const formSubmittedValues = () =>
  createSelector(selectCancelRequest, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectCancelRequest, state =>
    state.getIn(['form', 'isSubmitted']),
  );
export const tableSelectedRecords = () =>
  createSelector(selectCancelRequest, state =>
    state.getIn(['table', 'selectedRecords']),
  );
