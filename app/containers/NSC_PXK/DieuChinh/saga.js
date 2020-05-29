import {
  all,
  put,
  call,
  select,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';

import request, {
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
  closeDialog,
  showSuccess,
  showWarning,
  loadingError,
} from 'containers/App/actions';
import { makeSaveFileFunc, serializeQueryParams } from 'containers/App/utils';
import { makeSelectFormSearch } from './selectors';

import {
  masterRoutine,
  locatorRoutine,
  receiptsRoutine,
  detailsRoutine,
} from './routines';

// import { sanPhamAuto, danhSachDuLieuDieuChinh } from './data';
// import { danhSachPhieu } from './Popup/data';

import { transformDetails, transformReverseDetails } from './utils';

import {
  OPEN_POPUP,
  CHECK_BLOCK,
  MODIFY_AUTO,
  GET_PRODUCT_AUTO,
  SIGNALR_PROCESSING,
  GET_FARM_SUPPLIER_AUTO,
  GET_DELI_DATA,
  EXPORT_EXCEL,
} from './constants';

const auth = localstoreUtilites.getAuthFromLocalStorage();

const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const AUTHORIZATION_URL = PATH_GATEWAY.AUTHORIZATION_API;
const RESOURCEPLANNING_URL = PATH_GATEWAY.RESOURCEPLANNING_API;

export function getReceiptsQuery({
  totalCount, // bỏ qua
  plantName, // bỏ qua
  locatorCode, // bỏ qua
  locatorName, // bỏ qua
  ...params
}) {
  return serializeQueryParams({
    ...params,
    processDate: params.processDate ? params.processDate.toISOString() : '',
  });
}

export function getDetailsQuery({
  plantName, // bỏ qua
  receiverName, // bỏ qua
  farmSupplierName, // bỏ qua
  ...params
}) {
  return serializeQueryParams({
    ...params,
    processDate: params.processDate ? params.processDate.toISOString() : '',
  });
}

export function* getInitMaster(action) {
  try {
    yield put(setLoading());

    const { callback } = action.payload || {};

    const requestURL = `${AUTHORIZATION_URL}/organizations/get-by-user?userId=${
      auth.meta.userId
    }`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const organization =
      response.data && response.data.length > 0 ? response.data[0] : {};

    const payload = {
      formSearch: {
        plantCode: organization.value || '',
        plantName: organization.name || '',
      },
      organizations: response.data,
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

export function* getLocator(action) {
  try {
    yield put(setLoading());

    const {
      params: { plantCode },
    } = action.payload || {};

    const requestURL = `${BFF_SPA_URL}/modification-data-deli/get-pickinglist-sloc?plantCode=${plantCode}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      locatorCode: response.data.locatorCode,
      locatorName: response.data.description,
    };

    yield put(locatorRoutine.success(payload));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getReceipts(action) {
  try {
    yield put(setLoading());

    const { params } = action.payload || {};

    const queryParams = getReceiptsQuery(params);
    const requestURL = `${BFF_SPA_URL}/modification-data-deli?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    // const response = {
    //   data: { danhSachDuLieuDieuChinh },
    //   meta: {
    //     count: 5,
    //   },
    // };

    const payload = {
      isAllowModify: response.data.isAllowModify,
      data: response.data.modificationDataDeliDtos,
      total: {
        pickingQuantity: response.data.pickingTotalQuantitty,
        deliveryQuantity: response.data.deliveryTotalQuantity,
        differentQuantity: response.data.differentTotalQuantitty,
      },
      formSearch: {
        ...params,
        totalCount: response.meta.count,
      },
    };
    yield put(receiptsRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* exportExcel() {
  try {
    yield put(setLoading());
    let formSubmittedValues = yield select(makeSelectFormSearch());
    formSubmittedValues = formSubmittedValues.toJS();
    console.log(formSubmittedValues);
    // Mapping keys to match server params
    const queryParams = {
      plantCode: formSubmittedValues.plantCode,
      processDate: formSubmittedValues.processDate.toISOString(),
      productCode: formSubmittedValues.productCode,
      productName: formSubmittedValues.productName,
      differentFrom: formSubmittedValues.differentFrom,
      differentTo: formSubmittedValues.differentTo,
      farmSupplierCode: formSubmittedValues.farmSupplierCode,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${BFF_SPA_URL}/modification-data-deli/export?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
      makeSaveFileFunc(),
    );

    if (response.status !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getDetails(action) {
  try {
    yield put(setLoading());

    const { params } = action.payload || {};

    const queryParams = getDetailsQuery(params);
    const requestURL = `${BFF_SPA_URL}/modification-data-deli/get-fix-modification-deli?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    // const response = {
    //   data: danhSachPhieu,
    // };

    const payload = {
      data: transformDetails([response.data]),
    };
    yield put(detailsRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* performUpdate(action) {
  try {
    yield put(setLoading());

    const { data, callback } = action.payload || {};

    const requestURL = `${BFF_SPA_URL}/modification-data-deli/fix-modification-deli`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: transformReverseDetails(data)[0],
      }),
    );
    checkStatus(response);

    if (callback) {
      callback();
    }

    yield put(closeDialog());
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* openPopup(action) {
  const { params } = action;

  yield put(openDialog());
  yield put(detailsRoutine.request({ params }));
}

export function* checkBlock(action) {
  try {
    yield put(setLoading());

    const { params } = action;

    const queryParams = getReceiptsQuery(params);
    const requestURL = `${BFF_SPA_URL}/modification-data-deli/validate-sale-price?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    if (!response.data) {
      throw Object({ message: response.message });
    }

    if (!response.data.isNeedValidate) {
      yield put(showSuccess(response.message));
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* modifyAuto(action) {
  try {
    yield put(setLoading());

    const { params, callback } = action;

    const requestURL = `${BFF_SPA_URL}/modification-data-deli/auto-modification-deli`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: params,
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

export function* getProductAuto(action) {
  try {
    const { inputText, callback } = action;

    const requestURL = `${RESOURCEPLANNING_URL}/products/auto-complete?search=${inputText}`;

    const response = yield call(requestAuth, requestURL);
    // const response = sanPhamAuto;

    if (response && response.length >= 0) {
      callback(response);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getFarmSupplierAuto(action) {
  try {
    const { inputText, callback } = action;

    const [plantsResponse, suppliersResponse] = yield all([
      call(
        requestAuth,
        `${RESOURCEPLANNING_URL}/plants?pageSize=100&search=${inputText}`,
      ),
      call(
        requestAuth,
        `${RESOURCEPLANNING_URL}/suppliers?pageSize=100&search=${inputText}`,
      ),
    ]);

    if (
      plantsResponse &&
      suppliersResponse &&
      Array.isArray(plantsResponse.data) &&
      Array.isArray(suppliersResponse.data)
    ) {
      const payload = [
        ...plantsResponse.data.map(data => ({
          name: data.plantName,
          value: data.plantCode,
        })),
        ...suppliersResponse.data.map(data => ({
          name: data.name1,
          value: data.supplierCode,
        })),
      ];
      callback(payload);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* signalRProcessing(action) {
  try {
    const { requestId, response } = action;

    if (response && response.meta.requestId === requestId) {
      yield put(showWarning(response.message));
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getDeliDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const body = {
      processDate: formValues.processDate
        ? formValues.processDate.toISOString()
        : null,
      plant: formValues.plantCode,
    };

    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/modification-receipt/sync-processhouse`,
      optionReq({ method: 'PUT', body, authReq: true }),
    );

    if (res.statusCode !== 200) {
      yield put(loadingError(res.message));
    } else {
      yield put(showSuccess(res.message));
      yield put({
        type: receiptsRoutine.REQUEST,
        payload: { params: formValues },
      });
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLatest(OPEN_POPUP, openPopup);

  yield takeLeading(CHECK_BLOCK, checkBlock);
  yield takeLeading(MODIFY_AUTO, modifyAuto);

  yield takeLatest(GET_PRODUCT_AUTO, getProductAuto);
  yield takeLatest(GET_FARM_SUPPLIER_AUTO, getFarmSupplierAuto);

  yield takeLeading(SIGNALR_PROCESSING, signalRProcessing);

  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(locatorRoutine.REQUEST, getLocator);
  yield takeLeading(receiptsRoutine.REQUEST, getReceipts);

  yield takeLeading(detailsRoutine.REQUEST, getDetails);
  yield takeLeading(detailsRoutine.EDITING_REQUEST, performUpdate);
  yield takeLeading(EXPORT_EXCEL, exportExcel);
  yield takeLeading(GET_DELI_DATA, getDeliDataSaga);
}
