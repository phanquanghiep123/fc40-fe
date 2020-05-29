import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectPXK = state => state.get('ExportedRetail', initialState);

const makeSelectData = (prop = 'units') =>
  createSelector(selectPXK, reducerState => reducerState.get(prop));

export { selectPXK, makeSelectData };
