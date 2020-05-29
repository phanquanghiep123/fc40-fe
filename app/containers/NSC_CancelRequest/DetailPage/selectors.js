import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { GENERAL_INFO_SECTION } from './constants';

const selectDomain = state =>
  state.get('CancelRequestDetailPage', initialState);

export const selectBoxData = () =>
  createSelector(selectDomain, state => state.get('selectBoxData'));

export const generalInfoDefaultValues = () =>
  createSelector(selectDomain, state =>
    state.getIn([GENERAL_INFO_SECTION, 'defaultValues']),
  );

export const receiptData = () =>
  createSelector(selectDomain, state => state.get('receiptData'));

export const isDraftSelected = () =>
  createSelector(selectDomain, state => state.get('isDraftSelected'));
