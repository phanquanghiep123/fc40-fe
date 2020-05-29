import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import startOfDay from 'date-fns/startOfDay';

import {
  optionReq,
  requestAuth,
  checkStatus,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';
import { localstoreUtilites } from 'utils/persistenceData';

import { serializeQueryParams } from 'containers/App/utils';
import { setLoading, showSuccess, loadingError } from 'containers/App/actions';

import {
  masterRoutine,
  bbgnhhRoutine,
  leadtimeRoutine,
  exportReceiptsRoutine,
  deliveryStocksRoutine,
} from './routines';
import {
  transformDeliveryStocks,
  transformDeliveryPerson,
  transformDeliveryReceipt,
} from './utils';

import {
  TYPE_BBGNHH,
  GET_ROUTE_AUTO,
  GET_SHIPPER_AUTO,
  GET_CUSTOMER_AUTO,
  GET_EXPORT_RECEIPT_AUTO,
  GET_DELIVERY_PERSON_AUTO,
} from './constants';

// Thông tin user đăng nhập
const auth = localstoreUtilites.getAuthFromLocalStorage();

// Đường dẫn Gateway
const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const AUTHORIZATION_URL = PATH_GATEWAY.AUTHORIZATION_API;
const CAPACITYCONTROL_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;
const RESOURCEPLANNING_URL = PATH_GATEWAY.RESOURCEPLANNING_API;

export function getExportReceiptsQuery({
  totalCount, // bỏ qua
  ...params
}) {
  return serializeQueryParams({
    ...params,
    deliveryDate: params.deliveryDate
      ? startOfDay(new Date(params.deliveryDate)).toISOString()
      : '',
  });
}

// Init màn hình
export function* getInitMaster() {
  try {
    yield put(setLoading());

    const [
      initialResponse,
      organizationsResponse,
      vehicleRoutesResponse,
    ] = yield all([
      // Init dữ liệu
      call(requestAuth, `${BFF_SPA_URL}/delivery-receipt/create-screen`),

      // Đơn vị
      call(
        requestAuth,
        `${AUTHORIZATION_URL}/organizations/get-by-user?userId=${
          auth.meta.userId
        }`,
      ),

      // Loại xe tuyến
      call(requestAuth, `${CAPACITYCONTROL_URL}/deliveryorders/vehicle-route`),
    ]);

    if (!initialResponse) {
      throw Error('Không lấy được dữ liệu khởi tạo màn hình');
    }
    if (!organizationsResponse.data || !organizationsResponse.data.length) {
      throw Error('Không lấy được danh sách Farm/NSC');
    }
    if (!vehicleRoutesResponse.data || !vehicleRoutesResponse.data.length) {
      throw Error('Không lấy được danh sách Xe tuyến');
    }

    const payload = {
      initialSchema: {
        deliverCode: {
          value: organizationsResponse.data[0].value,
          label: organizationsResponse.data[0].name,
        },
        // deliverCode: organizationsResponse.data[0].value,
        deliverCode1: organizationsResponse.data[0].value,
        deliverName: organizationsResponse.data[0].name,
        creatorCode: auth.meta.userId,
        creatorName: auth.meta.fullName,
        creatorPhone: auth.meta.phoneNumber,
        deliveryPersonCode: auth.meta.userId,
        deliveryPersonName: auth.meta.fullName,
        deliveryPersonPhone: auth.meta.phoneNumber,
      },
      shippers: initialResponse.shippers,
      organizations: organizationsResponse.data.map(item => ({
        ...item,
        label: item.name,
      })),
      vehicleRoutes: vehicleRoutesResponse.data,
      vehiclePallets: initialResponse.vehiclePallets,
      vehicleCleanings: initialResponse.vehicleCleanings,
      shippingLeadtime: initialResponse.shippingLeadtime,
      temperatureStatus: initialResponse.temperatureStatus,
      delivertReceiptTypes: initialResponse.delivertReceiptTypes,
      chipTemperatureStatus: initialResponse.chipTemperatureStatus,
      shippingLeadtimeReasons: initialResponse.shippingLeadtimeReasons,
      shippingLeadtimeExportReasons:
        initialResponse.shippingLeadtimeExportReasons,
    };
    yield put(masterRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get Leadtime theo Bên giao hàng và Khách hàng
export function* getLeadtime(action) {
  try {
    yield put(setLoading());

    const { deliverCode, customerCode } = action.payload || {};

    const requestURL = `${RESOURCEPLANNING_URL}/regulated-shipping-leadtime?deliveryCode=${deliverCode}&receiveCode=${customerCode}&pageSize=-1
    `;

    const response = yield call(requestAuth, requestURL);
    // checkStatus(response);

    if (!response || !response.data) {
      throw Error('Không lấy được danh sách leadtime');
    }

    // const response = {
    //   data: unregulatedLeadtime,
    // };

    const payload = {
      data: response.data,
    };
    yield put(leadtimeRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get danh sách Phiếu xuất kho
export function* getExportReceipts(action) {
  const deliverCode = action.payload.params.deliverCode.value;
  const data = {
    ...action.payload.params,
    deliverCode,
  };
  try {
    yield put(setLoading());

    // const { params } = data || {};

    const queryParams = getExportReceiptsQuery(data || {});
    const requestURL = `${BFF_SPA_URL}/exportedstockreceipts/for-delivery-receipt?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    // const response = {
    //   data: exportReceipts,
    //   meta: {
    //     count: exportReceipts.length,
    //   },
    // };

    const payload = {
      data: response.data,
      formSearch: {
        ...data,
        totalCount: response.meta.count,
      },
    };

    yield put(exportReceiptsRoutine.success(payload));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get danh sách hàng hóa theo Phiếu xuất kho
export function* getDeliveryStocks(action) {
  try {
    yield put(setLoading());

    const { exportReceiptCodes, callback } = action.payload || {};
    if (exportReceiptCodes) {
      const requestURL = `${BFF_SPA_URL}/exportedstockreceipts/detail-for-delivery-receipt?stockExportReceiptCodes=${exportReceiptCodes}`;

      const response = yield call(requestAuth, requestURL);
      checkStatus(response);
      // const response = {
      //   data: deliveryReceiptStocks,
      // };
      if (callback) {
        callback(transformDeliveryStocks(response.data || {}));
      }
    } else if (callback) {
      callback(transformDeliveryStocks({}));
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get auto complete cho Lái xe
export function* getShipperAuto(action) {
  try {
    const { inputText, callback } = action;

    const requestURL = `${CAPACITYCONTROL_URL}/deliveryOrders/shipper/auto-complete?search=${inputText}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    if (response.data && response.data.length >= 0) {
      callback(response.data);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get auto complete cho Phiếu xuất kho
export function* getExportReceiptAuto(action) {
  try {
    const { deliverCode, deliveryDate, inputText, callback } = action;

    const params = {
      term: inputText,
      deliverCode: deliverCode.value,
      deliveryDate,
    };
    const queryParams = getExportReceiptsQuery(params);
    const requestURL = `${BFF_SPA_URL}/exportedstockreceipts/autocomplete-for-delivery-receipt?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    // const response = {
    //   data: exportReceipts,
    // };

    if (response.data && response.data.length >= 0) {
      callback(response.data);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get auto complete cho Đại diện giao hàng
export function* getDeliveryPersonAuto(action) {
  try {
    const { plantCode, inputText, callback } = action;

    const requestURL = `${BFF_SPA_URL}/user/get-by-org?orgId=${
      plantCode.value
    }&filterName=${inputText}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    if (response.data && response.data.length >= 0) {
      callback(transformDeliveryPerson(response.data));
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get auto complete cho Khách hàng
export function* getCustomerAuto(action) {
  try {
    const { inputText, callback } = action;

    const requestURL = `${RESOURCEPLANNING_URL}/customer/autocomplete-distinct?filter=${inputText}`;

    const response = yield call(requestAuth, requestURL);
    // checkStatus(response);

    if (response.data && response.data.length >= 0) {
      callback(response.data);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Get auto complete cho Tuyến đường
export function* getRouteAuto(action) {
  try {
    const { inputText, callback } = action;

    const requestURL = `${CAPACITYCONTROL_URL}/delivery-receipt/routes?term=${inputText}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    // const response = {
    //   data: routes,
    // };

    if (response.data && response.data.length >= 0) {
      callback(response.data);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Tạo BBGNHH
export function* performCreateBBGNHH(action) {
  try {
    yield put(setLoading());

    const { data } = action.payload || {};
    data.deliverCode = data.deliverCode.value;
    const requestURL =
      data.deliveryReceiptType !== TYPE_BBGNHH.ICD
        ? `${CAPACITYCONTROL_URL}/delivery-receipt`
        : `${CAPACITYCONTROL_URL}/delivery-receipt/icd`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: transformDeliveryReceipt(data),
      }),
    );
    checkStatus(response);

    yield put(push('/danh-sach-bien-ban-giao-nhan-hang-hoa'));
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Xóa hóa hàng
export function* performRemoveStock(action) {
  try {
    yield put(setLoading());

    const { shipToCode, stockIds, callback } = action.payload || {};

    const requestURL = `${CAPACITYCONTROL_URL}/delivery-receipt-stock/icd/${shipToCode}`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.DELETE,
        body: { deliveryReceiptStocks: stockIds },
      }),
    );
    checkStatus(response);

    if (callback) {
      callback();
    }

    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLatest(GET_ROUTE_AUTO, getRouteAuto);
  yield takeLatest(GET_SHIPPER_AUTO, getShipperAuto);
  yield takeLatest(GET_CUSTOMER_AUTO, getCustomerAuto);

  yield takeLatest(GET_EXPORT_RECEIPT_AUTO, getExportReceiptAuto);
  yield takeLatest(GET_DELIVERY_PERSON_AUTO, getDeliveryPersonAuto);

  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(leadtimeRoutine.REQUEST, getLeadtime);

  yield takeLeading(exportReceiptsRoutine.REQUEST, getExportReceipts);
  yield takeLeading(deliveryStocksRoutine.REQUEST, getDeliveryStocks);

  yield takeLeading(bbgnhhRoutine.REQUEST, performCreateBBGNHH);
  yield takeLeading(bbgnhhRoutine.EDITING_REQUEST, performRemoveStock);
}
