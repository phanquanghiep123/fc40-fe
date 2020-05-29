import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listOwnerBasket state domain
 */

const selectListOwnerBasketDomain = state =>
  state.get('listOwnerBasket', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListOwnerBasket
 */

const makeSelectListOwnerBasket = () =>
  createSelector(selectListOwnerBasketDomain, substate => substate.toJS());

export const makeSelectData = () =>
  createSelector(selectListOwnerBasketDomain, substate =>
    substate.get('initValue'),
  );
export const orgsSelector = () =>
  createSelector(selectListOwnerBasketDomain, substate =>
    substate.get('organizations'),
  );
export const basketsSelectData = () =>
  createSelector(selectListOwnerBasketDomain, substate =>
    substate.get('baskets'),
  );
export const historySelector = () =>
  createSelector(selectListOwnerBasketDomain, substate =>
    substate.get('history'),
  );
export default makeSelectListOwnerBasket;
export { selectListOwnerBasketDomain };
