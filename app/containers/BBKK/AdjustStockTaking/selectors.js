import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adjustStockTaking state domain
 */

const selectAdjustStockTakingDomain = state =>
  state.get('adjustStockTaking', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdjustStockTaking
 */

const makeSelectAdjustStockTaking = () =>
  createSelector(selectAdjustStockTakingDomain, substate => substate.toJS());

export const formOptions = () =>
  createSelector(selectAdjustStockTakingDomain, state =>
    state.get('formOption'),
  );

export const dataValues = () =>
  createSelector(selectAdjustStockTakingDomain, state =>
    state.getIn(['form', 'values']),
  );

export default makeSelectAdjustStockTaking;
export { selectAdjustStockTakingDomain };
