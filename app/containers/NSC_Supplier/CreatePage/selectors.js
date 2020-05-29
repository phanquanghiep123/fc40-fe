import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectInitSupplier = state => state.get('SupplierForm', initialState);

const makeSelectInitData = () =>
  createSelector(selectInitSupplier, state => state.get('initData'));

export { makeSelectInitData };
