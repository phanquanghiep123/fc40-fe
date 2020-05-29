import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';

import request, {
  optionReq,
  checkStatus,
  requestAuth,
  responseCode,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';

import { serializeQueryParams } from 'containers/App/utils';
import { loadingError, setLoading, showSuccess } from 'containers/App/actions';

import { mappingUserSchema } from './userUtils';
import { updateUserSchema } from './actions';

import { rolesRoutine, usersRoutine } from './routines';

import {
  VERIFY_USER,
  SUBMIT_USER,
  GET_USER_BY_ID,
  GET_ROLE_AUTO,
  CHANGE_LOCK,
  RESET_PASSWORD,
  ASSIGN_FOR_USER,
} from './constants';

export const AUTHEN_URL = PATH_GATEWAY.AUTHENTICATION_API;
export const AUTHOR_URL = PATH_GATEWAY.AUTHORIZATION_API;

export function getUsersQuery({
  totalCount, // bỏ qua
  searchText, // đổi tên
  ...params
}) {
  return serializeQueryParams({
    ...params,
    filterName: searchText,
  });
}

function* getUserById(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.AUTHENTICATION_API}/users/get-by-id?userId=${
        action.userId
      }`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: false,
      }),
    );
    if (!res.statusCode || res.statusCode !== responseCode.ok) {
      throw Object({ message: 'Không lấy được thông tin user' });
    }
    yield put(updateUserSchema(mappingUserSchema(res.data)));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* verifyUser(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${PATH_GATEWAY.AUTHENTICATION_API}/account/get-aduser-infor?userName=${
        action.username
      }`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: false,
      }),
    );
    if (res.statusCode && res.statusCode === responseCode.ok) {
      action.callback(res.data);
    } else {
      const { message } = res;
      throw Object({ message });
    }
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* submitUser(action) {
  try {
    const { user } = action;
    user.dateExpried = action.user.dateExpried
      ? new Date(action.user.dateExpried)
      : null;
    const res = yield call(
      request,
      `${PATH_GATEWAY.AUTHENTICATION_API}/Account/${action.path}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: user,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode === responseCode.badRequest) {
      action.formik.setErrors(res.data);
      throw Object({ message: res.message || 'Thông tin không hợp lệ' });
    } else if (!res.statusCode || res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message || 'Thao tác không thành công' });
    }
    yield put(showSuccess(res.message));
    yield action.callback();
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getRoles(action) {
  try {
    const { userId, userName } = action.payload;

    const requestURL = `${AUTHOR_URL}/roles/get-by-user?userId=${userId}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data || [],
      userId,
      userName,
    };

    yield put(rolesRoutine.success(payload));
  } catch (error) {
    yield put(rolesRoutine.failure());
    yield put(loadingError(error.message));
  }
}

export function* getUsers(action) {
  try {
    const { params } = action.payload || {};

    const queryParams = getUsersQuery(params);
    const requestURL = `${AUTHEN_URL}/Users?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data || [],
      pagination: {
        ...params,
        totalCount: response.meta ? response.meta.count : 0,
      },
    };

    yield put(usersRoutine.success(payload));
  } catch (error) {
    yield put(usersRoutine.failure());
    yield put(loadingError(error.message));
  }
}

export function* resetPassword(action) {
  try {
    const { userIds } = action;

    const requestURL = `${AUTHEN_URL}/account/reset-password`;

    yield put(usersRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: { userIds },
      }),
    );
    checkStatus(response);

    const payload = {
      userIds,
    };

    yield put(usersRoutine.editingSuccess(payload));
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(usersRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

export function* changeLockStatus(action) {
  try {
    const { userIds } = action;

    const requestURL = `${AUTHEN_URL}/account/change-lock-status`;

    yield put(usersRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: { userIds },
      }),
    );
    checkStatus(response);

    const payload = {
      userIds,
    };

    yield put(usersRoutine.editingSuccess(payload));
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(usersRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

export function* assignForUser(action) {
  try {
    const { userId, roleIds } = action;

    const requestURL = `${AUTHOR_URL}/roles/assign-for-user`;

    yield put(rolesRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: { userId, roleIds },
      }),
    );
    checkStatus(response);

    yield put(rolesRoutine.editingSuccess());
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(rolesRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

export function* getRoleAutocomplete(action) {
  try {
    const { inputText, callback } = action;

    const requestURL = `${AUTHOR_URL}/roles/auto-complete?search=${inputText}&isMaster=false`;

    const response = yield call(requestAuth, requestURL);

    if (response && response.data) {
      callback(response.data);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLatest(usersRoutine.REQUEST, getUsers);
  yield takeLatest(rolesRoutine.REQUEST, getRoles);

  yield takeLeading(VERIFY_USER, verifyUser);
  yield takeLeading(SUBMIT_USER, submitUser);
  yield takeLeading(GET_USER_BY_ID, getUserById);

  yield takeLeading(RESET_PASSWORD, resetPassword);
  yield takeLeading(CHANGE_LOCK, changeLockStatus);
  yield takeLeading(ASSIGN_FOR_USER, assignForUser);

  yield takeLatest(GET_ROLE_AUTO, getRoleAutocomplete);
}
