/* eslint-disable indent */
import { call, put, takeLeading } from 'redux-saga/effects';
import { startOfDay } from 'date-fns';
import { push } from 'connected-react-router';
import { localstoreUtilites } from '../../../utils/persistenceData';
import request, { optionReq, PATH_GATEWAY } from '../../../utils/request';
import {
  loadingError,
  setLoading,
  showSuccess,
  showWarning,
} from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';
import {
  convertDateString,
  convertDateTimeString,
  serializeQueryParams,
} from '../../App/utils';

const reportAdapter = 'report-adapter/api/v1';
const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/inventory-reports/run-history`,
  postProceedReport: `${reportAdapter}/inventory-reports`,
};

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    const auth = localstoreUtilites.getAuthFromLocalStorage();
    let updatedFormValues = null;

    if (fetchNew) {
      const GETOption = optionReq({
        method: 'GET',
        authReq: true,
      });

      const orgRes = yield call(
        request,
        `${APIs.getOrg}?userId=${auth.meta.userId}`,
        GETOption,
      );

      if (orgRes.statusCode !== 200 || !orgRes.data || !orgRes.data.length) {
        yield put(
          showWarning(orgRes.message || 'Không lấy được danh sách đơn vị'),
        );
      }

      // Map data
      const formData = {
        org: orgRes.data
          ? [
              ...(orgRes.data.length > 1
                ? [
                    {
                      value: orgRes.data.map(item => item.value).join(','),
                      label: 'Tất cả',
                    },
                  ]
                : []),
              ...orgRes.data.map(item => ({
                value: item.value,
                label: item.name,
              })),
            ]
          : [],
      };

      yield put(actions.fetchFormDataSuccess(formData));

      updatedFormValues = {
        ...formValues,
        org: formData.org.length ? formData.org[0].value : '',
      };
    }

    yield put(actions.fetchTableData(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const queryParams = {
      plantCode: formValues.org && formValues.org !== 0 ? formValues.org : null,
      from: formValues.dateFrom
        ? startOfDay(formValues.dateFrom).toISOString()
        : null,
      to: formValues.dateTo
        ? startOfDay(formValues.dateTo).toISOString()
        : null,

      pageIndex: formValues.pageIndex,
      pageSize: formValues.pageSize,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getTableData}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không tải được lịch sử',
      });
    }

    const tableData = res.data.map(item => ({
      org: item.plantCode,
      reportDate: `${item.from ? convertDateString(item.from) : ''} ~ ${
        item.to ? convertDateString(item.to) : ''
      }`,
      proceededBy: item.createdBy,
      proceededAt: item.createdAt ? convertDateTimeString(item.createdAt) : '',
    }));

    formValues.count = res.meta ? res.meta.count : 0;

    yield put(actions.fetchTableDataSuccess(formValues, tableData));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* proceedReportSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const body = {
      plantCode: formValues.org && formValues !== 0 ? formValues.org : null,
      from: formValues.dateFrom
        ? startOfDay(formValues.dateFrom).toISOString()
        : null,
      to: formValues.dateTo
        ? startOfDay(formValues.dateTo).toISOString()
        : null,
    };
    const res = yield call(
      request,
      `${APIs.postProceedReport}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Chạy báo cáo không thành công',
      });
    }

    yield put(showSuccess(res.message || 'Chạy báo cáo thành công'));
    yield put(push('/bao-cao-san-xuat'));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_TABLE_DATA, fetchTableDataSaga);
  yield takeLeading(constants.PROCEED_REPORT, proceedReportSaga);
}
