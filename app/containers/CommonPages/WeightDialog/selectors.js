import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the weightDialog state domain
 */

const selectWeightDialogDomain = state =>
  state.get('weightDialog', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by WeightDialog
 */

const makeSelect = params =>
  createSelector(selectWeightDialogDomain, substate => substate.get(params));

export default makeSelect;
export { selectWeightDialogDomain };
