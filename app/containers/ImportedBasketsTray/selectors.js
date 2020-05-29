import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the importedBasketsTray state domain
 */

const selectImportedBasketsTrayDomain = state =>
  state.get('importedBasketsTray', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ImportedBasketsTray
 */

const makeSelectImportedBasketsTray = () =>
  createSelector(selectImportedBasketsTrayDomain, state => state.toJS());

export const formData = () =>
  createSelector(selectImportedBasketsTrayDomain, state =>
    state.getIn(['form', 'data']),
  );
export const formSubmittedValues = () =>
  createSelector(selectImportedBasketsTrayDomain, state =>
    state.getIn(['form', 'submittedValues']),
  );

export const formDefaultValues = () =>
  createSelector(selectImportedBasketsTrayDomain, state =>
    state.getIn(['form', 'defaultValues']),
  );
export const formIsSubmitted = () =>
  createSelector(selectImportedBasketsTrayDomain, state =>
    state.getIn(['form', 'isSubmitted']),
  );

export const tableData = () =>
  createSelector(selectImportedBasketsTrayDomain, state =>
    state.getIn(['table', 'data']),
  );

export default makeSelectImportedBasketsTray;
export { selectImportedBasketsTrayDomain };
