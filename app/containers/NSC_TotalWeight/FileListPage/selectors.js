import { createSelector } from 'reselect/lib/index';
import { initialState } from './reducer';

const selectDomain = state =>
  state.get('totalWeightFileListPage', initialState);

// export const totalWeightFileListPage = () =>
//   createSelector(selectDomain, state => state.toJS());

export const tableData = () =>
  createSelector(selectDomain, state => state.getIn(['table', 'data']));

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
