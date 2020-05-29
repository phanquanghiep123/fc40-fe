import { all, call, put, takeLeading, select } from 'redux-saga/effects';
import request, {
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  checkStatus,
  METHOD_REQUEST,
} from 'utils/request';
import { localstoreUtilites } from 'utils/persistenceData';
import { loadingError, setLoading, showSuccess } from 'containers/App/actions';
import { buildRequestId } from 'utils/notificationUtils';
import * as constants from './constants';
import * as actions from './actions';
import { paramsSearchPopupSelect, formDataSelector } from './selectors';
import { serializeQueryParams } from '../../App/utils';

export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const APIs = {
  getOrganizations: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`,
  searchPopup: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-frequency-report/get-simple-basket-report-history`,
  runReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-frequency-report/run-report`,
  confirmReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-frequency-report/warning`,
};

const { userId, fullName } = localstoreUtilites.getAuthFromLocalStorage().meta;

// gọi các api để khởi tạo data
function* fetchFormDataSaga() {
  try {
    yield put(setLoading());
    let paramsSearch = yield select(paramsSearchPopupSelect());
    paramsSearch = paramsSearch ? paramsSearch.toJS() : null;
    const [plantRes] = yield all([
      call(requestAuth, `${APIs.getOrganizations}?userId=${userId}`),
    ]);

    // Khởi tạo lựa chọn
    const formData = {
      listPlant: plantRes.data.map(item => ({
        value: item.value,
        label: `${item.value} ${item.name}`,
      })),
    };

    if (plantRes.data.length === 1) {
      paramsSearch.plantCode = [
        {
          label: `${plantRes.data[0].value} ${plantRes.data[0].name}`,
          value: plantRes.data[0].value,
        },
      ];
    }
    // Khởi tạo giá trị mặc định
    const initValue = {
      plantCode: [],
      date: new Date(),
      pageSize: 10,
      pageIndex: 0,
    };
    if (plantRes.data.length === 1) {
      initValue.plantCode = [
        {
          label: `${plantRes.data[0].value} ${plantRes.data[0].name}`,
          value: plantRes.data[0].value,
        },
      ];
    }
    yield searchPopupSaga({
      data: paramsSearch || initValue,
      plantRes: plantRes.data,
    });
    yield put(actions.fetchFormSuccess({ formData, initValue }));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// gọi hàm khi ấn button tìm kiếm trên màn popup
export function* searchPopupSaga(action) {
  const submitValues = action.data;
  let orgCodes = '';
  if (action.plantRes) {
    orgCodes = action.plantRes.map(item => item.value).toString();
  } else {
    const data = yield select(formDataSelector());
    orgCodes = data
      .toJS()
      .listPlant.map(item => item.value)
      .toString();
  }

  try {
    const queryParams = {
      orgCodes,
      plantCode:
        action.data.plantCode.length !== 0
          ? action.data.plantCode.map(item => item.value).toString()
          : null,
      date: submitValues.date.toISOString(),
      pageSize: submitValues.pageSize,
      pageIndex: submitValues.pageIndex,
    };
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.searchPopup}?${queryStr}`,
      optionReq(),
    );
    yield checkStatus(res);
    yield put(
      actions.searchPopupSuccess(res.data, {
        ...submitValues,
        pageSize: submitValues.pageSize,
        pageIndex: submitValues.pageIndex,
        totalItem: res.meta.count,
      }),
    );
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* confirmReportSaga(action) {
  const queryParams = {
    plantCode:
      action.data.plantCode.length !== 0
        ? action.data.plantCode.map(item => item.value).toString()
        : null,
    month: action.data.date.getMonth() + 1,
    year: action.data.date.getFullYear(),
  };
  try {
    // yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.confirmReport}?${queryStr}`,
      optionReq(),
    );
    yield checkStatus(res);
    if (action.callback) {
      yield action.callback(res.data);
    }
    // yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// api chạy báo cáo
export function* runReport(action) {
  const queryParams = {
    plantCode:
      action.data.plantCode.length !== 0
        ? action.data.plantCode.map(item => item.value).toString()
        : null,
    userId,
    userName: fullName,
    month: action.data.date.getMonth() + 1,
    year: action.data.date.getFullYear(),
    requestId: buildRequestId(),
  };
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      APIs.runReport,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: queryParams,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* basketUsingFrequenceCalculationSaga() {
  yield takeLeading(constants.FETCH_FORM, fetchFormDataSaga);
  yield takeLeading(constants.SEARCH_POPUP, searchPopupSaga);
  yield takeLeading(constants.RUN_REPORT, runReport);
  yield takeLeading(constants.CONFIRM_REPORT, confirmReportSaga);
}
