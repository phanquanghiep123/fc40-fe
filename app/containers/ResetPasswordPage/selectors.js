/**
 * ResetPassword selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectResetPassword = state => state.get('ResetPassword', initialState);

const makeSelectResetSuccess = () =>
  createSelector(selectResetPassword, resetPassword =>
    resetPassword.get('resetSuccess'),
  );

export { selectResetPassword, makeSelectResetSuccess };
