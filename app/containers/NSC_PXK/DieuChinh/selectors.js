import { createSelector } from 'reselect';

import { initialState } from './reducer';

export const selectReducer = state => state.get('pxkDieuChinh', initialState);

export const makeSelectData = (section, prop = 'data') =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, prop]),
  );

export const makeSelectDetails = () =>
  createSelector(selectReducer, reducerState => reducerState.get('details'));

export const makeSelectFormSearch = () =>
  createSelector(selectReducer, reducerState => reducerState.get('formSearch'));

export const makeSelectFormSearchDefault = () =>
  createSelector(selectReducer, reducerState =>
    reducerState.get('formSearchDefault'),
  );
