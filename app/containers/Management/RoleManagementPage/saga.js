import { call, put, all, select, takeLeading } from 'redux-saga/effects';

import {
  optionReq,
  checkStatus,
  requestAuth,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';

import { showSuccess, loadingError } from 'containers/App/actions';

import {
  roleRoutine,
  rolesRoutine,
  usersRoutine,
  privilegesRoutine,
  regionOrgsRoutine,
} from './routines';
import { makeSelectData } from './selectors';

import {
  CREATE_ROLE,
  CLONE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  UPDATE_ROLE_FULL,
  TYPE_ROLE_EDITING,
} from './constants';

const AUTHEN_URL = PATH_GATEWAY.AUTHENTICATION_API;
const AUTHOR_URL = PATH_GATEWAY.AUTHORIZATION_API;

export const formatRegions = datas =>
  datas.map(({ regionId, ...data }) => data);

export function fromRole(data) {
  return {
    roleId: data.roleId,
    value: data.value,
    name: data.name,
    description: data.description,
    isMaster: data.isMaster,
    isActive: data.isActive,
  };
}

export function fromRoleFull(data) {
  const { roleAccessRegionOrgs, ...roleData } = data;

  const roleAccessRegions = [];
  const roleAccessOrgs = [];

  if (roleAccessRegionOrgs && roleAccessRegionOrgs.length > 0) {
    for (let i = 0, len = roleAccessRegionOrgs.length; i < len; i += 1) {
      const regionOrgData = roleAccessRegionOrgs[i];
      if (regionOrgData.regionId) {
        roleAccessRegions.push({
          regionId: regionOrgData.regionId,
          allowed: regionOrgData.allowed,
        });
      } else if (regionOrgData.organizationId) {
        roleAccessOrgs.push({
          organizationId: regionOrgData.organizationId,
          allowed: regionOrgData.allowed,
        });
      }
    }
  }

  return {
    ...roleData,
    roleAccessRegions,
    roleAccessOrgs,
  };
}

export function useRoles(datas) {
  const results = [];

  if (datas)
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const { masterRoleId } = datas[i];
      results.push({ masterRoleId });
    }

  return results;
}

export function usePrivileges(datas) {
  const results = [];

  if (datas)
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const { privilegeId, allowed } = datas[i];
      results.push({ privilegeId, allowed });
    }

  return results;
}

export function useRegions(datas) {
  const results = [];

  if (datas)
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const { regionId, allowed } = datas[i];
      results.push({ regionId, allowed });
    }

  return results;
}

export function useOrganizations(datas) {
  const results = [];

  if (datas)
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const { organizationId, allowed } = datas[i];
      results.push({ organizationId, allowed });
    }

  return results;
}

export function* getRole(action) {
  try {
    const roleId = action.payload;
    const requestURL = `${AUTHOR_URL}/roles/${roleId}/full`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response, 'Không tồn tại quyền này trong hệ thống.');

    const payload = {
      data: response.data || {},
    };

    yield put(roleRoutine.success(payload));
  } catch (error) {
    yield put(roleRoutine.failure());
    yield put(loadingError(error.message));
  }
}

export function* getRoles() {
  try {
    const requestURL = `${AUTHOR_URL}/Roles?&pageSize=-1&sort=-roleId`;

    const response = yield call(requestAuth, requestURL);

    const payload = {
      data: response.data || [],
    };
    checkStatus(response);

    yield put(rolesRoutine.success(payload));
  } catch (error) {
    yield put(rolesRoutine.failure());
    yield put(loadingError(error.message));
  }
}

export function* getUsers() {
  try {
    const requestURL = `${AUTHEN_URL}/users?&pageSize=-1`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    checkStatus(response);

    const payload = {
      data: response.data || [],
    };

    yield put(usersRoutine.success(payload));
  } catch (error) {
    yield put(usersRoutine.failure());
    yield put(loadingError(error.message));
  }
}

export function* getPrivileges() {
  try {
    const requestURL = `${AUTHOR_URL}/Privileges?&pageSize=-1`;

    const response = yield call(requestAuth, requestURL);

    const payload = {
      data: response.data || [],
    };
    checkStatus(response);

    yield put(privilegesRoutine.success(payload));
  } catch (error) {
    yield put(privilegesRoutine.failure());
    yield put(loadingError(error.message));
  }
}

export function* getRegionOrgs() {
  try {
    const requestRegionsURL = `${AUTHOR_URL}/Regions?&pageSize=-1`;
    const requestOrgsURL = `${AUTHOR_URL}/Organizations?&pageSize=-1`;

    const [regionsResponse, orgsResponse] = yield all([
      call(requestAuth, requestRegionsURL),
      call(requestAuth, requestOrgsURL),
    ]);

    checkStatus(regionsResponse);
    checkStatus(orgsResponse);

    const payload = {
      regions: regionsResponse.data || [],
      organizations: formatRegions(orgsResponse.data) || [],
    };

    yield put(regionOrgsRoutine.success(payload));
  } catch (error) {
    yield put(regionOrgsRoutine.failure());
    yield put(loadingError(error.message));
  }
}

export function* createRole(action) {
  try {
    const { role, callback } = action;
    const roleData = {
      ...role,
      userAssignRoles: [],
      roleIncludes: [],
      roleAccessPrivileges: [],
      roleAccessOrgs: [],
      roleAccessRegions: [],
    };

    const requestURL = `${AUTHOR_URL}/Roles`;

    yield put(rolesRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({ method: METHOD_REQUEST.POST, body: roleData }),
    );
    checkStatus(response);

    const payload = {
      type: TYPE_ROLE_EDITING.ADD,
      role: response.data || {},
    };
    yield put(rolesRoutine.editingSuccess(payload));

    if (response.data && callback) {
      callback(response.data.roleId);
    }

    yield put(showSuccess('Thêm quyền mới thành công'));
  } catch (error) {
    yield put(rolesRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

export function* cloneRole(action) {
  try {
    const { role, callback } = action;
    const oldData = yield select(makeSelectData('role'));

    const {
      roleId: oldRoleId,
      roleIncludes,
      roleAccessPrivileges,
      roleAccessOrgs,
      roleAccessRegions,
    } = oldData.toJS();

    const roleData = {
      ...role,
      userAssignRoles: [],
      roleIncludes: useRoles(roleIncludes),
      roleAccessPrivileges: usePrivileges(roleAccessPrivileges),
      roleAccessOrgs: useOrganizations(roleAccessOrgs),
      roleAccessRegions: useRegions(roleAccessRegions),
    };

    const requestURL = `${AUTHOR_URL}/Roles`;

    yield put(rolesRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({ method: METHOD_REQUEST.POST, body: roleData }),
    );
    checkStatus(response);

    const payload = {
      type: TYPE_ROLE_EDITING.CLONE,
      role: response.data || {},
      oldRoleId,
    };
    yield put(rolesRoutine.editingSuccess(payload));

    if (response.data && callback) {
      callback(response.data.roleId);
    }

    yield put(showSuccess('Thêm quyền mới thành công'));
  } catch (error) {
    yield put(rolesRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

export function* updateRole(action) {
  try {
    const { role } = action;
    const { roleId, ...roleData } = fromRole(role);

    const requestURL = `${AUTHOR_URL}/roles/${roleId}`;

    yield put(rolesRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({ method: METHOD_REQUEST.PUT, body: roleData }),
    );
    checkStatus(response, 'Không tồn tại quyền này trong hệ thống.');

    const payload = {
      type: TYPE_ROLE_EDITING.UPDATE,
      role: response.data ? { roleId, ...response.data } : {},
    };

    yield put(showSuccess('Thông tin cập nhật thành công'));
    yield put(rolesRoutine.editingSuccess(payload));
  } catch (error) {
    yield put(rolesRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

export function* deleteRole(action) {
  try {
    const { roleId, callback } = action;

    const requestURL = `${AUTHOR_URL}/roles/${roleId}`;

    yield put(rolesRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({ method: METHOD_REQUEST.DELETE }),
    );
    checkStatus(response, 'Không tồn tại quyền này trong hệ thống.');

    const payload = {
      type: TYPE_ROLE_EDITING.DELETE,
      roleId,
    };
    yield put(rolesRoutine.editingSuccess(payload));

    if (callback) {
      callback();
    }

    yield put(showSuccess('Xóa quyền thành công'));
  } catch (error) {
    yield put(rolesRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

export function* updateRoleFull(action) {
  try {
    const { roleId, ...roleData } = fromRoleFull(action.role);

    const requestURL = `${AUTHOR_URL}/roles/${roleId}/full`;

    yield put(roleRoutine.editingRequest());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({ method: METHOD_REQUEST.PUT, body: roleData }),
    );
    checkStatus(response, 'Không tồn tại quyền này trong hệ thống.');

    const payload = {
      data: response.data ? { ...response.data, roleId } : {},
    };

    yield put(showSuccess('Thông tin cập nhật thành công'));
    yield put(roleRoutine.editingSuccess(payload));
  } catch (error) {
    yield put(roleRoutine.editingFailure());
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* featureFlow() {
  // Call request to get list
  yield takeLeading(roleRoutine.REQUEST, getRole);
  yield takeLeading(rolesRoutine.REQUEST, getRoles);
  yield takeLeading(usersRoutine.REQUEST, getUsers);
  yield takeLeading(privilegesRoutine.REQUEST, getPrivileges);
  yield takeLeading(regionOrgsRoutine.REQUEST, getRegionOrgs);

  // Call request to change data (update, delete,...)
  yield takeLeading(CREATE_ROLE, createRole);
  yield takeLeading(CLONE_ROLE, cloneRole);
  yield takeLeading(UPDATE_ROLE, updateRole);
  yield takeLeading(DELETE_ROLE, deleteRole);
  yield takeLeading(UPDATE_ROLE_FULL, updateRoleFull);
}
