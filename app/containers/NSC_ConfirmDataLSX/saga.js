import { call, put, select, takeLeading } from 'redux-saga/effects';
import { find } from 'lodash';

import { loadingError, showSuccess, setLoading } from '../App/actions';
import { localstoreUtilites } from '../../utils/persistenceData';
import request, { optionReq, PATH_GATEWAY } from '../../utils/request';
import * as constants from './constants';
import * as actions from './actions';
import * as selectors from './selectors';
import { makeSaveFileFunc, serializeQueryParams } from '../App/utils';

const auth = localstoreUtilites.getAuthFromLocalStorage();
const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getTableData: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/prodorderdataconfirms/simple`, // ?plantCode={}&isAll={bool}
  confirm: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/prodorderdataconfirms/confirm`, // POST
  exportExcel: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/prodorderdataconfirms/export`,
};

/**
 * Fetch Organization List
 */
export function* fetchOrgListSaga() {
  try {
    yield put(setLoading());
    const orgRes = yield call(
      request,
      `${APIs.getOrg}?userId=${auth.meta.userId}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (orgRes.statusCode !== 200 || !orgRes.data || !orgRes.data.length) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }

    const formData = {
      org: orgRes.data.map(unit => ({
        label: unit.name,
        value: unit.value,
      })),
      weighingEmployee: auth.meta.fullName,
    };

    yield put(actions.fetchOrgListSuccess(formData));
    yield put(
      actions.fetchTableData({
        org: formData.org[0].value,
        unConfirmAndNotPv: true,
        unConfirmAndHasPv: true,
        confirmed: true,
      }),
    );

    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/**
 * Fetch Table Data
 * @param action
 */
export function* fetchTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const queryParams = {
      plantCode: formValues.org,
      unConfirmAndNotPv: formValues.unConfirmAndNotPv,
      unConfirmAndHasPv: formValues.unConfirmAndHasPv,
      confirmed: formValues.confirmed,
    };

    const queryStr = serializeQueryParams(queryParams);

    const tableDataRes = yield call(
      request,
      `${APIs.getTableData}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (tableDataRes.statusCode !== 200 || !tableDataRes.data) {
      throw Object({
        message: tableDataRes.message || 'Không lấy được danh sách đơn vị',
      });
    }

    const originalData = tableDataRes.data;

    // Spread Table Data - Combined products will be spread into multiple rows
    const spreadTable = [];
    originalData.forEach(rowData => {
      const row = { ...rowData };

      if (row.products && row.products.length) {
        row.products.forEach((product, index) => {
          // select the first PV and check confirm box (status) if there is only 1 PV
          if (row.productVersionOptions.length === 1) {
            row.productVersion = row.productVersionOptions[0].value;
            row.status = true;
          }

          // add a blank option if there are more than one option
          if (row.productVersionOptions.length > 1) {
            row.productVersionOptions = [
              { value: '', label: '' },
              ...row.productVersionOptions,
            ];
          }

          const isMainRow = index === 0;
          const isLastRow = index === row.products.length - 1;
          const spreadRow = {
            isConfirmed: rowData.status,
            ...(isMainRow ? { ...row, isMainRow: true } : {}),
            ...(isLastRow ? { isLastRow: true } : {}),
            ...product,
          };

          spreadTable.push(spreadRow);
        });
      }
    });
    yield put(actions.fetchTableDataSuccess(spreadTable, formValues));

    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/**
 * Submit Data after confirmation
 */
export function* submitTableDataSaga(action) {
  try {
    const { tableData, formValues } = action;

    const filteredData = tableData.filter(row => row.isMainRow);
    const requestBody = {
      productionOrders: filteredData.map(row => ({
        id: row.id,
        productVersion: row.productVersion,
        confirm: row.status,
      })),
    };

    const response = yield call(
      request,
      APIs.confirm,
      optionReq({
        method: 'POST',
        body: requestBody,
        authReq: true,
      }),
    );

    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xác nhận',
      });
    }

    yield put(showSuccess(response.message || 'Xác nhận thành công'));
    yield put(actions.fetchTableData(formValues));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* exportExcel(action) {
  try {
    const {
      unConfirmAndNotPv,
      unConfirmAndHasPv,
      confirmed,
      org,
    } = action.formSubmittedValues;
    const data = yield select(selectors.formData());
    const plantName = find(data.org, item => item.value === org).label || '';
    yield call(
      request,
      `${
        APIs.exportExcel
      }?plantCode=${org}&plantName=${plantName}&unConfirmAndNotPv=${unConfirmAndNotPv}&unConfirmAndHasPv=${unConfirmAndHasPv}&confirmed=${confirmed}`,
      optionReq({ method: 'GET', authReq: true }),
      makeSaveFileFunc(),
    );
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_ORG_LIST, fetchOrgListSaga);
  yield takeLeading(constants.FETCH_TABLE_DATA, fetchTableDataSaga);
  yield takeLeading(constants.SUBMIT_TABLE_DATA, submitTableDataSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
}
