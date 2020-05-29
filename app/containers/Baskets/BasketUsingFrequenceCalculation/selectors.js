import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the basketUsingFrequenceCalculation state domain
 */

const selectBasketUsingFrequenceCalculationDomain = state =>
  state.get('basketUsingFrequenceCalculation', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by BasketUsingFrequenceCalculation
 */

const makeSelectBasketUsingFrequenceCalculation = () =>
  createSelector(selectBasketUsingFrequenceCalculationDomain, substate =>
    substate.toJS(),
  );

export const listData = arr =>
  createSelector(selectBasketUsingFrequenceCalculationDomain, substate =>
    substate.get(arr),
  );

export const paramsSearchPopupSelect = () =>
  createSelector(selectBasketUsingFrequenceCalculationDomain, substate =>
    substate.get('paramsSearchPopup'),
  );

export const tableDataPopup = () =>
  createSelector(selectBasketUsingFrequenceCalculationDomain, substate =>
    substate.get('tablePopup'),
  );
export const formDataSelector = () =>
  createSelector(selectBasketUsingFrequenceCalculationDomain, substate =>
    substate.get('formData'),
  );
export default makeSelectBasketUsingFrequenceCalculation;
export { selectBasketUsingFrequenceCalculationDomain };
