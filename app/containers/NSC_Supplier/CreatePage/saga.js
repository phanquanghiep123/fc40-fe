import { call, put, takeLeading } from 'redux-saga/effects';
import request, {
  METHOD_REQUEST,
  optionReq,
  responseCode,
} from 'utils/request';
import { loadingError, setLoading, showSuccess } from 'containers/App/actions';
import * as Constants from './constants';
import * as Actions from './actions';

import { API_LINK } from '../Constants';

function* getInitPage(action) {
  try {
    let response = {};
    if (action.itemId) {
      response = yield call(
        request,
        `${API_LINK.GET_BY_ID}/${action.itemId}`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      );
    }

    if (response.data) {
      throw Object({ message: response.message });
    }
    yield put(Actions.getInitPageSuccess(response));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* submitForm(action) {
  try {
    yield put(setLoading());
    const body = action.form;

    if (!body.contractSigningDate) body.contractSigningDate = '';
    if (!body.contractEffectiveDate) body.contractEffectiveDate = '';
    body.postingBlock = body.postingBlock ? 'X' : '';
    body.purchBlock = body.purchBlock ? 'X' : '';
    body.isDeleted = body.isDeleted ? '1' : '0';

    let link = API_LINK.CREATE_ITEM;
    let method = METHOD_REQUEST.POST;

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!body.id) {
      link = `${API_LINK.UPDATE_ITEM}/${body.id}`;
      method = METHOD_REQUEST.PUT;
    }

    const res = yield call(
      request,
      link,
      optionReq({
        method,
        body,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    const { supplierCode } = res;
    const message =
      body.id > 0
        ? `Câp nhật NCC ${supplierCode} thành công`
        : `Tạo mới NCC ${supplierCode} thành công`;
    yield put(setLoading(false));
    yield put(showSuccess(res.message || message));
    yield put(action.callback());
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* watcher() {
  yield takeLeading(Constants.GET_INIT_DATA, getInitPage); // Get init supplier
  yield takeLeading(Constants.SUBMIT_FORM, submitForm); // Submit form
}
