import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the masterBaskets state domain
 */

const selectMasterBasketsDomain = state =>
  state.get('masterBaskets', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by MasterBaskets
 */
export const tableSelector = () =>
  createSelector(selectMasterBasketsDomain, state =>
    state.getIn(['table', 'data']),
  );
export const formDetailSelector = () =>
  createSelector(selectMasterBasketsDomain, state => state.get('formDetail'));
export const paramSearchSelector = () =>
  createSelector(selectMasterBasketsDomain, state => state.get('paramSearch'));
export const uomsSelector = () =>
  createSelector(selectMasterBasketsDomain, state => state.get('uoms'));
export const sizeSelector = () =>
  createSelector(selectMasterBasketsDomain, state => state.get('size'));
