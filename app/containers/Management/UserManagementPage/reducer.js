import { fromJS } from 'immutable';

import { PAGE_SIZE } from 'utils/constants';
import { withLoading } from 'utils/sagaUtils';

import { userInitialSchema } from './userSchema';
import { rolesRoutine, usersRoutine } from './routines';

import { UPDATE_USER_SCHEMA, INIT_CREATE_USER_FORM } from './constants';

// Initial state
export const initialState = fromJS({
  roles: {
    loading: false,
    error: false,
    data: [],
    userId: null,
    userName: null,
  },
  users: {
    loading: false,
    error: false,
    data: [],
    pagination: {
      sort: '-createdAt',
      pageSize: PAGE_SIZE,
      pageIndex: 0,
      totalCount: 0,
      searchText: '',
    },
  },
  userInitialSchema,
});

// Define reducer
export const baseReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_SCHEMA:
      return state.set('userInitialSchema', action.userSchema);

    case rolesRoutine.SUCCESS:
      return state
        .setIn(['roles', 'data'], fromJS(action.payload.data))
        .setIn(['roles', 'userId'], action.payload.userId)
        .setIn(['roles', 'userName'], action.payload.userName);

    case usersRoutine.REQUEST: {
      const { force } = action.payload || {};
      if (force) {
        return initialState;
      }
      return state;
    }

    case usersRoutine.SUCCESS:
      return state
        .updateIn(['roles', 'userId'], value => {
          if (action.payload.data.length > 0) return value;
          return null;
        })
        .setIn(['users', 'data'], fromJS(action.payload.data))
        .setIn(['users', 'pagination'], action.payload.pagination);

    case usersRoutine.EDITING_SUCCESS: {
      const { userIds } = action.payload;

      if (userIds && userIds.length > 0) {
        const users = state.getIn(['users', 'data']).map(user => {
          if (userIds.indexOf(user.get('id')) !== -1) {
            return user.set('locked', !user.get('locked'));
          }
          return user;
        });
        return state.setIn(['users', 'data'], users);
      }
      return state;
    }

    case INIT_CREATE_USER_FORM:
      return state.set('userInitialSchema', fromJS(userInitialSchema));

    default:
      return state;
  }
};

export default withLoading(baseReducer);
