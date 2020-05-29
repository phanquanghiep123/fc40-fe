import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects';

import { localstoreUtilites } from 'utils/persistenceData';
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

import {
  transformBaskets,
  transformPallets,
} from 'components/GoodsWeight/utils';

import {
  masterRoutine,
  productRoutine,
  customerRoutine,
  receiptsRoutine,
  productsRoutine,
  importedRoutine,
} from './routines';
import { setInitWeightPopup } from './actions';

import { TYPE_PXK, OPEN_WEIGHT_POPUP } from './constants';

const auth = localstoreUtilites.getAuthFromLocalStorage();

export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;
export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
export const AUTHORIZATION_URL = PATH_GATEWAY.AUTHORIZATION_API;
export const CAPACITYCONTROL_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;

/**
 * Khởi tạo màn hình
 */
export function* getInitMaster(action) {
  try {
    const { callback } = action.payload || {};

    yield put(setLoading());

    const [basketsResponse, palletsResponse, organizationsResponse] = yield all(
      [
        call(
          requestAuth,
          `${MASTER_URL}/pallet-baskets?pageSize=-1&sortDirection=asc`,
        ),
        call(
          requestAuth,
          `${MASTER_URL}/pallets?pageSize=-1&sortDirection=asc`,
        ),
        call(
          requestAuth,
          `${AUTHORIZATION_URL}/organizations/get-by-user?userId=${
            auth.meta.userId
          }`,
        ),
      ],
    );
    // checkStatus(basketsResponse);
    // checkStatus(palletsResponse);
    checkStatus(organizationsResponse);

    const payload = {
      baskets: transformBaskets(basketsResponse.data),
      pallets: transformPallets(palletsResponse.data),
      organizations: organizationsResponse.data,
    };
    yield put(masterRoutine.success(payload));

    if (callback) {
      callback(payload);
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Danh sách phiếu cân
 */
export function* getReceiptsWeighing(action) {
  try {
    const { plantCode, callback } = action.payload || {};

    yield put(setLoading());

    const [receiptsResponse, recentlyReceiptsResponse] = yield all([
      call(
        requestAuth,
        `${BFF_SPA_URL}/exportedstockreceipts/weight-receipts?deliverCode=${plantCode}`,
      ),
      call(
        requestAuth,
        `${BFF_SPA_URL}/exportedstockreceipts/recently-weight-receipts?deliverCode=${plantCode}`,
      ),
    ]);
    checkStatus(receiptsResponse);
    checkStatus(recentlyReceiptsResponse);

    const payload = {
      data: receiptsResponse.data,
      recently: recentlyReceiptsResponse.data,
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

/*
* autocomplete nhập khách hàng cho phiếu chuyển nội bộ
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
 * Danh sách sản phẩm cân của phiếu
 */
export function* getProductsWeighing(action) {
  try {
    yield put(setLoading());

    const { params, callback } = action.payload || {};
    let requestURL = '';

    switch (params.subType) {
      case TYPE_PXK.PXK_NOI_BO:
        requestURL = `${BFF_SPA_URL}/exportedstockreceipts/${
          params.documentId
        }/details-internal-transfer?isWeight=true`;
        break;

      case TYPE_PXK.PXK_XUAT_BAN:
        requestURL = `${BFF_SPA_URL}/exportedstockreceipts/export-sell/${
          params.documentId
        }?isWeight=true`;
        break;

      case TYPE_PXK.PXK_XUAT_BAN_XA:
        requestURL = `${BFF_SPA_URL}/exportedstockreceipts/${
          params.documentId
        }/details-retail?isWeight=true`;
        break;

      default:
        requestURL = `${BFF_SPA_URL}/exportedstockreceipts/${
          params.documentId
        }/details-transfer?isWeight=true`;
        break;
    }

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data.detailsCommands,
    };
    yield put(productsRoutine.success(payload));

    if (callback) {
      callback();
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Danh sách các lần cân của sản phẩm
 */
export function* getProductTurnScales(action) {
  try {
    const { params } = action.payload || {};

    const requestURL = `${BFF_SPA_URL}/exportedstockreceipts/weighed-list?documentDetailId=${
      params.documentDetailId
    }`;

    yield put(setLoading());

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data.turnToScales || [],
    };
    yield put(productRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Nhập kho sản phẩm
 */
export function* performImportStock(action) {
  try {
    const { data, callback } = action.payload || {};

    const requestURL = `${CAPACITYCONTROL_URL}/exportedstockreceipts/weighed-product`;

    yield put(setLoading());

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: data,
      }),
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

/**
 * Hành động mở popup cân
 */
export function* openWeightPopupSaga(action) {
  try {
    const { weightData, callback } = action || {};

    yield put(setInitWeightPopup(weightData));
    yield put(productsRoutine.request({ params: weightData, callback }));
    yield put(openDialog());
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(productsRoutine.REQUEST, getProductsWeighing);
  yield takeLeading(receiptsRoutine.REQUEST, getReceiptsWeighing);
  yield takeLatest(customerRoutine.REQUEST, getCustomerAuto);
  yield takeLeading(productRoutine.REQUEST, getProductTurnScales);
  yield takeLeading(importedRoutine.REQUEST, performImportStock);

  yield takeLeading(OPEN_WEIGHT_POPUP, openWeightPopupSaga);
}
