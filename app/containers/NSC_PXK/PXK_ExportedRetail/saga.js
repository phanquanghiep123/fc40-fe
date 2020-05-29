import { DELIVERY_ORDER_PLANT_TO_PLANT } from 'containers/App/constants';
import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { loadingError, setLoading } from 'containers/App/actions';
import { localstoreUtilites } from 'utils/persistenceData';

import request, {
  optionReq,
  METHOD_REQUEST,
  PATH_GATEWAY,
  responseCode,
  requestAuth,
} from 'utils/request';
import * as actions from './actions';
import * as pxkActions from '../PXK/actions';
import * as constants from './constants';
import mapper1 from '../PXK/mapper';
import * as mapper from './mapper';
import { TYPE_FORM } from './Business';
import {
  getPathRedirectCompletePXk,
  getUrlPXKDetails,
  getPathCompletePXK,
  getPathSavePXKTable,
} from '../PXK/utils';
import { transformBasket } from '../../NSC_ImportedStockReceipt/WeightPage/transformUtils';

const auth = localstoreUtilites.getAuthFromLocalStorage();

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user?userId=${
    auth.meta.userId
  }`,
  getPlant: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/plants/auto-complete?name=&type=${DELIVERY_ORDER_PLANT_TO_PLANT}`,
  getLocator: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/get-locator`,
  getExportSellType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/export-sell-type`,
  getTransporter: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/transporters?pageNumber=1&pageSize=10&sortColumn=0&sortDirection=desc`,
  getDataFromDeli: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exportedstockreceipts/get-data-from-deli`,
  getCustomer: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-distinct`,
  getCustomerDistinctRetails: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-distinct-retail`,
  // -----------------------
  getbusinessObjects: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/business-object-type`,
  getPaymentType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/payment-type`,
  getPackingStyles: `${PATH_GATEWAY.RESOURCEPLANNING_API}/packingStyles`,
  getRetailTypes: `${PATH_GATEWAY.RESOURCEPLANNING_API}/retailTypes`,
  getRetailCustomer: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/export-retail-retail-customer`,
  getSubType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/get-sub-type`,
  getsuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=100`,
};

const options = optionReq({
  method: METHOD_REQUEST.GET,
  body: null,
  authReq: true,
});

export function* getInitPXK(action) {
  try {
    yield put(setLoading(true));
    const res = yield all([
      // loại xuất kho
      call(request, APIs.getSubType, options),
      // đơn vị xuất hàng
      call(request, APIs.getOrg, options),
    ]);

    // map response from api to local
    const resMap = mapper.initCreate(res);
    yield put(actions.getInitPXKSucess(resMap));
    // init get list warehouse of the first plant
    yield getWarehouses({ plantId: resMap.resUnits[0].id });
    if (action.callback) yield action.callback();
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getWarehouses(action) {
  try {
    // Danh sách kho nguồn
    const res = yield call(
      request,
      `${APIs.getLocator}?plantCode=${action.plantId}`,
      options,
    );
    if (!res.data) {
      throw Object({ message: 'Không lấy được thông tin kho nguồn' });
    }

    yield put(actions.getWarehousesSucess(mapper1.getWarehouses(res)));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/**
 * @description
 * get autocomplete products by warehouse id
 */
export function* getProducts(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/${
        action.params.options.url
      }&filter=${action.params.inputText}`,
      options,
    );
    // test
    // const res = yield getPrds();
    // call function when success
    action.params.callback(mapper1.getProducts(res));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
export function* savePXKTable(action) {
  try {
    yield put(setLoading(true));
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}${getPathSavePXKTable(
        action,
      )}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.values,
        authReq: true,
      }),
    );

    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }

    yield put(actions.savePXKSuccess(res));
    yield put(setLoading(false));
    yield put(push('/danh-sach-phieu-xuat-kho'));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
// hoàn thành phiếu xuất COMPLETE_PXK
export function* completePXK(action) {
  try {
    yield put(setLoading(true));
    const body = action.values;
    body.loginName = `${auth.meta.fullName}`;
    body.loginPhoneNumber = `${auth.meta.phoneNumber}`;
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}${getPathCompletePXK(
        action,
      )}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body,
        authReq: true,
      }),
    );

    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }

    yield put(actions.savePXKSuccess(res));
    yield put(setLoading(false));
    // redirect
    yield put(push(getPathRedirectCompletePXk(action, res.data)));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getUsersAuto(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1&filterName=${
        action.inputText
      }`,
      options,
    );

    // call function when success
    action.callback(mapper.getUsersAuto(res));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getListRequestDestroy(action) {
  try {
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/exportedstockreceipts/get-list-request-cancellation-code?plantCode=${
        action.plantCode
      }`,
      options,
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    yield put(actions.saveDestroyList(res.data));
  } catch (e) {
    yield put(loadingError(e.mesage));
  }
}

function* getDependency(typePxk) {
  try {
    const dependency = {};
    if (typePxk === constants.TYPE_PXK.PXK_XDC_FARM) {
      const [receiverUnits, units] = yield all([
        call(request, APIs.getPlant, options),
        call(request, APIs.getOrg, options),
      ]);
      dependency.receiverUnits = yield mapper1.receiverUnits(receiverUnits);
      dependency.units = yield mapper1.units(units.data);
    }
    if (
      [constants.TYPE_PXK.PXK_NOI_BO, constants.TYPE_PXK.PXK_XUAT_BAN].includes(
        typePxk,
      )
    ) {
      const units = yield call(request, APIs.getOrg, options);
      dependency.units = yield mapper1.units(units.data);
    }
    yield put(actions.updateReducer({ set: dependency }));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// chưa dùng (sẽ sử dụng sau khi refactor)
export function* getPXKById(action) {
  try {
    yield put(setLoading(true));
    const res = yield all([
      call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/exportedstockreceipts/get-sub-type`,
        options,
      ),
      call(
        request,
        `${PATH_GATEWAY.BFF_SPA_API}${getUrlPXKDetails(action)}`,
        options,
      ),
    ]);
    if (res[0].statusCode !== responseCode.ok || !res[0].data) {
      throw Object({ message: res[0].message });
    }
    if (res[1].statusCode !== responseCode.ok || !res[1].data) {
      throw Object({ message: res[1].message });
    }
    yield getDependency(res[1].data.subType);
    const resMap = yield mapper.getPXKById(res);
    // if edit, call warehouse list (case add more record)
    if (action.params.form === TYPE_FORM.EDIT) {
      yield getWarehouses({ plantId: action.params.plantId });
    }

    yield put(pxkActions.getPXKByIdSuccess(resMap));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* deleterRow(action) {
  try {
    yield put(setLoading(true));
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/exportedstockreceipts/${
        action.params.id
      }/details`,
      optionReq({
        method: METHOD_REQUEST.DELETE,
        body: action.values,
        authReq: true,
      }),
    );

    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    // delete row on view
    action.callback();
    yield put(actions.savePXKSuccess(res));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// xuất bán
export function* getBasketManagerAuto(action) {
  try {
    const { inputText, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });

    const requestCustomerURL = `${APIs.getCustomer}?filter=${inputText}`;
    const requestSupplierURL = `${APIs.getsuppliers}?&search=${inputText}`;
    const [supplierRes, customerRes] = yield all([
      call(request, requestSupplierURL, GETOption),
      call(request, requestCustomerURL, GETOption),
    ]);
    if (!supplierRes.data || !customerRes.data) {
      throw Object({
        message: 'Không lấy được thông tin Đơn Vị Quản Lý Khay Sọt',
      });
    }
    const fieldData = [
      ...mapper1.getBasketManagerAutoSupplier(supplierRes),
      ...mapper1.getBasketManagerAuto(customerRes),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

function* getbusinessObjects() {
  const res = yield all([
    call(requestAuth, `${APIs.getbusinessObjects}`),
    call(requestAuth, `${APIs.getSubType}`),
    call(requestAuth, `${APIs.getOrg}`),
    call(requestAuth, `${APIs.getTransporter}`),
  ]);
  yield put(
    actions.updateReducer({
      set: {
        businessObjects: res[0].data,
        exportTypes: res[1].data,
        units: mapper.deliverCodeUnits(res[2].data),
        transporters: mapper.transporters(res[3].data),
      },
    }),
  );
}

function* getPaymentType() {
  try {
    const res = yield call(requestAuth, `${APIs.getPaymentType}`);
    if (res.statusCode !== responseCode.ok || !res.data) {
      throw Object({ message: 'Không lấy được hình thức thanh toán' });
    }
    yield put(actions.updateReducer({ set: { paymentTypes: res.data } }));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getPackingStyles() {
  try {
    const res = yield call(requestAuth, `${APIs.getPackingStyles}`);
    if (!res.data) {
      throw Object({ message: 'Không lấy được quy cách đóng gói' });
    }
    const resMap = mapper.getPackingStyles(res.data);
    yield put(actions.updateReducer({ set: { packingStyles: resMap } }));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getRetailTypes() {
  try {
    const res = yield call(requestAuth, `${APIs.getRetailTypes}`);
    if (!res.data) {
      throw Object({ message: 'Không lấy được loại hàng xá' });
    }
    const resMap = mapper.getRetailTypes(res.data);
    yield put(actions.updateReducer({ set: { retailTypes: resMap } }));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getBasketAuto(action) {
  try {
    const { inputText, callback } = action;
    const requestURL = `${
      PATH_GATEWAY.MASTERDATA_API
    }/pallet-baskets?search=${inputText}`;

    const response = yield call(requestAuth, requestURL);

    if (response && response.data) {
      callback(transformBasket(response.data));
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getCustomerAuto(action) {
  try {
    const res = yield call(
      request,
      `${APIs.getCustomerDistinctRetails}?filter=${action.inputText}`,
      options,
    );
    yield action.callback(mapper.getCustomerAuto(res));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getRetailCustomer(action) {
  try {
    const res = yield call(
      request,
      `${APIs.getRetailCustomer}?soldTo=${action.soldTo}&search=${
        action.inputText
      }`,
      options,
    );
    yield action.callback(mapper.getRetailCustomer(res));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  yield takeLeading(constants.GET_INIT_PXK, getInitPXK); // init màn hình tạo phiếu xuất kho (loại xuất kho,đơn vị nhận hàng, đơn vị xuất hàng)
  yield takeLatest(constants.GET_PRODUCTS, getProducts); // Lấy thông tin sản phẩm của phiếu xuất chuyển nội bộ
  yield takeLeading(constants.SAVE_PXK, savePXKTable); // lưu phiếu xuất bước 2 SAVE_PXK (chuyển về danh sách)
  yield takeLeading(constants.GET_LIST_REQUEST_DESTROY, getListRequestDestroy); // lấy danh sách phiếu xuất hủy theo đơn vị
  yield takeLeading(constants.COMPLETE_PXK, completePXK); // hoàn thành phiếu xuất COMPLETE_PXK
  yield takeLeading(constants.DELETE_ROW, deleterRow);
  yield takeLatest(constants.GET_BASKET_AUTO, getBasketAuto); // autocomple khay sọt
  yield takeLatest(constants.GET_BASKET_MANGAGERS, getBasketManagerAuto); // autocomple quản lý khay sọt
  // ----------------------------------------------
  yield takeLeading(constants.GET_PXK_BY_ID, getPXKById);
  yield takeLeading(constants.GET_WAREHOUSES, getWarehouses); // Get danh sách kho nguồn của Plant
  yield takeLatest(constants.GET_USERS, getUsersAuto); // auto complete lấy user
  yield takeLeading(constants.GET_BUSINESS_OBJECTS, getbusinessObjects); // đối tượng bán hàng
  yield takeLeading(constants.GET_PAYMENT_TYPES, getPaymentType); // hình thức thanh toán
  yield takeLatest(constants.GET_CUSTOMER_CODE_AUTO, getCustomerAuto); // autocomple mã khách hàng
  yield takeLatest(constants.GET_RETAIL_CUSTOMER, getRetailCustomer); // autocomple khách hàng
  yield takeLatest(constants.GET_PACKING_STYPES, getPackingStyles); // select qui cách đóng gói
  yield takeLatest(constants.GET_RETAIL_TYPES, getRetailTypes); // select loại hàng xá
}
