import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTotalWeight = state => state.get('totalWeight', initialState);

export const tableData = () =>
  createSelector(selectTotalWeight, totalWeight =>
    totalWeight.getIn(['table', 'data']),
  );

export const tableOriginalData = () =>
  createSelector(selectTotalWeight, totalWeight =>
    totalWeight.getIn(['table', 'originalData']),
  );

export const formData = () =>
  createSelector(selectTotalWeight, totalWeight =>
    totalWeight.getIn(['form', 'data']),
  );

export const formDefaultValues = () =>
  createSelector(selectTotalWeight, totalWeight =>
    totalWeight.getIn(['form', 'defaultValues']),
  );

export const formSubmittedValues = () =>
  createSelector(selectTotalWeight, totalWeight =>
    totalWeight.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectTotalWeight, totalWeight =>
    totalWeight.getIn(['form', 'isSubmitted']),
  );

export const makeSelectData = (section, prop = 'data') =>
  createSelector(selectTotalWeight, totalWeight =>
    totalWeight.getIn([section, prop]),
  );
