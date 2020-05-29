import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectReducer = state => state.get('userManagement', initialState);

const makeSelectLoading = section =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, 'loading']),
  );

const makeSelectError = section =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, 'error']),
  );

const makeSelectData = (section, prop = 'data') =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, prop]),
  );

const makeSelectPagination = (section, prop = 'pagination') =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, prop]),
  );

const makeSelectUserInitialSchema = () =>
  createSelector(selectReducer, serManagementState =>
    serManagementState.get('userInitialSchema'),
  );

export {
  makeSelectLoading,
  makeSelectError,
  makeSelectData,
  makeSelectPagination,
  makeSelectUserInitialSchema,
};
