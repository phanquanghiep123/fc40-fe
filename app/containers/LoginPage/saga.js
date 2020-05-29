import { call, put, takeLeading } from 'redux-saga/effects';

import { localstoreUtilites } from 'utils/persistenceData';

import { loadingError } from '../App/actions';
import { SUBMIT_LOGIN } from './constants';
import { loginSuccess } from './actions';
import request, {
  optionReq,
  METHOD_REQUEST,
  PATH_GATEWAY,
} from '../../utils/request';

export function* submitLogin(action) {
  try {
    // Call our request helper (see 'utils/request')
    const loginRes = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/Account/login`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.login,
        authReq: false,
      }),
    );

    if (!loginRes.accessToken) {
      throw Object({ message: loginRes.message });
    }

    // save token to localStorage
    yield localstoreUtilites.saveToLocalStorage(loginRes);
    yield put(loginSuccess(loginRes));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  yield takeLeading(SUBMIT_LOGIN, submitLogin);
}
