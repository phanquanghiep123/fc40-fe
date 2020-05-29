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
import * as constants from './constants';
import * as actions from './actions';
import { paramsSearchSelect, formDataSelector } from './selectors';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const APIs = {
  getOrganizations: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`,
  getBaskets: `${
    PATH_GATEWAY.MASTERDATA_API
  }/pallet-baskets?pageSize=-1&sortDirection=asc`,
  search: `${PATH_GATEWAY.REPORTADAPTER_API}/basket-frequency-report/simple`,
  searchPopup: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-frequency-report/get-simple-basket-report-history`,
  runReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-frequency-reportrun-report`,
  exportExcel: `${
    PATH_GATEWAY.BFF_SPA_API
  }/basket-frequency-report/export-excel`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/basket-frequency-report/print`,
  sync: `${PATH_GATEWAY.REPORTADAPTER_API}/basket-frequency-report/sync-sap`,
};

// gọi các api để khởi tạo data
function* fetchFormDataSaga() {
  const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
  try {
    yield put(setLoading());
    let paramsSearch = yield select(paramsSearchSelect());
    paramsSearch = paramsSearch ? paramsSearch.toJS() : null;
    const [basketRes, plantRes] = yield all([
      call(requestAuth, APIs.getBaskets),
      call(requestAuth, `${APIs.getOrganizations}?userId=${userId}`),
    ]);

    // Khởi tạo lựa chọn
    const formData = {
      listPlant: plantRes.data.map(item => ({
        value: item.value,
        label: `${item.value} ${item.name}`,
      })),
      listBaskets: basketRes.data.map(item => ({
        value: item.palletBasketCode,
        label: `${item.palletBasketCode} ${item.shortName}`,
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
    const date = new Date();
    // Khởi tạo giá trị mặc định
    const initValue = {
      plantCode: [],
      basketCode: [],
      // dateFrom: new Date(date.getFullYear(), date.getMonth() - 1),
      dateFrom: date,
      dateTo: date,
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
    yield searchSaga({
      data: paramsSearch || initValue,
      plantRes: plantRes.data,
    });
    yield put(actions.fetchFormSuccess({ formData, initValue }));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// api tìm kiếm
export function* searchSaga(action) {
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
        submitValues.plantCode.length !== 0
          ? submitValues.plantCode.map(item => item.value).toString()
          : null,
      basketCode:
        submitValues.basketCode.length !== 0
          ? submitValues.basketCode.map(item => item.value).toString()
          : null,
      dateFrom: submitValues.dateFrom.toISOString(),
      dateTo: submitValues.dateTo.toISOString(),
      pageSize: submitValues.pageSize,
      pageIndex: submitValues.pageIndex,
    };
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(request, `${APIs.search}?${queryStr}`, optionReq());
    yield checkStatus(res);
    yield put(
      actions.searchSuccess(res.data, {
        ...submitValues,
        pageSize: submitValues.pageSize,
        pageIndex: submitValues.pageIndex,
        totalItem: res.meta.count,
        total: res.meta.total,
      }),
    );
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// api xuất excel
export function* exportExcelSaga() {
  const paramsSearch = yield select(paramsSearchSelect());

  const submitValues = paramsSearch.toJS();
  const data = yield select(formDataSelector());
  const orgCodes = data
    .toJS()
    .listPlant.map(item => item.value)
    .toString();
  const queryParams = {
    orgCodes,
    plantCode:
      submitValues.plantCode.length !== 0
        ? submitValues.plantCode.map(item => item.value).toString()
        : null,
    basketCode:
      submitValues.basketCode.length !== 0
        ? submitValues.basketCode.map(item => item.value).toString()
        : null,
    dateFrom: submitValues.dateFrom.toISOString(),
    dateTo: submitValues.dateTo.toISOString(),
  };
  try {
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
      optionReq(),
      makeSaveFileFunc(),
    );
    checkStatus(response);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// api in
export function* printSaga(action) {
  const paramsSearch = yield select(paramsSearchSelect());

  const submitValues = paramsSearch.toJS();
  const data = yield select(formDataSelector());
  const orgCodes = data
    .toJS()
    .listPlant.map(item => item.value)
    .toString();
  const queryParams = {
    orgCodes,
    plantCode:
      submitValues.plantCode.length !== 0
        ? submitValues.plantCode.map(item => item.value).toString()
        : null,
    basketCode:
      submitValues.basketCode.length !== 0
        ? submitValues.basketCode.map(item => item.value).toString()
        : null,
    dateFrom: submitValues.dateFrom.toISOString(),
    dateTo: submitValues.dateTo.toISOString(),
  };
  try {
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.print}?${queryStr}`,
      optionReq(),
    );
    checkStatus(response);
    action.callback(response.data);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// api đồng bộ SAP
export function* syncSAP() {
  const paramsSearch = yield select(paramsSearchSelect());
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      APIs.sync,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: null,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    yield searchSaga({
      data: paramsSearch.toJS(),
    });
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* basketUsingFrequenceReportSaga() {
  yield takeLeading(constants.FETCH_FORM, fetchFormDataSaga);
  yield takeLeading(constants.SEARCH, searchSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.PRINT, printSaga);
  yield takeLeading(constants.SYNC, syncSAP);
}
