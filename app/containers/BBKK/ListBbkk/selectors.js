import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the listBbkk state domain
 */

const selectListBbkkDomain = state => state.get('listBbkk', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ListBbkk
 */

const makeSelectListBbkk = () =>
  createSelector(selectListBbkkDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectListBbkkDomain, state => state.getIn(['form', 'data']));

export const formSubmittedValues = () =>
  createSelector(selectListBbkkDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formDefaultValues = () =>
  createSelector(selectListBbkkDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );
export const formIsSubmitted = () =>
  createSelector(selectListBbkkDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectListBbkkDomain, state => state.getIn(['table', 'data']));

export default makeSelectListBbkk;
export { selectListBbkkDomain };
