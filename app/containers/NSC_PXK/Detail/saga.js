import { put, call, takeLeading } from 'redux-saga/effects';

import { checkStatus, requestAuth, PATH_GATEWAY } from 'utils/request';

import { setLoading, loadingError } from 'containers/App/actions';

import { detailRoutine } from './routines';

export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;

/**
 * Chi tiết Phiếu xuất kho của các loại PXK khác
 */
export function* getReceiptDetail(action) {
  try {
    yield put(setLoading());

    const { id } = action.payload || {};

    const requestURL = `${BFF_SPA_URL}/exportedstockreceipts/${id}/details-common-transfer`;

    const response = yield call(requestAuth, requestURL);
    checkStatus(response);

    const payload = {
      data: response.data,
    };
    yield put(detailRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLeading(detailRoutine.REQUEST, getReceiptDetail);
}
