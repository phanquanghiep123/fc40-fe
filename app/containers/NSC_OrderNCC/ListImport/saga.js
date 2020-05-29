import { all, put, call, takeLeading } from 'redux-saga/effects';

import {
  optionReq,
  checkStatus,
  requestAuth,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';

import {
  openDialog,
  setLoading,
  showSuccess,
  loadingError,
} from 'containers/App/actions';
import { makeSaveFileFunc, serializeQueryParams } from 'containers/App/utils';

import { masterRoutine, importFilesRoutine } from './routines';

import { UPLOAD_FILE, OPEN_IMPORT_FILE } from './constants';

const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const AUTHORIZATION_URL = PATH_GATEWAY.AUTHORIZATION_API;

export function getImportFilesQuery({
  totalCount, // bỏ qua
  ...params
}) {
  return serializeQueryParams({
    ...params,
    dateTo: params.dateTo ? params.dateTo.toISOString() : '',
    dateFrom: params.dateFrom ? params.dateFrom.toISOString() : '',
    importDate: params.importDate ? params.importDate.toISOString() : '',
  });
}

/**
 * Xử lý response nhận được khi Import file
 */
export function processResponse(response) {
  /**
   * Kiểm tra Content-Type nhận được từ response
   */
  if (
    response.headers.get('content-type') &&
    response.headers.get('content-type').indexOf('application/json') > -1
  ) {
    return response.json();
  }

  /**
   * Lưu file lỗi nhận được khi Import file lỗi
   */
  makeSaveFileFunc()(response);

  return {
    ...response,
    statusCode: 500,
    message:
      'File tải lên không hợp lệ, vui lòng kiểm tra lại theo file được tải xuống',
  };
}

export function* getInitMaster(action) {
  try {
    yield put(setLoading());

    const { callback } = action.payload || {};

    const [regionsResponse, orderTypesResponse] = yield all([
      call(requestAuth, `${AUTHORIZATION_URL}/Regions?&pageSize=-1`),
      call(requestAuth, `${BFF_SPA_URL}/order-supplier/get-different-types`),
    ]);
    checkStatus(regionsResponse);
    checkStatus(orderTypesResponse);

    const payload = {
      regions: regionsResponse.data,
      orderTypes: orderTypesResponse.data,
    };
    yield put(masterRoutine.success(payload));

    if (callback) {
      callback();
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getImportFiles(action) {
  try {
    yield put(setLoading());

    const { params } = action.payload || {};

    const queryParams = getImportFilesQuery(params);
    const requestURL = `${BFF_SPA_URL}/order-supplier/get-import-histories?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data,
      formSearch: {
        ...params,
        totalCount: response.meta.count,
      },
    };

    yield put(importFilesRoutine.success(payload));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* uploadFile(action) {
  try {
    yield put(setLoading());

    const { data: params, callback } = action;

    const formData = new FormData();
    formData.append('fileType', params.fileType);
    formData.append('uploadingFile', params.uploadingFile);
    formData.append('productionRegion', params.productionRegion);

    const requestURL = `${BFF_SPA_URL}/order-supplier/import-order-supplier`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: formData,
      }),
      processResponse,
    );
    checkStatus(response);

    if (callback) {
      callback();
    }

    yield put(setLoading(false));
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* openImportFile() {
  yield put(openDialog());
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLeading(UPLOAD_FILE, uploadFile);
  yield takeLeading(OPEN_IMPORT_FILE, openImportFile);

  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(importFilesRoutine.REQUEST, getImportFiles);
}
