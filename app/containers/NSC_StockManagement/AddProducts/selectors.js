import { createSelector } from 'reselect';

import { initialState } from './reducer';

export const selectReducer = state =>
  state.get('stockManagementAdd', initialState);
export const makeSelectData = () =>
  createSelector(selectReducer, reducerState => reducerState.get('master'));
export const makeSelectFormData = () =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn(['data', 'formData']),
  );
export const makeSelectWareHouse = () =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn(['data', 'formData', 'warehouse']),
  );
