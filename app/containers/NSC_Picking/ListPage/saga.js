/* eslint-disable no-unused-vars */
import { all, call, put, takeLeading } from 'redux-saga/effects';

import request, {
  optionReq,
  checkStatus,
  requestAuth,
  METHOD_REQUEST,
  PATH_GATEWAY,
  responseCode,
} from '../../../utils/request';
import {
  setLoading,
  openDialog,
  showWarning,
  showSuccess,
  loadingError,
} from '../../App/actions';

import * as actions from './actions';
import * as constants from './constants';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

const APIs = {
  getFileList: `${PATH_GATEWAY.BFF_SPA_API}/pickinglist/get-picking-list-file`, //
  downloadFile: `${
    PATH_GATEWAY.BFF_SPA_API
  }/pickinglist/download-picking-list-file`, // ?id=10&fileType=1
};

export function* fetchFileListSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const queryParams = {
      processDate: formValues.processingDate
        ? formValues.processingDate.toISOString()
        : null,
      ids: null,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getFileList}?${queryStr}&pageSize=-1`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }
    yield put(actions.fetchProcessingDate(formValues));
    yield put(actions.fetchOrgListSuccess(res.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* downloadFileSaga(action) {
  try {
    yield put(setLoading());
    const { id, fileType } = action;

    const res = yield call(
      request,
      `${APIs.downloadFile}?id=${id}&fileType=${fileType}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
      makeSaveFileFunc(),
    );

    if (res.message) {
      yield put(showWarning(res.message || 'Không tải được dữ liệu'));
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_FILE_LIST, fetchFileListSaga);
  yield takeLeading(constants.DOWNLOAD_FILE, downloadFileSaga);
}
