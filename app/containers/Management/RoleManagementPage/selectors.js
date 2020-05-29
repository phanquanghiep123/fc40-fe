import { createSelector } from 'reselect';

import { initialState } from './reducer';

export const selectReducer = state => state.get('roleManagement', initialState);

export const makeSelectLoading = section =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, 'loading']),
  );

export const makeSelectError = section =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, 'error']),
  );

export const makeSelectData = (section, prop = 'data') =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, prop]),
  );

export const makeSelectPage = section =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, 'page']),
  );

export const makeSelectPageSize = section =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, 'pageSize']),
  );

export const makeSelectTotalCount = section =>
  createSelector(selectReducer, reducerState =>
    reducerState.getIn([section, 'totalCount']),
  );
