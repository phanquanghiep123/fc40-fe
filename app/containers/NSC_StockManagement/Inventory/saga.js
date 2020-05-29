import { all, call, put, takeLeading } from 'redux-saga/effects';
import request, {
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  METHOD_REQUEST,
  checkStatus,
} from 'utils/request';
import { transformBasket, transformPallet } from 'utils/basket/transformUtils';
import { localstoreUtilites } from 'utils/persistenceData';
import { showSuccess, loadingError, setLoading } from 'containers/App/actions';
import * as constants from './constants';
import * as actions from './actions';

export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;
export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;

const APIs = {
  getProducts: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/get-product-auto-complete`,
  getLocator: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/get-locator`,
  getOrganizations: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`,
  save: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/stock-taking-save`,
  complete: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/stock-taking-complete`,
  fillProduct: `${
    PATH_GATEWAY.BFF_SPA_API
  }/inventory-mgts/stock-taking-product-detail`,
  delete: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/stock-taking-delete`,
};

const options = optionReq({
  method: METHOD_REQUEST.GET,
  body: null,
  authReq: true,
});
/*
* - get list plant
* - get list basket
* - get list pallet
* */
function* fetchFormDataSaga(action) {
  try {
    const auth = localstoreUtilites.getAuthFromLocalStorage();
    const [organizationsRespon, basketsResponse, palletsResponse] = yield all([
      call(requestAuth, `${APIs.getOrganizations}?userId=${auth.meta.userId}`),
      call(requestAuth, `${MASTER_URL}/pallet-baskets`),
      call(requestAuth, `${MASTER_URL}/pallets?pageSize=-1&sortDirection=asc`),
    ]);
    const payload = {
      baskets: transformBasket(basketsResponse.data),
      pallets: transformPallet(palletsResponse.data),
      // plant
      organizations: organizationsRespon.data,
    };
    yield put(actions.fetchFormDataSuccess(payload));
    if (action.callback) {
      yield action.callback(payload);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// get data product detail when select
export function* fillProductSaga(action) {
  const { params } = action;
  try {
    const res = yield call(
      request,
      `${APIs.fillProduct}?plantCode=${params.plantCode}&locatorId=${
        params.locatorId
      }&productCode=${params.productCode}&batch=${params.batch}`,
      options,
    );
    if (action.callback) {
      yield put({ type: constants.FILL_PRODUCT_SUCCESS, product: res });
      yield action.callback(res);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getWarehousesSaga(action) {
  try {
    // Danh sách kho nguồn
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.getLocator}?plantCode=${action.plantId}`,
      options,
    );
    yield put(actions.getWarehousesSuccess(res, action.status));
    if (action.callback) {
      if (res.data.length > 0) {
        yield action.callback(res.data[0]);
      }
    }
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getListProductSaga(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.getProducts}?plantCode=${action.plantId}&locatorId=${
        action.locatorId
      }`,
      options,
    );
    yield put(actions.getListProductSuccess(res));
    if (action.callback) {
      yield action.callback(res.data[0]);
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* saveSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.save}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.values,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback(response);
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* completeSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.complete}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.values,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* deleteSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.delete}`,
      optionReq({
        method: METHOD_REQUEST.DELETE,
        body: action.params,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* InventorySagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.GET_WAREHOUSES, getWarehousesSaga);
  yield takeLeading(constants.GET_LIST_PRODUCT, getListProductSaga);
  yield takeLeading(constants.SAVE, saveSaga);
  yield takeLeading(constants.COMPLETE, completeSaga);
  yield takeLeading(constants.FILL_PRODUCT, fillProductSaga);
  yield takeLeading(constants.DELETE_PRODUCT, deleteSaga);
}
