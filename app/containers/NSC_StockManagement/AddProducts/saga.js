import {
  all,
  put,
  call,
  select,
  takeLeading,
  takeLatest,
} from 'redux-saga/effects';

import request, {
  requestAuth,
  PATH_GATEWAY,
  optionReq,
  METHOD_REQUEST,
  checkStatus,
} from 'utils/request';
import { setLoading, loadingError, showSuccess } from 'containers/App/actions';
import {
  transformBasket,
  transformPallet,
  transformWeighedReceipts,
} from 'utils/basket/transformUtils';
import { localstoreUtilites } from 'utils/persistenceData';

import * as constants from './constants';
import * as actions from './actions';
import mapper from '../../NSC_PXK/PXK/mapper';
import * as selectors from './selectors';

export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;
export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
export const CAPACITYCONTROL_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;

const options = optionReq({
  method: METHOD_REQUEST.GET,
  body: null,
  authReq: true,
});

const APIs = {
  getLocator: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/locator`,
  getProducts: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/products/auto-complete-by-plancode-and-materialtype`, // ?search=${inputText}
  getOrigin: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/plant-supplier/auto-complete`, // search=${inputText}&plantType=2
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* getInitMaster(action) {
  try {
    const { callback } = action || {};
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [initResponse, basketsResponse, palletsResponse] = yield all([
      call(requestAuth, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      call(
        requestAuth,
        `${MASTER_URL}/pallet-baskets?pageSize=-1&sortDirection=asc`,
      ),
      call(requestAuth, `${MASTER_URL}/pallets?pageSize=-1&sortDirection=asc`),
    ]);
    checkStatus(initResponse);
    const payload = {
      baskets: transformBasket(basketsResponse.data),
      pallets: transformPallet(palletsResponse.data),
      organizations: initResponse.data,
    };

    yield put(actions.getInitMasterSucces(payload));

    if (callback) {
      yield callback();
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}
export function* getWarehouses(action) {
  const { plantCode, callback } = action.payload;
  try {
    yield put(setLoading());

    // Danh sách kho nguồn
    const res = yield call(
      request,
      `${APIs.getLocator}?plantCode=${plantCode}`,
      options,
    );
    if (!res.data) {
      throw Object({ message: 'Không lấy được thông tin kho nguồn' });
    }
    yield put(actions.getWarehousesSucess(mapper.getWarehouses(res)));
    if (callback) {
      yield callback(res);
    }
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
export function* getOriginAuto(action) {
  try {
    const { inputText, callback } = action;
    const response = yield call(
      requestAuth,
      `${APIs.getOrigin}?search=${inputText}&plantType=2`,
    );
    const fieldData = [
      ...response.map(item => ({
        value: item.code,
        label: `${item.code} ${item.name}`,
      })),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getProductAuto(action) {
  try {
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const { inputText, callback, plantCode } = action;
    const response = yield call(
      requestAuth,
      `${APIs.getProducts}?plantCode=${plantCode}&filter=${inputText}`,
      GETOption,
    );

    const fieldData = [
      ...response.map(item => ({
        value: item.productCode,
        label: `${item.productCode} - ${item.productDescription}`,
        uom: item.baseUoM,
        description: item.productDescription,
      })),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getInventory(action) {
  try {
    const { plantCode, callback } = action.payload || {};

    yield put(setLoading());

    const requestURL = `${BFF_SPA_URL}/importedstockreceipts/weighed-receipt?plantCode=${plantCode}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: transformWeighedReceipts(response.data),
    };
    yield put(actions.getInventorySuccess(payload));

    if (callback) {
      yield callback();
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* doInventoryStock(action) {
  try {
    const { actionType, data, callback } = action || {};
    yield put(setLoading());
    const requestURL = `${CAPACITYCONTROL_URL}/inventory-mgts/${
      actionType === constants.TYPE_ACTION.IMPORT_STOCK
        ? 'stock-taking-save'
        : 'stock-taking-complete'
    }`;
    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        authReq: true,
        body: data,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    const fieldData = response.data;
    if (actionType === constants.TYPE_ACTION.IMPORT_STOCK) {
      const dataPalletBasket = yield select(selectors.makeSelectData());
      const optionsBasket = {};
      dataPalletBasket.toJS().baskets.forEach(item => {
        optionsBasket[item.palletBasketCode] = item.palletBasketName;
      });
      const optionBasketWeight = {};
      dataPalletBasket.toJS().baskets.forEach(item => {
        optionBasketWeight[item.palletBasketCode] = item.basketWeight;
      });
      const optionsPallet = {};
      dataPalletBasket.toJS().pallets.forEach(item => {
        optionsPallet[item.palletCode] = item.palletName;
      });
      const optionsPalletWeight = {};
      dataPalletBasket.toJS().pallets.forEach(item => {
        optionsPalletWeight[item.palletCode] = item.palletWeight;
      });
      const stockTaking = fieldData.stockTakingTurnToScaleDetails;
      fieldData.stockTakingTurnToScaleDetails.map((item, index) => {
        stockTaking[index].palletBasketName =
          optionsBasket[item.palletBasketCode];
        stockTaking[index].basketWeight =
          optionBasketWeight[item.palletBasketCode];
        stockTaking[index].palletName = optionsPallet[item.palletCode];
        stockTaking[index].palletWeight = optionsPalletWeight[item.palletCode];
        return stockTaking;
      });
      fieldData.stockTakingTurnToScaleDetails = [...stockTaking];
    }

    const payload = {
      data,
    };
    yield put(actions.getInventorySuccess(payload));
    if (callback) {
      yield callback(fieldData);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.INIT_MASTER, getInitMaster);
  yield takeLeading(constants.GET_WAREHOUSES, getWarehouses); // Get danh sách kho nguồn của Plant
  yield takeLeading(constants.GET_ORIGIN_AUTO, getOriginAuto);
  yield takeLatest(constants.GET_PRODUCT_AUTO, getProductAuto);
  yield takeLatest(constants.GET_INVENTORY, getInventory);
  yield takeLeading(constants.INVENTORY_STOCK, doInventoryStock);
}
