import { takeLeading, put, call } from 'redux-saga/effects';
import moment from 'moment';
import { get } from 'lodash';

import * as constants from './constants';
import {
  loadingError,
  showWarning,
  setLoading,
  showSuccess,
} from '../../App/actions';
import * as actions from './actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  METHOD_REQUEST,
  responseCode,
} from '../../../utils/request';
import { formDataSchema } from './FormSection/formats';
import { serializeQueryParams, converYearMonthDay } from '../../App/utils';
const FIX_URL = 'actual-output-reports';
const APIs = {
  getTableData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/actual-output-report/get-histories`,
  runReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/${FIX_URL}/run-forced-report?isForced=0`,
  isReport: `${PATH_GATEWAY.REPORTADAPTER_API}/${FIX_URL}/is-running`,
  dataSynchronization: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/${FIX_URL}/run-forced-report?isForced=1`,
  getConfig: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/setting/get-by-key?filter[Key]=RunActualOuputReportMaxDaysFromAndToFinishDate`,
};

const getQueryStr = formValues => {
  const { pageSize, pageIndex, sort = [] } = formValues;
  const strSort = (sort.length && `&sort=${sort.join('&sort=')}`) || '';
  return `${serializeQueryParams({
    pageSize,
    pageIndex,
  })}${strSort}`;
};

export function* fetchFormDataSaga(action) {
  const { submittedValues } = action;
  const formData = { ...formDataSchema };

  yield put(setLoading());
  try {
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });

    const response = yield call(request, `${APIs.getConfig}`, GETOption);
    const configValue = get(response, `data[0].value`, 0);
    if (configValue) {
      formData.ConfigShowDate = configValue;
      submittedValues.ConfigShowDate = configValue;
    }
  } catch (e) {
    //
  }

  submittedValues.pageIndex = 0;
  submittedValues.isSubmit = true;

  yield put(actions.getFormDataSuccess(formData));
  yield put(actions.submitForm(submittedValues));
  yield put(setLoading(false));
}

export function* submitFormSaga(action) {
  const { submittedValues } = action;
  const { dateFrom, dateTo } = submittedValues;
  const df = converYearMonthDay(dateFrom);
  const dt = converYearMonthDay(dateTo);
  const numberShowColumnDate = dt.diff(df, 'days') + 1;
  submittedValues.numberShowColumnDate = numberShowColumnDate;
  try {
    yield put(setLoading());
    const queryStr = getQueryStr(submittedValues);
    const url = `${APIs.getTableData}?${queryStr}`;
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    const response = yield call(request, url, GETOption);
    if (response && response.statusCode === responseCode.ok) {
      const { count = 0 } = response.meta;
      submittedValues.totalItem = count;
      yield put(actions.submitFormSuccess(submittedValues, response.data));
    } else {
      throw Object({
        message: response.message || 'Không lấy được danh sách lịch sử báo cáo',
      });
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* changeOrderSaga(action) {
  const { submittedValues } = action;
  try {
    yield put(setLoading());
    yield put(actions.submitForm(submittedValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* runReport(action) {
  yield put(setLoading(true));
  try {
    let GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    let response = yield call(request, APIs.isReport, GETOption);
    if (response && response.statusCode === responseCode.ok) {
      if (response.data === true) {
        yield put(
          showWarning(
            'Đang có thành viên sử dụng chức năng này, Vui lòng thử lại sau',
          ),
        );
        yield put(setLoading(false));
      } else {
        const { submittedValues, callback } = action;
        const { dateFrom, dateTo } = submittedValues;
        const url = `${APIs.runReport}`;
        GETOption = optionReq({
          method: METHOD_REQUEST.POST,
          authReq: true,
          body: {
            from: moment(dateFrom).format('YYYY-MM-DD'),
            to: moment(dateTo).format('YYYY-MM-DD'),
          },
        });
        response = yield call(request, url, GETOption);
        if (response && response.statusCode === responseCode.ok) {
          callback();
        } else {
          throw Object({
            message: response.message || 'Có lỗi! vui lòng thử lại',
          });
        }
      }
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
  yield put(setLoading(false));
}

function* dataSynchronization(action) {
  yield put(setLoading(true));
  try {
    const { values } = action;
    const response = yield call(
      request,
      `${APIs.dataSynchronization}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        authReq: true,
        body: values,
      }),
    );
    if (response.statusCode !== 200 || !response.data) {
      throw Object({
        message: response.message || 'Đồng bộ dữ liệu không thành công.',
      });
    }
    yield put(showSuccess(response.message || 'Đồng bộ dữ liệu thành công.'));
  } catch (e) {
    yield put(loadingError(e.message));
  }
  yield put(setLoading(false));
}

function* signalrProcessing(action) {
  try {
    const { res } = action;
    if (!res.data) {
      throw Object({
        message: res.message || 'Đồng bộ dữ liệu không thành công.',
      });
    }
    yield put(showSuccess(res.message || 'Đồng bộ dữ liệu thành công.'));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* RetailListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
  yield takeLeading(constants.RUN_REPORT, runReport);
  yield takeLeading(constants.SIGNALR_PROCESSING, signalrProcessing);
  yield takeLeading(constants.DATA_SYNCHRONIZATION, dataSynchronization);
}
