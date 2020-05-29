import {
  VERIFY_USER,
  SUBMIT_USER,
  GET_USER_BY_ID,
  UPDATE_USER_SCHEMA,
  GET_ROLE_AUTO,
  CHANGE_LOCK,
  RESET_PASSWORD,
  ASSIGN_FOR_USER,
  INIT_CREATE_USER_FORM,
} from './constants';

export function verifyUsername(username, callback) {
  return {
    type: VERIFY_USER,
    username,
    callback,
  };
}

export function submitUser(user, path, formik, callback) {
  return {
    type: SUBMIT_USER,
    user,
    path,
    formik,
    callback,
  };
}

export function getUserById(userId) {
  return {
    type: GET_USER_BY_ID,
    userId,
  };
}

export function updateUserSchema(userSchema) {
  return {
    type: UPDATE_USER_SCHEMA,
    userSchema,
  };
}

export function getRoleAuto(inputText, callback) {
  return {
    type: GET_ROLE_AUTO,
    callback,
    inputText,
  };
}

export function resetPassword(userIds) {
  return {
    type: RESET_PASSWORD,
    userIds,
  };
}

export function changeLockStatus(userIds, userIndexs, isLocked) {
  return {
    type: CHANGE_LOCK,
    userIds,
    userIndexs,
    isLocked,
  };
}

export function assignForUser(userId, roleIds) {
  return {
    type: ASSIGN_FOR_USER,
    userId,
    roleIds,
  };
}

export function initCreateUserForm() {
  return {
    type: INIT_CREATE_USER_FORM,
  };
}
