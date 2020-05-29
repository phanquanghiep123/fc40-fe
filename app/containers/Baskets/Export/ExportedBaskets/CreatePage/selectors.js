import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the exportedBaskets state domain
 */

const selectExportedBasketsDomain = state =>
  state.get('exportedBaskets', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ExportedBaskets
 */

const makeSelectExportedBaskets = () =>
  createSelector(selectExportedBasketsDomain, substate => substate.toJS());

export const dataValues = () =>
  createSelector(selectExportedBasketsDomain, state =>
    state.getIn(['form', 'values']),
  );

export const typeExported = () =>
  createSelector(selectExportedBasketsDomain, state =>
    state.getIn(['form', 'values', 'subType', 'value']),
  );

export const configData = () =>
  createSelector(selectExportedBasketsDomain, state => state.get('config'));

export const typeForm = () =>
  createSelector(selectExportedBasketsDomain, state => state.get('typeForm'));

export const formOptions = () =>
  createSelector(selectExportedBasketsDomain, state => state.get('formOption'));

export default makeSelectExportedBaskets;
export { selectExportedBasketsDomain };
