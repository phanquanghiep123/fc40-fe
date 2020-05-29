import { all, call, put, takeLeading } from 'redux-saga/effects';
import { showSuccess, loadingError, setLoading } from 'containers/App/actions';
import request, {
  METHOD_REQUEST,
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import {
  SUBMIT_FORM,
  GET_IMPORTED_STOCK_BY_ID,
  PRINT_IMPORTED_STOCK,
} from './constants';
import { updateDetail, completeSuccess } from './actions';

function* submitForm(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/importedstockreceipts/complete`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.completeInfo,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
    yield put(showSuccess(res.message));
    yield put(completeSuccess());
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getImportedStockById(action) {
  try {
    yield put(setLoading());
    const [generalInfo, details] = yield all([
      call(
        request,
        `${PATH_GATEWAY.BFF_SPA_API}/importedstockreceipts/${action.id}`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${PATH_GATEWAY.BFF_SPA_API}/importedstockreceipts/${
          action.id
        }/details`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
    ]);
    if (generalInfo.statusCode && generalInfo.statusCode !== responseCode.ok) {
      throw Object({ message: generalInfo.message });
    }
    if (details.statusCode && details.statusCode !== responseCode.ok) {
      yield put(updateDetail(generalInfo.data, []));
      throw Object({ message: details.message });
    }
    yield put(updateDetail(generalInfo.data, details.data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* printImportedStock(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/ImportedStockReceipts/print?ids=${
        action.id
      }`,

      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    action.callback(res.data);
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* ImportedStockReceiptDetailWatcher() {
  yield takeLeading(GET_IMPORTED_STOCK_BY_ID, getImportedStockById);
  yield takeLeading(PRINT_IMPORTED_STOCK, printImportedStock);
  yield takeLeading(SUBMIT_FORM, submitForm);
}
