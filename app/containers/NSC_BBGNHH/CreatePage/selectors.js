import { createSelector } from 'reselect';

import { initialState } from './reducer';

export const selectReducer = state => state.get('bbgnhhCreate', initialState);

export const makeSelectProp = section =>
  createSelector(selectReducer, reducerState => reducerState.get(section));

export const makeSelectData = (section, prop = 'data') =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, prop]),
  );
