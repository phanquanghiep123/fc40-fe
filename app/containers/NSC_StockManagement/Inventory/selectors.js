import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectInventory = state => state.get('Inventory', initialState);

export const makeSelectData = () =>
  createSelector(selectInventory, reducerState =>
    reducerState.get('initValue'),
  );
export const getDataMaster = () =>
  createSelector(selectInventory, reducerState => reducerState.get('master'));
