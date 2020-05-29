import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBBGNHHDeliSuggest = state =>
  state.get('BBGNHHDeliSuggest', initialState);

export const tableData = () =>
  createSelector(selectBBGNHHDeliSuggest, state =>
    state.getIn(['table', 'data']),
  );

export const formData = () =>
  createSelector(selectBBGNHHDeliSuggest, state =>
    state.getIn(['form', 'data']),
  );
export const formDefaultValues = () =>
  createSelector(selectBBGNHHDeliSuggest, state =>
    state.getIn(['form', 'defaultValues']),
  );
export const formSubmittedValues = () =>
  createSelector(selectBBGNHHDeliSuggest, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectBBGNHHDeliSuggest, state =>
    state.getIn(['form', 'isSubmitted']),
  );
export const tableSelectedRecords = () =>
  createSelector(selectBBGNHHDeliSuggest, state =>
    state.getIn(['table', 'selectedRecords']),
  );
