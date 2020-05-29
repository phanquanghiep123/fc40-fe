import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectWithdrawalRequest = state =>
  state.get('withdrawalRequest', initialState);

export const makeSelectGeneralInfo = () =>
  createSelector(selectWithdrawalRequest, state => state.get('generalInfo'));
