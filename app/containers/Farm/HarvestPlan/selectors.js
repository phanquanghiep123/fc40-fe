import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the harvestPlan state domain
 */

const selectHarvestPlanDomain = state => state.get('harvestPlan', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by HarvestPlan
 */

export const makeSelectHarvestPlan = () =>
  createSelector(selectHarvestPlanDomain, substate => substate.toJS());

export const formData = () =>
  createSelector(selectHarvestPlanDomain, state =>
    state.getIn(['form', 'data']),
  );

export const formValues = () =>
  createSelector(selectHarvestPlanDomain, state =>
    state.getIn(['form', 'values']),
  );

export const submittedValues = () =>
  createSelector(selectHarvestPlanDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const tableData = () =>
  createSelector(selectHarvestPlanDomain, state =>
    state.getIn(['table', 'data']),
  );

export const tableDataRow = index =>
  createSelector(selectHarvestPlanDomain, state =>
    state.getIn(['table', 'data', index]),
  );

export const tableMeta = () =>
  createSelector(selectHarvestPlanDomain, state =>
    state.getIn(['table', 'meta']),
  );
