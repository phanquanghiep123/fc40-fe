import { takeLeading, call, put } from 'redux-saga/effects';
import request, {
  PATH_GATEWAY,
  optionReq,
  METHOD_REQUEST,
  responseCode,
} from 'utils/request';
import { resetSuccess } from './actions';
import { SUBMIT } from './constants';
import { loadingError, setLoading } from '../App/actions';
function* resetPassword(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${PATH_GATEWAY.AUTHENTICATION_API}/account/reset-new-password`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.form,
        authReq: false,
      }),
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    yield put(resetSuccess());
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
export default function* sagaWatcher() {
  yield takeLeading(SUBMIT, resetPassword);
}
