import { createSelector } from 'reselect';

import { initialState } from './reducer';

export const selectReducer = state => state.get('listMailSent', initialState);

export const makeSelectData = (section, prop = 'data') =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, prop]),
  );

export const makeSelectImportId = () =>
  createSelector(selectReducer, reducerState => reducerState.get('importId'));

export const makeSelectSentResult = () =>
  createSelector(selectReducer, reducerState => reducerState.get('sentResult'));

export const makeSelectFormSearch = () =>
  createSelector(selectReducer, reducerState => reducerState.get('formSearch'));
