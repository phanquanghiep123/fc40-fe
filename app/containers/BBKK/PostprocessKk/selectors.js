import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the postprocessKk state domain
 */

const selectPostprocessKkDomain = state =>
  state.get('postprocessKk', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PostprocessKk
 */

const makeSelectPostprocessKk = () =>
  createSelector(selectPostprocessKkDomain, substate => substate.toJS());

export const formOptionSelector = () =>
  createSelector(selectPostprocessKkDomain, substate =>
    substate.get('formOption'),
  );

export const formDataSelector = () =>
  createSelector(selectPostprocessKkDomain, substate =>
    substate.get('formData'),
  );

export const selectArr = section =>
  createSelector(selectPostprocessKkDomain, substate =>
    substate.getIn(section),
  );

export default makeSelectPostprocessKk;
export { selectPostprocessKkDomain };
