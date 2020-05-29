import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDomain = state => state.get('PXKDeliBasket', initialState);

export const fieldsData = () =>
  createSelector(selectDomain, state => state.get('fieldsData'));

export const defaultValues = () =>
  createSelector(selectDomain, state => state.get('defaultValues'));

export const submittedValues = () =>
  createSelector(selectDomain, state => state.get('submittedValues'));

export const isSubmitted = () =>
  createSelector(selectDomain, state => state.get('isSubmitted'));

export const tableData = () =>
  createSelector(selectDomain, state => state.get('tableData'));
