import { takeLeading, put, call } from 'redux-saga/effects';
import moment from 'moment';
import * as constants from './constants';
import {
  loadingError,
  showWarning,
  setLoading,
  showSuccess,
} from '../../../App/actions';
import * as actions from './actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from '../../../../utils/request';
import { localstoreUtilites } from '../../../../utils/persistenceData';
import { formDataSchema } from './FormSection/formats';
import { serializeQueryParams } from '../../../App/utils';

const APIs = {
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/basket-reports/get-history-report`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  postProceedReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-reports/run-report-manually`,
  isReport: `${PATH_GATEWAY.REPORTADAPTER_API}/basket-reports/is-running`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();
const getQueryParams = (formValues, formData) => {
  const { date, pageSize, pageIndex, Sort = [], org } = formValues;
  const { orgList } = formData || {};
  const isExistOrgSelected = (org && org.length > 0 && !!org[0]) || false;
  const sort = (Sort.length && `&sort=${Sort.join('&sort=')}`) || '';
  const PlantCode =
    (isExistOrgSelected && org.map(item => item.value).join(',')) ||
    (orgList && orgList.map(item => item.value).join(','));
  return `${serializeQueryParams({
    ProcessDate: moment(date).format('YYYY-MM-DD'),
    pageSize,
    pageIndex,
    PlantCode,
  })}${sort}`;
};

export function* fetchFormDataSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const formData = { ...formDataSchema };
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const orgRes = yield call(
      request,
      `${APIs.getOrg}?userId=${auth.meta.userId}`,
      GETOption,
    );
    if (
      orgRes.statusCode !== responseCode.ok ||
      !orgRes.data ||
      orgRes.data.length < 1
    ) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }
    const orgList = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
      type: item.organizationType,
    }));
    formData.orgList = orgList;
    yield put(actions.getFormDataSuccess(formData));
    yield put(actions.submitForm(formValues, formData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  const { formValues, formData } = action;
  try {
    const queryStr = getQueryParams(formValues, formData);
    const requestApi = `${APIs.getTableData}?${queryStr}`;
    yield put(setLoading(true));
    const response = yield call(
      request,
      requestApi,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    if (!response.data) {
      throw Object({
        message: 'Không lấy được thông tin báo cáo lịch sử  tồn kho',
      });
    }
    formValues.totalItem = response.meta.count;
    yield put(actions.submitFormSuccess(formValues, response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* changeOrderSaga(action) {
  const { submittedValues, formData } = action;
  try {
    yield put(setLoading());
    yield put(actions.submitForm(submittedValues, formData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* proceedReportSaga(action) {
  const { formValues, formData, callback } = action;
  const { org } = formValues;
  const { orgList } = formData || {};
  try {
    yield put(setLoading());
    let response = yield call(
      request,
      APIs.isReport,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (response && response.statusCode === responseCode.ok) {
      if (response.data === true) {
        yield put(
          showWarning(
            'Đang có thành viên sử dụng chức năng này, Vui lòng thử lại sau',
          ),
        );
        yield put(setLoading(false));
      } else {
        const dateTo = new Date();
        const isExistOrgSelected = (org && org.length > 0 && !!org[0]) || false;
        const PlantCode =
          (isExistOrgSelected && org.map(item => item.value).join(',')) ||
          (orgList && orgList.map(item => item.value).join(','));
        const body = {
          PlantCode,
          from: moment(formValues.date).format('YYYY-MM-DD'),
          to: moment(dateTo).format('YYYY-MM-DD'),
        };

        const requestApi = `${APIs.postProceedReport}`;
        response = yield call(
          request,
          requestApi,
          optionReq({
            method: 'POST',
            authReq: true,
            body,
          }),
        );
        if (response && response.statusCode === responseCode.ok) {
          yield put(setLoading(false));
          yield put(showSuccess(response.message || 'Chạy báo cáo thành công'));
          callback();
        } else {
          throw Object({
            message: response.message || 'Có lỗi! vui lòng thử lại',
          });
        }
      }
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* HistoryInventoryReportListPageSaga() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
  yield takeLeading(constants.PROCEED_REPORT, proceedReportSaga);
}
