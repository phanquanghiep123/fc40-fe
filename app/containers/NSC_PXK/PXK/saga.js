/* eslint-disable eqeqeq */
import { DELIVERY_ORDER_PLANT_TO_PLANT } from 'containers/App/constants';
import { extend, find, map } from 'lodash';
import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { loadingError, setLoading, showWarning } from 'containers/App/actions';
import { localstoreUtilites } from 'utils/persistenceData';
import request, {
  optionReq,
  METHOD_REQUEST,
  PATH_GATEWAY,
  responseCode,
  requestAuth,
} from 'utils/request';
import { fromJS } from 'immutable';
import * as actions from './actions';
import * as constants from './constants';
import mapper from './mapper';
import { TYPE_FORM } from './Business';
import {
  getPathRedirectCompletePXk,
  getUrlPXKDetails,
  getPathCompletePXK,
  getPathSavePXKTable,
  getUrlCreatePXK,
  getUrlReceiver,
} from './utils';
import { transformBasket } from '../../NSC_ImportedStockReceipt/WeightPage/transformUtils';

const auth = localstoreUtilites.getAuthFromLocalStorage();

const APIs = {
  getSubType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/get-sub-type`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user?userId=${
    auth.meta.userId
  }`,
  getPlant: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/plants/auto-complete?name=&type=${DELIVERY_ORDER_PLANT_TO_PLANT}`,
  getLocator: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/get-locator`,
  getExportSellType: `${PATH_GATEWAY.RESOURCEPLANNING_API}/get-list-ordertype`,
  getChannel: `${PATH_GATEWAY.RESOURCEPLANNING_API}/distribution-channel`,
  getChannelByType: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/distribution-channel-ordertype`,
  getTransporter: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/transporters?pageNumber=1&pageSize=10&sortColumn=0&sortDirection=desc`,
  getDataFromDeli: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exportedstockreceipts/get-data-from-deli`,
  getCustomer: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-distinct`,
  getSuggestFromTurnToScale: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exportedstockreceipts/suggest-from-turn-to-scale`,
  getBatchAuto: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventories/get-batch-autocomplete`,
  getWarningSave: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/check-complete-exported-sell`,
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
      // danh sách đơn vị nhận hàng
      call(request, APIs.getPlant, options),
    ]);
    // map response from api to local
    const resMap = mapper.initCreate(res, action.subType, action.data);
    yield put(actions.getInitPXKSucess(resMap));
    // init get list warehouse of the first plant
    yield getWarehouses({ plantId: resMap.resUnits[0].id });
    if (action.callback) yield action.callback();
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getReceiver(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.RESOURCEPLANNING_API}${getUrlReceiver(action)}`,
      options,
    );
    const resMap = mapper.mapPlantToPlant(res);
    yield put(actions.getReceiverSuccess(resMap));
  } catch (e) {
    yield put(loadingError(e.message));
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

    yield put(actions.getWarehousesSucess(mapper.getWarehouses(res)));
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
    action.params.callback(mapper.getProducts(res));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* setRetailCustomerId(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/exportedstockreceipts/${
        action.id
      }/details-retail`,
      options,
    );
    if (!res.data) {
      throw Object({ message: res.message });
    }
    yield put(
      actions.updateReducer({
        setIn: { initSchema_retailCustomerId: res.data.retailCustomerId || '' },
      }),
    );
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// lưu phiếu xuất bước 1 SAVE (không chuyển page)
export function* postSavePXK(action) {
  try {
    yield put(setLoading(true));
    const mainValues = {
      ...action.values,
      deliverCode: {
        label: action.values.deliverName,
        value: action.values.deliverCode,
      },
      receiverCode: {
        label: action.values.receiverName,
        value: action.values.receiverCode,
      },
    };
    yield put(
      actions.updateReducer({ set: { initSchema: fromJS(mainValues) } }),
    );
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}${getUrlCreatePXK(action)}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.values,
        authReq: true,
      }),
    );

    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }

    // call function when success
    action.callback(res.data);
    yield put(actions.savePXKSuccess(res));
    yield put(setLoading(false));
    if (action.values.subType === constants.TYPE_PXK.PXK_XUAT_BAN_XA) {
      yield setRetailCustomerId({ id: res.data });
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
// lưu phiếu xuất bước 2 SAVE_PXK (chuyển về danh sách)
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

export function* getCustomerAuto(action) {
  try {
    const res = yield call(
      request,
      `${APIs.getCustomer}?filter=${action.inputText}`,
      options,
    );
    yield action.callback(mapper.getCustomerAuto(res));
  } catch (e) {
    yield put(loadingError(e.message));
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
  let plant;
  if (typeof action.plantCode === 'object') {
    plant = action.plantCode.value;
  } else {
    plant = action.plantCode;
  }
  try {
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/exportedstockreceipts/get-list-request-cancellation-code?plantCode=${plant}`,
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

export function* getDestroyDetail(action) {
  const { receiptCode, formik } = action;
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/cancellationrequestreceipt/get-request-cancellation-detail?receiptCode=${receiptCode}&plantCode=${
        formik.deliverCode.value
      }`,
      options,
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    const resMap = mapper.getDestroyDetail(res, formik, receiptCode);
    yield put(actions.saveDestroyItem(resMap));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getDependency(action) {
  try {
    const dependency = {};
    if (action.typePxk === constants.TYPE_PXK.PXK_XDC_FARM) {
      const [receiverUnits, units] = yield all([
        call(request, APIs.getPlant, options),
        call(request, APIs.getOrg, options),
      ]);
      dependency.receiverUnits = yield mapper.receiverUnits(receiverUnits);
      dependency.units = yield mapper.units(units.data);
    }
    if (
      [
        constants.TYPE_PXK.PXK_NOI_BO,
        constants.TYPE_PXK.PXK_XUAT_BAN,
        constants.TYPE_PXK.PXK_XUAT_HUY,
      ].includes(action.typePxk)
    ) {
      const units = yield call(request, APIs.getOrg, options);
      dependency.units = yield mapper.units(units.data);
    }
    if (action.typePxk === constants.TYPE_PXK.PXK_XUAT_BAN) {
      const [sellTypes, transporters] = yield all([
        call(request, APIs.getExportSellType, options),
        call(request, APIs.getTransporter, options),
      ]);
      if (!sellTypes.data)
        throw Object({ message: 'Không lấy được loại đơn bán hàng' });
      const sellType = find(
        sellTypes.data,
        item => item.id === action.exportSellType,
      );
      let channels = { data: [] };
      if (sellType) {
        channels = yield call(
          request,
          // `${APIs.getChannelByType}?orderTypeCode=${sellType.name}`,
          `${APIs.getChannelByType}?orderTypeCode=${sellType.code}`,
          options,
        );
      }
      dependency.sellTypes = yield sellTypes.data;
      dependency.channels = yield channels.data;
      dependency.transporters = yield transporters.data;
    }
    yield put(actions.updateReducer({ set: dependency }));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getPXKById(action) {
  try {
    yield put(setLoading(true));
    const res = yield all([
      // loại xuất kho
      call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/exportedstockreceipts/get-sub-type`,
        options,
      ),
      // chi tiết phiếu xuất kho
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
    yield getDependency({
      typePxk: res[1].data.subType,
      exportSellType: res[1].data.exportSellType,
    });
    const resMap = yield mapper.getPXKById(res);
    // if edit, call warehouse list (case add more record)
    if (action.params.form === TYPE_FORM.EDIT) {
      yield getWarehouses({ plantId: action.params.plantId });
    }

    yield put(actions.getPXKByIdSuccess(resMap));
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

export function* getInitExportSell() {
  try {
    /*
    * 1: loại xuất bán
    * 2: kênh
    * 3: Nhà vận chuyển
    */
    const res = yield all([
      call(request, APIs.getExportSellType, options),
      call(request, APIs.getChannel, options),
      call(request, APIs.getTransporter, options),
    ]);
    const resMap = mapper.mapExportSell(res);
    yield put(actions.initExportSellSuccess(resMap));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getChannelByCustomerSaga(action) {
  try {
    const res = yield call(
      request,
      `${APIs.getChannelByType}?orderTypeCode=${action.orderTypeCode}`,
      options,
    );

    if (!res.data) {
      throw Object({ message: 'Không lấy được kênh' });
    }

    yield put(actions.getChannelSuccess(res.data));
  } catch (e) {
    yield put(loadingError(e.message));
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
      ...mapper.getBasketManagerAutoSupplier(supplierRes),
      ...mapper.getBasketManagerAuto(customerRes),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getDataFromDeli(action) {
  const { plantCode, customerCode, processDate } = action.data;
  try {
    yield put(setLoading());
    const res = yield call(
      requestAuth,
      `${
        APIs.getDataFromDeli
      }?plantCode=${plantCode}&customerCode=${customerCode}&processDate=${processDate}`,
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    if (res.data.productFromDeli.length === 0)
      yield put(
        showWarning(
          'Không có thông tin chia chọn thực tế thỏa mãn điều kiện tìm kiếm',
        ),
      );
    action.callback(
      res.data.productFromDeli,
      res.data.basketFromDeli.map((item, index) => ({
        ...item,
        stt: index + 1,
      })),
    );
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getSuggestFromTurnToScale(action) {
  try {
    const {
      subType,
      deliverCode,
      customerCode,
      date,
      detailsCommands,
    } = action.payload;
    // backup schema
    yield put(
      actions.updateReducer({
        set: { initSchema: fromJS(action.payload), turnToScales: [] },
      }),
    );
    const res = yield call(
      request,
      `${APIs.getSuggestFromTurnToScale}?subtype=${subType}&deliveryCode=${
        deliverCode.value
      }&receiverCode=${customerCode}&date=${new Date(date).toISOString()}`,
      options,
    );
    // const res = {
    //   statusCode: 200,
    //   message: '',
    //   developerMessage: '',
    //   data: [
    //     {
    //       documentCode: '4900000737',
    //       locatorId: '40021000',
    //       locatorName: 'Kho nhà sơ chế',
    //       productCode: '51000128',
    //       productName: 'TP-Cà chua đỏ L1 VE',
    //       batch: '4002190828',
    //       quantity: 1,
    //       basketCode: 'K0000001',
    //       basketName: null,
    //       basketQuantity: 10,
    //     },
    //     {
    //       documentCode: '4900000737',
    //       locatorId: '40021000',
    //       locatorName: 'Kho sơ chế (QC)',
    //       productCode: '51000128',
    //       productName: 'TP-Cà tím dài L2 MT Tem',
    //       batch: '4002190828',
    //       quantity: 4,
    //       uom: 'KG',
    //       basketCode: 'K0000003',
    //       basketName: null,
    //       basketQuantity: 20,
    //     },
    //     {
    //       basketName1: '',
    //       basketName2: '',
    //       basketName3: '',
    //       basketQuantity1: null,
    //       basketQuantity2: null,
    //       basketQuantity3: null,
    //       batch: 2001190720,
    //       documentCode: '4900000737',
    //       quantity: 33,
    //       inventoryQuantity: 947,
    //       isEnterQuantity: true,
    //       label: 'Kho farm ĐR',
    //       locatorId: '20011000',
    //       locatorName: 'Kho farm ĐR',
    //       productCode: '41000061',
    //       productName: 'BTP-Cải xanh ĐR/NL VE',
    //       uom: 'KG',
    //       value: '20011000',
    //     },
    //   ],
    //   meta: {
    //     pageIndex: 0,
    //     pageSize: 0,
    //     count: 0,
    //     menu: null,
    //     accessToken: null,
    //     fullName: null,
    //     userId: null,
    //   },
    // };
    // const resMap = res.data.map(item => ({ ...item, isNotSaved: true }));
    const resMap = res.data.map(item => {
      let returnObj = { ...item };
      const turnToScale = detailsCommands.filter(i => i.isTurnToScale);
      if (turnToScale.length > 0) {
        turnToScale.forEach(k => {
          if (k.turnToScaleIds.includes(item.id)) {
            returnObj = {
              ...item,
              tableData: {
                checked: true,
              },
            };
          }
        });
      }
      return returnObj;
    });

    yield put(
      actions.updateReducer({
        set: {
          turnToScales: resMap,
        },
      }),
    );
  } catch (err) {
    yield put(loadingError(err));
  }
}

export function* getBatchAuto(action) {
  try {
    const { params, inputText, callback } = action;

    let requestURL = `${APIs.getBatchAuto}?filter=${inputText}`;

    if (params && params.locatorId) {
      requestURL += `&locatorId=${params.locatorId}`;
    }
    if (params && params.productCode) {
      requestURL += `&productCode=${params.productCode}`;
    }

    const response = yield call(
      request,
      requestURL,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (callback) {
      const data = map(response.data, o =>
        extend({ viewAutoComplete: `${o.inventoryQuantity} ${o.uom}` }, o),
      );
      callback(data);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* checkSaveSaga(action) {
  try {
    yield put(setLoading(true));
    const res = yield call(
      request,
      `${APIs.getWarningSave}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.data,
        authReq: true,
      }),
    );
    yield put(setLoading(false));
    if (action.callback) {
      action.callback(res);
    }
    // if (res.listNotOkProductExtend && res.listNotOkSalePrice) {
    //   if (action.callback) {
    //     action.callback(res);
    //   }
    // }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  yield takeLeading(constants.GET_INIT_PXK, getInitPXK); // init màn hình tạo phiếu xuất kho (loại xuất kho,đơn vị nhận hàng, đơn vị xuất hàng)
  yield takeLeading(constants.GET_WAREHOUSES, getWarehouses); // Get danh sách kho nguồn của Plant
  yield takeLeading(constants.GET_RECEIVER, getReceiver); // lấy danh sách đơn vị nhận hàng/khách hàng
  yield takeLatest(constants.GET_PRODUCTS, getProducts); // Lấy thông tin sản phẩm của phiếu xuất chuyển nội bộ
  yield takeLeading(constants.SAVE, postSavePXK); // lưu phiếu xuất bước 1 SAVE (không chuyển page)
  yield takeLeading(constants.SAVE_PXK, savePXKTable); // lưu phiếu xuất bước 2 SAVE_PXK (chuyển về danh sách)
  yield takeLatest(constants.GET_CUSTOMER, getCustomerAuto); // autocomple lấy khách hàng cho phiếu xuất bán
  yield takeLatest(constants.GET_USERS, getUsersAuto); // auto complete lấy user
  yield takeLeading(constants.GET_LIST_REQUEST_DESTROY, getListRequestDestroy); // lấy danh sách phiếu xuất hủy theo đơn vị
  yield takeLeading(constants.GET_REQUEST_DESTROY_DETAIL, getDestroyDetail);
  yield takeLeading(constants.COMPLETE_PXK, completePXK); // hoàn thành phiếu xuất COMPLETE_PXK
  yield takeLeading(constants.GET_PXK_BY_ID, getPXKById);
  yield takeLeading(constants.DELETE_ROW, deleterRow);
  yield takeLeading(constants.GET_INIT_EXPORT_SELL, getInitExportSell); // gọi các api phục vụ cho phiếu xuất bán
  yield takeLeading(constants.GET_CHANNEL, getChannelByCustomerSaga); // gọi các api phục vụ cho phiếu xuất bán
  yield takeLatest(constants.GET_BASKET_AUTO, getBasketAuto); // autocomple khay sọt
  yield takeLatest(constants.GET_BASKET_MANGAGERS, getBasketManagerAuto); // autocomple quản lý khay sọt
  yield takeLeading(constants.GET_DATA_FROM_DELI, getDataFromDeli); // get thông tin từ deli khi nhấn vào checkbox phiếu xuất bán
  yield takeLeading(
    constants.GET_SUGGEST_FROM_TURN_TO_SCALE,
    getSuggestFromTurnToScale,
  );
  yield takeLatest(constants.GET_BATCH_AUTO, getBatchAuto);
  yield takeLatest(constants.CHECK_SAVE, checkSaveSaga);
}
