import { call, put, takeLeading } from 'redux-saga/effects';
import request, { METHOD_REQUEST, optionReq } from 'utils/request';
import { loadingError, setLoading } from 'containers/App/actions';
import * as Constants from './constants';
import * as Actions from './actions';

import { API_LINK } from '../Constants';

function* getInitPage(action) {
  try {
    yield put(setLoading());
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
    yield put(setLoading(false));
    yield put(Actions.getInitPageSuccess(response));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* watcher() {
  yield takeLeading(Constants.GET_INIT_DATA, getInitPage); // Get init supplier
}
