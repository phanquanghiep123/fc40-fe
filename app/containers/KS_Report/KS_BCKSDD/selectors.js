import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPalletBasketByWay = state =>
  state.get('palletBasketByWay', initialState);

export const tableData = () =>
  createSelector(selectPalletBasketByWay, state =>
    state.getIn(['table', 'data']),
  );

export const defaultValues = () =>
  createSelector(selectPalletBasketByWay, state =>
    state.getIn(['form', 'defaultValues']),
  );

export const submittedValues = () =>
  createSelector(selectPalletBasketByWay, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formIsSubmitted = () =>
  createSelector(selectPalletBasketByWay, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const formData = () =>
  createSelector(selectPalletBasketByWay, state =>
    state.getIn(['form', 'data']),
  );

export const totalRow = () =>
  createSelector(selectPalletBasketByWay, state =>
    state.getIn(['table', 'totalRow']),
  );
