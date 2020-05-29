import {
  CREATE_ROLE,
  CLONE_ROLE,
  UPDATE_ROLE,
  UPDATE_ROLE_FULL,
  DELETE_ROLE,
} from './constants';

export function createRole(role, callback) {
  return {
    type: CREATE_ROLE,
    role,
    callback,
  };
}

export function cloneRole(role, callback) {
  return {
    type: CLONE_ROLE,
    role,
    callback,
  };
}

export function updateRole(role) {
  return {
    type: UPDATE_ROLE,
    role,
  };
}

export function deleteRole(roleId, callback) {
  return {
    type: DELETE_ROLE,
    roleId,
    callback,
  };
}

export function saveRole(role) {
  return {
    type: UPDATE_ROLE_FULL,
    role,
  };
}
