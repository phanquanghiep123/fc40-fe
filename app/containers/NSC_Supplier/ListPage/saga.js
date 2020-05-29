import { call, put, takeLeading } from 'redux-saga/effects';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, {
  PATH_GATEWAY,
  optionReq,
  METHOD_REQUEST,
} from '../../../utils/request';
import { serializeQueryParams } from '../../App/utils';
import { addRowIndexToArray } from '../../../utils';

const APIs = {
  getTableData: `${PATH_GATEWAY.RESOURCEPLANNING_API}/master-data-suppliers`,
  deleteRecord: `${PATH_GATEWAY.RESOURCEPLANNING_API}/master-data-suppliers`, // /{id}
};

export function* fetchFormDataSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    yield put(actions.submitForm(formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  const { formValues } = action;

  try {
    yield put(setLoading());

    const {
      supplierCode,
      supplierName,
      supplierType,
      email,
      contractCode,
      contractType,
      source,
      Block,
      regionCode,
    } = formValues;

    // Mapping keys to match server params
    const queryParams = {
      code: supplierCode,
      name: supplierName,
      type: (supplierType !== '0' && supplierType) || '',
      email,
      contractCode,
      contractType,
      source: (source !== '0' && source) || '',
      regionCode: (regionCode !== '0' && regionCode) || '',
      block: (Block !== '0' && Block) || '',
      pageSize: 0,
    };

    const queryStr = serializeQueryParams(queryParams);

    const response = yield call(
      request,
      `${APIs.getTableData}?${queryStr}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        authReq: true,
      }),
    );
    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin nhà cung cấp' });
    }

    yield put(
      actions.submitFormSuccess(formValues, addRowIndexToArray(response.data)),
    );
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* deleteRecordSaga(action) {
  try {
    yield put(setLoading());

    const response = yield call(
      request,
      `${APIs.deleteRecord}/${action.recordId}`,
      optionReq({
        method: METHOD_REQUEST.DELETE,
        authReq: true,
      }),
    );

    if (response.statusCode && response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xóa bản ghi này',
      });
    }

    yield put(showSuccess(response.message || 'Đã xóa thành công'));
    yield put(actions.deleteRecordSuccess(action.recordId));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* SupplierListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
}
