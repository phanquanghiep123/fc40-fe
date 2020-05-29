import { createSelector } from 'reselect';

import { initialState } from './reducer';

export const selectReducer = state => state.get('phieuDieuChinh', initialState);

export const makeSelectData = (section, prop = 'data') =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, prop]),
  );
