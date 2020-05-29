import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectFileDelivery = state => state.get('fileDelivery', initialState);

export const tableData = () =>
  createSelector(selectFileDelivery, state => state.getIn(['table', 'data']));

export const formData = () =>
  createSelector(selectFileDelivery, state => state.getIn(['form', 'data']));
export const formDefaultValues = () =>
  createSelector(selectFileDelivery, state =>
    state.getIn(['form', 'defaultValues']),
  );
export const formSubmittedValues = () =>
  createSelector(selectFileDelivery, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectFileDelivery, state =>
    state.getIn(['form', 'isSubmitted']),
  );
export const tableSelectedRecords = () =>
  createSelector(selectFileDelivery, state =>
    state.getIn(['table', 'selectedRecords']),
  );
