/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBBGHEdit = state => state.get('bbghView', initialState);

const makeSelectUserLogin = () =>
  createSelector(selectBBGHEdit, BBGHEditState =>
    BBGHEditState.get('userLogin'),
  );

const makeSelectBbghEdit = () =>
  createSelector(selectBBGHEdit, BBGHDetailsState =>
    BBGHDetailsState.get('bbghEdit'),
  );

export { selectBBGHEdit, makeSelectUserLogin, makeSelectBbghEdit };
