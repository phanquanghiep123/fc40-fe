import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the importedBaskets state domain
 */

const selectImportedBasketsDomain = state =>
  state.get('importedBaskets', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ImportedBaskets
 */

const makeSelectImportedBaskets = section =>
  createSelector(selectImportedBasketsDomain, subState =>
    subState.get(section),
  );
export const makeSelectArrBasket = section =>
  createSelector(selectImportedBasketsDomain, subState =>
    subState.getIn(section),
  );
export default makeSelectImportedBaskets;
