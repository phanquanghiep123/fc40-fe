import { all, put, call, takeLatest, takeLeading } from 'redux-saga/effects';

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

import { masterRoutine, receiptsRoutine, productsRoutine } from './routines';

import {
  transformPlants,
  transformReceipts,
  transformProducts,
  transformSuppliers,
  transformOrganizations,
  transformDifferentTypes,
  transformReverseProducts,
} from './utils';

import { OPEN_POPUP, GET_DELIVER_AUTO } from './constants';

export const auth = localstoreUtilites.getAuthFromLocalStorage();

export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
export const AUTHORIZATION_URL = PATH_GATEWAY.AUTHORIZATION_API;
export const RESOURCEPLANNING_URL = PATH_GATEWAY.RESOURCEPLANNING_API;

export function getReceiptsQuery({
  totalCount, // bỏ qua
  deliverOrgCodeName, // bỏ qua
  ...params
}) {
  return serializeQueryParams({
    ...params,
    dateTo: params.dateTo ? params.dateTo.toISOString() : '',
    dateFrom: params.dateFrom ? params.dateFrom.toISOString() : '',
  });
}

export function* getInitMaster(action) {
  try {
    yield put(setLoading());

    const { callback } = action.payload || {};

    const [organizationsResponse, differentTypesResponse] = yield all([
      call(
        requestAuth,
        `${AUTHORIZATION_URL}/organizations/get-by-user?userId=${
          auth.meta.userId
        }`,
      ),
      call(
        requestAuth,
        `${BFF_SPA_URL}/modification-receipt/get-different-types`,
      ),
    ]);
    checkStatus(organizationsResponse);
    checkStatus(differentTypesResponse);

    const payload = {
      organizations: transformOrganizations(organizationsResponse.data),
      differentTypes: transformDifferentTypes(differentTypesResponse.data),
      orgCodes: organizationsResponse.data
        ? organizationsResponse.data.map(org => org.value).join(',')
        : '',
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

export function* getReceipts(action) {
  try {
    yield put(setLoading());

    const { params, callback } = action.payload || {};
    const { pageSize, pageIndex } = params;

    const queryParams = getReceiptsQuery(params);
    const requestURL = `${BFF_SPA_URL}/modification-receipt?${queryParams}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: transformReceipts(response.data),
    };
    const pagination = {
      pageSize,
      pageIndex,
      totalCount: response.meta.count,
    };

    yield put(receiptsRoutine.success(payload));

    if (callback) {
      callback(pagination);
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getProducts(action) {
  try {
    yield put(setLoading());

    const {
      params: { documentId },
    } = action.payload || {};

    const requestURL = `${BFF_SPA_URL}/modification-receipt/get-modification-receipt-detail-new?documentImportCode=${documentId}`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: transformProducts(response.data),
      documentId,
    };
    yield put(productsRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* exportReceipts(action) {
  try {
    yield put(setLoading());

    const { params } = action.payload || {};

    const queryParams = getReceiptsQuery(params);
    const requestURL = `${BFF_SPA_URL}/modification-receipt/export?${queryParams}`;

    const response = yield call(
      requestAuth,
      requestURL,
      null,
      makeSaveFileFunc(),
    );
    checkStatus(response);

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getDeliverAuto(action) {
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
      plantsResponse.data &&
      suppliersResponse.data
    ) {
      const payload = [
        ...transformPlants(plantsResponse.data),
        ...transformSuppliers(suppliersResponse.data),
      ];
      callback(payload);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* performUpdate(action) {
  try {
    yield put(setLoading());

    const { data, callback } = action.payload || {};

    const requestURL = `${BFF_SPA_URL}/modification-receipt/update-modification-receipt-detail-new`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: transformReverseProducts(data),
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

export function* openPopupSaga(action) {
  const { documentId } = action;
  const params = {
    documentId,
  };

  yield put(productsRoutine.request({ params }));
  yield put(openDialog());
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLatest(OPEN_POPUP, openPopupSaga);
  yield takeLatest(GET_DELIVER_AUTO, getDeliverAuto);

  yield takeLeading(masterRoutine.REQUEST, getInitMaster);
  yield takeLeading(receiptsRoutine.REQUEST, getReceipts);
  yield takeLeading(productsRoutine.REQUEST, getProducts);

  yield takeLeading(productsRoutine.EDITING_REQUEST, performUpdate);
  yield takeLeading(receiptsRoutine.EDITING_REQUEST, exportReceipts);
}
