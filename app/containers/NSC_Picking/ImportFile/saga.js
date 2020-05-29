import { call, put, takeLeading } from 'redux-saga/effects';
import request, { PATH_GATEWAY, optionReq } from '../../../utils/request';
import {
  setLoading,
  loadingError,
  showSuccess,
  showWarning,
} from '../../App/actions';
import { makeSaveFileFunc } from '../../App/utils';

import * as actions from './actions';
import * as constants from './constants';

const APIs = {
  submitFile: `${PATH_GATEWAY.BFF_SPA_API}/pickinglist/import-picking-list`, // ?userId={id}
  downloadFile: `${
    PATH_GATEWAY.BFF_SPA_API
  }/pickinglist/download-picking-list-file`, // ?id=10&fileType=1
};

export function* submitFileSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const mappedValues = {
      uploadingFile: formValues.fileData,
    };

    const formData = new FormData();
    Object.keys(mappedValues).forEach(key => {
      formData.append(key, mappedValues[key]);
    });
    formData.append('test', 'something here');

    const res = yield call(
      request,
      APIs.submitFile,
      optionReq({
        method: 'POST',
        body: formData,
        authReq: true,
      }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Tải lên không thành công' });
    }

    if (res.data.errorRecord && res.data.errorRecord > 0) {
      yield put(showWarning('Dữ liệu file tải lên có lỗi'));
    } else {
      yield put(showSuccess(res.message || 'Tải lên thành công'));
    }

    const fileInfo = {
      id: res.data.id,
      fileName: res.data.fileName,
      fileErrorName: res.data.fileErrorName,
      importTime: res.data.importTime,
      startTime: res.data.startTime,
      endTime: res.data.endTime,
      totalRecord: res.data.totalRecord,
      totalInsert: res.data.totalInsert,
      errorRecord: res.data.errorRecord,
      processingOrg: res.data.processingHouses,
    };

    yield put(actions.submitFileSuccess(fileInfo));
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
  yield takeLeading(constants.SUBMIT_FILE, submitFileSaga);
  yield takeLeading(constants.DOWNLOAD_FILE, downloadFileSaga);
}
