import { put, call, takeLeading } from 'redux-saga/effects';

import {
  optionReq,
  checkStatus,
  requestAuth,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';

import { setLoading, showSuccess, loadingError } from 'containers/App/actions';

import { UPLOAD_FILE } from './constans';

export const CAPACITY_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;

export function* uploadFile(action) {
  try {
    yield put(setLoading());

    const { uploadingFile } = action.data || {};

    const formData = new FormData();
    formData.append('uploadingFile', uploadingFile);

    const requestURL = `${CAPACITY_URL}/inventories/upload`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: formData,
      }),
    );
    checkStatus(response);

    yield put(setLoading(false));
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLeading(UPLOAD_FILE, uploadFile);
}
