import { fromJS } from 'immutable';

import { withLoading } from 'utils/sagaUtils';

import {
  roleRoutine,
  rolesRoutine,
  usersRoutine,
  privilegesRoutine,
  regionOrgsRoutine,
} from './routines';

import { TYPE_ROLE_EDITING } from './constants';

// Initial state
export const initialState = fromJS({
  role: {
    loading: false,
    error: false,
    data: {},
  },
  roles: {
    loading: false,
    error: false,
    data: [],
  },
  users: {
    loading: false,
    error: false,
    data: [],
  },
  privileges: {
    loading: false,
    error: false,
    data: [],
  },
  regionorgs: {
    loading: false,
    error: false,
    regions: [],
    organizations: [],
  },
});

// Define reducer
const baseReducer = (state = initialState, action) => {
  switch (action.type) {
    case roleRoutine.SUCCESS:
      return state.setIn(['role', 'data'], fromJS(action.payload.data));

    case rolesRoutine.SUCCESS:
      return state.setIn(['roles', 'data'], fromJS(action.payload.data));

    case usersRoutine.SUCCESS:
      return state.setIn(['users', 'data'], fromJS(action.payload.data));

    case regionOrgsRoutine.SUCCESS:
      return state
        .setIn(['regionorgs', 'regions'], fromJS(action.payload.regions))
        .setIn(
          ['regionorgs', 'organizations'],
          fromJS(action.payload.organizations),
        );

    case privilegesRoutine.SUCCESS:
      return state.setIn(['privileges', 'data'], fromJS(action.payload.data));

    case roleRoutine.EDITING_SUCCESS:
      return state.setIn(['role', 'data'], fromJS(action.payload.data));

    case rolesRoutine.EDITING_SUCCESS: {
      switch (action.payload.type) {
        case TYPE_ROLE_EDITING.ADD: {
          if (action.payload.role) {
            return state.updateIn(['roles', 'data'], list =>
              list.unshift(fromJS(action.payload.role)),
            );
          }
          return state;
        }

        case TYPE_ROLE_EDITING.CLONE: {
          if (action.payload.role) {
            const { role, oldRoleId } = action.payload;

            const roleIndex = state
              .getIn(['roles', 'data'])
              .findIndex(item => item.get('roleId') === oldRoleId);

            return state.updateIn(['roles', 'data'], list =>
              list.splice(roleIndex + 1, 0, fromJS(role)),
            );
          }
          return state;
        }

        case TYPE_ROLE_EDITING.UPDATE: {
          if (action.payload.role) {
            const { role } = action.payload;
            const { roleId, ...roleData } = role;

            const roleIndex = state
              .getIn(['roles', 'data'])
              .findIndex(item => item.get('roleId') === roleId);

            if (roleIndex !== -1) {
              const roleSelected = state.getIn(['role', 'data']);

              if (roleSelected.get('roleId') === roleId) {
                return state
                  .setIn(
                    ['role', 'data'],
                    roleSelected.concat({
                      name: roleData.name,
                      value: roleData.value,
                      isMaster: roleData.isMaster,
                    }),
                  )
                  .updateIn(['roles', 'data'], list =>
                    list.set(roleIndex, list.get(roleIndex).concat(roleData)),
                  );
              }
              return state.updateIn(['roles', 'data'], list =>
                list.set(roleIndex, list.get(roleIndex).concat(roleData)),
              );
            }
          }
          return state;
        }

        case TYPE_ROLE_EDITING.DELETE: {
          const { roleId } = action.payload;

          const roleIndex = state
            .getIn(['roles', 'data'])
            .findIndex(item => item.get('roleId') === roleId);

          if (roleIndex !== -1) {
            const roleData = state.getIn(['roles', 'data']).get(roleIndex);
            const roleSelected = state.getIn(['role', 'data']);

            if (
              roleData &&
              roleSelected &&
              roleData.get('roleId') === roleSelected.get('roleId')
            ) {
              return state
                .setIn(['role', 'data'], fromJS({}))
                .updateIn(['roles', 'data'], list => list.splice(roleIndex, 1));
            }
            return state.updateIn(['roles', 'data'], list =>
              list.splice(roleIndex, 1),
            );
          }

          return state;
        }

        default:
          return state;
      }
    }

    default:
      return state;
  }
};

export default withLoading(baseReducer);
