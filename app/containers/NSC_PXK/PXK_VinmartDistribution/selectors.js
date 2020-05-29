import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDomain = state =>
  state.get('PXK_VinmartDistribution', initialState);

export const tableData = () =>
  createSelector(selectDomain, store => store.getIn(['table', 'data']));

export const tableOriginalData = () =>
  createSelector(selectDomain, store => store.getIn(['table', 'originalData']));

export const formData = () =>
  createSelector(selectDomain, store => store.getIn(['form', 'data']));

export const formDefaultValues = () =>
  createSelector(selectDomain, store => store.getIn(['form', 'defaultValues']));

export const formSubmittedValues = () =>
  createSelector(selectDomain, store =>
    store.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectDomain, store => store.getIn(['form', 'isSubmitted']));

export const makeSelectData = (section, prop = 'data') =>
  createSelector(selectDomain, store => store.getIn([section, prop]));
