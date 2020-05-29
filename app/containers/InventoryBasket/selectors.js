import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the inventoryBasket state domain
 */

const selectInventoryBasketDomain = state =>
  state.get('inventoryBasket', initialState);

export const selectFormOption = () =>
  createSelector(selectInventoryBasketDomain, subState =>
    subState.get('formOption'),
  );

export const selectFormData = () =>
  createSelector(selectInventoryBasketDomain, subState =>
    subState.get('formData'),
  );

export const selectFormDataSection = section =>
  createSelector(selectInventoryBasketDomain, subState =>
    subState.getIn(section),
  );

const makeSelectInventoryBasket = () =>
  createSelector(selectInventoryBasketDomain, substate => substate.toJS());

export default makeSelectInventoryBasket;
export { selectInventoryBasketDomain };
