import { call, takeLeading, put } from 'redux-saga/effects';
import { showSuccess, loadingError, setLoading } from 'containers/App/actions';
import request, {
  METHOD_REQUEST,
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import { SYNCHRONIZE, SYNCHRONIZE_TRANSACTION } from './constants';

function* synchronizeSaga(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      typeof action.path === 'string' ? `${action.path}` : action.path[0],
      optionReq({
        method: METHOD_REQUEST.POST,
        body: null,
        authReq: true,
      }),
    );

    let second = {};
    if (res.statusCode === responseCode.ok && typeof action.path !== 'string') {
      second = yield call(
        request,
        action.path[1],
        optionReq({
          method: METHOD_REQUEST.POST,
          body: null,
          authReq: true,
        }),
      );
    }
    const res2nd = { ...{ statusCode: responseCode.ok }, ...second };

    if (
      res.statusCode !== responseCode.ok ||
      res2nd.statusCode !== responseCode.ok
    ) {
      throw Object({ message: res.message });
    }

    yield put(setLoading(false));
    yield put(showSuccess(res.message));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* synchronizeTransactionSaga() {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/sap-synchronize`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: null,
        authReq: true,
      }),
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    yield put(setLoading(false));
    yield put(showSuccess(res.message));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* githubData() {
  yield takeLeading(SYNCHRONIZE, synchronizeSaga);
  yield takeLeading(SYNCHRONIZE_TRANSACTION, synchronizeTransactionSaga);
}
