import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectConfirmDataLSX = state => state.get('confirmDataLSX', initialState);

export const tableData = () =>
  createSelector(selectConfirmDataLSX, state => state.getIn(['table', 'data']));

export const tableOriginalData = () =>
  createSelector(selectConfirmDataLSX, state =>
    state.getIn(['table', 'originalData']),
  );

export const formData = () =>
  createSelector(selectConfirmDataLSX, state => state.getIn(['form', 'data']));

export const formSubmittedValues = () =>
  createSelector(selectConfirmDataLSX, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formDefaultValues = () =>
  createSelector(selectConfirmDataLSX, state =>
    state.getIn(['form', 'defaultValues']),
  );
