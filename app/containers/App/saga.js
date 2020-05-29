import { call, put, takeLeading } from 'redux-saga/effects';
import request, {
  METHOD_REQUEST,
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import { loadingError, saveMenu } from './actions';
import { GET_MENU } from './constants';

export function* getMenu() {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.AUTHORIZATION_API}/menu`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    yield put(saveMenu(res));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* appWatcher() {
  yield takeLeading(GET_MENU, getMenu);
}
