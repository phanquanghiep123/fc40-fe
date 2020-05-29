import { put, call, select, takeLeading } from 'redux-saga/effects';

import {
  optionReq,
  checkStatus,
  requestAuth,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';
import { localstoreUtilites } from 'utils/persistenceData';

import {
  openDialog,
  setLoading,
  showSuccess,
  loadingError,
} from 'containers/App/actions';
import { makeSaveFileFunc, serializeQueryParams } from 'containers/App/utils';

import { sendMailSuccess } from './actions';
import { makeSelectImportId } from './selectors';
import { masterRoutine, suppliersRoutine } from './routines';

import { SEND_MAIL, DOWNLOAD_FILE } from './constants';

import { getIsSent, getListIds } from './utils';

const auth = localstoreUtilites.getAuthFromLocalStorage();

const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;

export function getSuppliersQuery({
  totalCount, // bỏ qua
  ...params
}) {
  return serializeQueryParams({
    ...params,
    date: params.date ? params.date.toISOString() : '',
  });
}

/**
 * Lưu file kết quả gửi mail
 */
export function processResponse(response) {
  if (
    response.headers.get('content-type') &&
    response.headers.get('content-type').indexOf('application/json') > -1
  ) {
    return response.json();
  }

  makeSaveFileFunc()(response);

  return {
    ...response,
    statusCode: 200,
    message: 'Tải xuống thành công',
  };
}

export function* getInitMaster(action) {
  try {
    yield put(setLoading());

    const { importId, callback } = action.payload || {};

    const requestURL = `${BFF_SPA_URL}/order-supplier-mail/get-init-data-by-import-id?importId=${importId}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      importId,
      regions: response.data.regions,
      suppliers: response.data.suppliers,
      sendStatus: response.data.status,
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

export function* getSuppliers(action) {
  try {
    yield put(setLoading());

    const importId = yield select(makeSelectImportId());
    const { params } = action.payload || {};

    const queryParams = getSuppliersQuery({ ...params, importId });
    const requestURL = `${BFF_SPA_URL}/order-supplier-mail/get-order-supplier-mail-detail?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data,
      formSearch: {
        ...params,
        isSent: getIsSent(response.data),
        totalCount: response.meta.count,
      },
    };

    yield put(suppliersRoutine.success(payload));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* sendMail(action) {
  try {
    yield put(setLoading());

    const { datas, callback } = action;

    const listId = getListIds(datas);
    const { email, fullName, phoneNumber: phone } = auth.meta;

    const requestURL = `${BFF_SPA_URL}/order-supplier-mail/send-mail`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: {
          listId,
          fullName,
          phone,
          email,
        },
      }),
    );
    checkStatus(response);

    if (callback) {
      callback();
    }

    yield put(sendMailSuccess(response.data));
    yield put(openDialog());

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* downloadFile(action) {
  try {
    yield put(setLoading());

    const requestURL = `${BFF_SPA_URL}/order-supplier-mail/download-file/${
      action.downloadId
    }`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq(),
      processResponse,
    );
    checkStatus(response);

    yield put(setLoading(false));
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLeading(SEND_MAIL, sendMail);
  yield takeLeading(DOWNLOAD_FILE, downloadFile);

  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(suppliersRoutine.REQUEST, getSuppliers);
}
