import { takeLeading, put, call } from 'redux-saga/effects';
import request, {
  checkStatus,
  PATH_GATEWAY,
  METHOD_REQUEST,
  optionReq,
  responseCode,
} from 'utils/request';

import * as Constants from '../constants';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import { makeSaveFileFunc } from '../../App/utils';

import { masterRoutine } from '../routine';

const auth = localstoreUtilites.getAuthFromLocalStorage();
const APIs = {
  getPlants: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user?userId=${auth.meta.userId}`,
  postFile: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/import-approved-price-list`,
  downloadFileError: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/download-import-approved-price-error-file`,
  downloadFileSample: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/download-import-approved-price-sample-file`,
};

export function* getInitMaster(action) {
  try {
    yield put(setLoading());

    const { callback } = action.payload || {};
    const getOptionReq = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });

    const response = yield call(request, APIs.getPlants, getOptionReq);
    checkStatus(response);

    const payload = {
      plants: response.data,
    };
    yield put(masterRoutine.success(payload));

    if (callback) {
      callback();
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* uploadFile(action) {
  try {
    yield put(setLoading());

    const { uploadingFile, plantCode, requestId } = action.data || {};

    const formData = new FormData();
    formData.append('requestId', requestId);
    formData.append('Plant', plantCode);
    formData.append('UploadingFile', uploadingFile);

    const response = yield call(
      request,
      APIs.postFile,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: formData,
      }),
    );
    checkStatus(response);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

function* submitFormSignalR(action) {
  try {
    const { res } = action;
    if (res.statusCode !== responseCode.ok) {
      yield call(
        request,
        APIs.downloadFileError,
        optionReq({
          method: METHOD_REQUEST.POST,
          body: res.data,
          authReq: true,
        }),
        makeSaveFileFunc(),
      );
      throw Object({
        message: res.message || 'Import dữ liệu không thành công.',
      });
    }
    yield action.callback();
    yield put(setLoading(false));
    yield put(showSuccess(res.message || 'Import dữ liệu thành công.'));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* signalrProcessing(action) {
  try {
    const { res } = action;
    if (!res.data) {
      throw Object({
        message: res.message || 'Import dữ liệu không thành công.',
      });
    }
    yield put(showSuccess(res.message || 'Import dữ liệu thành công.'));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* downloadSampleFile(action) {
  try {
    const { res } = action;
    yield put(setLoading(true));
    yield call(
      request,
      APIs.downloadFileSample,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: res,
        authReq: true,
      }),
      makeSaveFileFunc(),
    );
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* sagaWatchers() {
  yield takeLeading(Constants.FETCH_MASTER_DATA_REQUEST, getInitMaster);
  yield takeLeading(Constants.UPLOAD_FILE_APPROVED_PRICE, uploadFile);
  yield takeLeading(Constants.SUBMIT_FILE_SIGNALR, submitFormSignalR);
  yield takeLeading(Constants.SIGNALR_PROCESSING, signalrProcessing);
  yield takeLeading(Constants.DOWNLOAD_SAMPLE_FILE, downloadSampleFile);
}
