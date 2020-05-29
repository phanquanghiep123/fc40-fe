import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects';

import {
  optionReq,
  checkStatus,
  requestAuth,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';

import { setLoading, showSuccess, loadingError } from 'containers/App/actions';

import {
  masterRoutine,
  productRoutine,
  importedRoutine,
  receiptsRoutine,
  customerRoutine,
} from './routines';
import { TYPE_ACTION } from './constants';

import {
  transformBasket,
  transformPallet,
  formatWeighedProduct,
  transformWeighedProduct,
  transformWeighedReceipts,
} from './transformUtils';

export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;
export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
export const CAPACITYCONTROL_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;

export function* getInitMaster(action) {
  try {
    const { callback } = action.payload || {};

    yield put(setLoading());

    const [initResponse, basketsResponse, palletsResponse] = yield all([
      call(
        requestAuth,
        `${BFF_SPA_URL}/importedstockreceipts/init-weighed-list`,
      ),
      call(
        requestAuth,
        `${MASTER_URL}/pallet-baskets?pageSize=-1&sortDirection=asc`,
      ),
      call(requestAuth, `${MASTER_URL}/pallets?pageSize=-1&sortDirection=asc`),
    ]);
    checkStatus(initResponse);
    // checkStatus(basketsResponse);
    // checkStatus(palletsResponse);

    const payload = {
      baskets: transformBasket(basketsResponse.data),
      pallets: transformPallet(palletsResponse.data),
      importedType: initResponse.data.importType,
      processingType: initResponse.data.processingType,
      recoveryRate: initResponse.data.defaultRecoveryRate,
      organizations: initResponse.data.organizations,
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

export function* getWeighedProduct(action) {
  try {
    const { params, isSaved, callback } = action.payload || {};
    const {
      documentId,
      productCode,
      finshedProductCode,
      slotCode,
      processingType,
      listIds,
      deliveryName,
      processingTypeName,
    } = params || {};

    yield put(setLoading());

    let requestURL = `${BFF_SPA_URL}/importedstockreceipts/weighed-list`;
    requestURL += `?documentId=${documentId || ''}`;
    requestURL += `&productCode=${productCode || ''}`;
    requestURL += `&finshedProductCode=${finshedProductCode || ''}`;
    requestURL += `&slotCode=${slotCode || ''}`;
    requestURL += `&processingType=${processingType || ''}`;
    requestURL += `&listIds=${listIds || ''}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: transformWeighedProduct(response.data),
      isSaved, // Không reset thông tin cân
      deliveryName,
      processingTypeName,
    };
    yield put(productRoutine.success(payload));

    if (callback) {
      callback();
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getWeighedReceipts(action) {
  try {
    const { plantCode, callback } = action.payload || {};

    yield put(setLoading());

    const requestURL = `${BFF_SPA_URL}/importedstockreceipts/weighed-receipt?plantCode=${plantCode}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: transformWeighedReceipts(response.data),
    };
    yield put(receiptsRoutine.success(payload));

    if (callback) {
      callback();
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* doImportedStock(action) {
  try {
    const { type, data, callback } = action.payload || {};

    yield put(setLoading());

    const requestURL = `${CAPACITYCONTROL_URL}/importedstockreceipts/${
      type === TYPE_ACTION.IMPORT_STOCK
        ? 'weighted-import-stock'
        : 'weighted-complete-import-stock'
    }`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: formatWeighedProduct(data),
      }),
    );
    checkStatus(response);

    const payload = {
      data,
    };
    yield put(importedRoutine.success(payload));

    if (callback) {
      callback(type);
    }

    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}
/*
* autocomplete nhập khách hàng cho nhập kho
* */
export function* getCustomerAuto(action) {
  const { inputText, callback } = action.payload;
  try {
    const requestURL = `${
      PATH_GATEWAY.RESOURCEPLANNING_API
    }/customer/autocomplete-distinct?filter=${inputText}`;
    const res = yield call(requestAuth, requestURL);
    yield callback(res.data);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(productRoutine.REQUEST, getWeighedProduct);
  yield takeLeading(importedRoutine.REQUEST, doImportedStock);
  yield takeLeading(receiptsRoutine.REQUEST, getWeighedReceipts);
  yield takeLatest(customerRoutine.REQUEST, getCustomerAuto);
}
