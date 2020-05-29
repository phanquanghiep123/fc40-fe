import {
  call,
  put,
  takeLeading,
  takeLatest,
  all,
  // select,
} from 'redux-saga/effects';

import { loadingError, setLoading, showSuccess } from 'containers/App/actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  // responseCode,
  // requestAuth,
  // METHOD_REQUEST,
  // tempRequest,
} from 'utils/request';
import {
  // getSAVWithDefault,
  // getSAVWithJoin,
  getSAVWithoutJoin,
  makeSaveFileFunc,
  serializeQueryParams,
} from 'containers/App/utils';
// import * as groupAuthorize from 'authorize/groupAuthorize';
import { localstoreUtilites } from 'utils/persistenceData';
// import { startOfDay } from 'date-fns';
import { startOfDay } from 'date-fns';
import * as constants from './constants';
import * as actions from './actions';
import { formDataSchema } from './FormSection/format';

export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  // getTypeKK: `${}`
  getStocktakingType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/stocktaking-type`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/status`,
  getAfterStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/after-status`,
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/basket-stocktaking/simple`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/basket-stocktaking/export-excel`,
  exportPdf: `${PATH_GATEWAY.BFF_SPA_API}/basket-stocktaking/print`,
  deleteRecord: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking`, // ?retailId={id}
};

const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const formData = { ...formDataSchema };
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [orgRes, users, typeKK, status, afterStatus] = yield all([
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      // call(request, `${APIs.getStatus}`, GETOption),
      call(request, `${APIs.getUsers}`, GETOption),
      call(request, `${APIs.getStocktakingType}`, GETOption),
      call(request, APIs.getStatus, GETOption),
      call(request, APIs.getAfterStatus, GETOption),
    ]);

    formData.unitKK = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
      type: item.organizationType,
    }));
    formData.unitKKCodes = orgRes.data.map(item => item.value).join(',');
    formData.users = users.data.map(item => ({
      value: item.id,
      label: `${item.lastName} ${item.firstName}`,
    }));
    formData.typeKK = typeKK.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    formData.status = status.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    formData.afterStatus = afterStatus.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    yield put(actions.getFormDataSuccess(formData));

    formValues.unitKK = formData.unitKK.length === 1 ? formData.unitKK : '';
    formValues.unitKKCodes = formData.unitKKCodes;
    yield put(actions.submitForm(formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  const { formValues } = action;
  const GETOption = optionReq({
    method: 'GET',
    authReq: true,
  });
  try {
    yield put(setLoading());
    const { FromDate, ToDate } = formValues;
    const queryParams = {
      stocktakingDateFrom: FromDate ? startOfDay(FromDate).toISOString() : '',
      stocktakingDateTo: ToDate ? startOfDay(ToDate).toISOString() : '',
      basketStockTakingCode: formValues.basketStockTakingCode,
      status: getSAVWithoutJoin(formValues.status),
      afterStatus: getSAVWithoutJoin(formValues.afterStatus),
      stocktakingType: getSAVWithoutJoin(formValues.typeKK)
        ? getSAVWithoutJoin(formValues.typeKK)
        : '',
      stocktakingRound: formValues.stageKK,
      delegateId: getSAVWithoutJoin(formValues.userId),
      plantCode: formValues.unitKK
        ? formValues.unitKK.map(item => item.value).join(',')
        : '',
      orgCodes: formValues.unitKKCodes,
      basketDocumentCode: formValues.basketDocumentCode,
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      sort: formValues.sort,
    };
    const queryStr = serializeQueryParams(queryParams);
    const requestApi = `${APIs.getTableData}?${queryStr}`;
    const response = yield call(request, requestApi, GETOption);
    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin BBKK' });
    }
    formValues.totalItem = response.meta.count;
    yield put(actions.submitFormSuccess(formValues, response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcel(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const { FromDate, ToDate } = formValues;
    const queryParams = {
      stocktakingDateFrom: FromDate ? startOfDay(FromDate).toISOString() : '',
      stocktakingDateTo: ToDate ? startOfDay(ToDate).toISOString() : '',
      basketStockTakingCode: formValues.basketStockTakingCode,
      status: getSAVWithoutJoin(formValues.status),
      afterStatus: getSAVWithoutJoin(formValues.afterStatus),
      stocktakingType: getSAVWithoutJoin(formValues.typeKK)
        ? getSAVWithoutJoin(formValues.typeKK)
        : '',
      stocktakingRound: formValues.stageKK,
      delegateId: getSAVWithoutJoin(formValues.userId),
      plantCode: formValues.unitKK
        ? formValues.unitKK.map(item => item.value).join(',')
        : '',
      orgCodes: formValues.unitKKCodes,
      basketDocumentCode: formValues.basketDocumentCode,
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      sort: formValues.sort,
    };

    const queryStr = serializeQueryParams(queryParams);

    const response = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
      makeSaveFileFunc(),
    );

    if (response.status !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportPdfSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    if (formValues.ids.length <= 0) {
      throw Object({ message: 'Chưa có mã BBKK nào được chọn.' });
    }
    const queryParams = { ids: formValues.ids.join(','), isRePrint: false };
    const queryStr = serializeQueryParams(queryParams);
    const requestApi = `${APIs.exportPdf}?${queryStr}`;
    const response = yield call(request, requestApi, GETOption);

    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }
    const wnd = window.open('', '', '_blank');
    if (wnd === null)
      throw Object({
        message:
          'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
      });
    wnd.document.write(response.data);

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* changeOrderSaga(action) {
  const { formValues, sort } = action;
  try {
    formValues.sort = sort;
    yield put(actions.submitForm(formValues));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* deleteRecordSaga(action) {
  try {
    yield put(setLoading());
    if (typeof action.id === 'undefined') {
      throw Object({ message: 'Chưa lấy được Mã BBKK để xóa' });
    }
    const response = yield call(
      request,
      `${APIs.deleteRecord}/${action.id}`,
      optionReq({
        method: 'DELETE',
        authReq: true,
      }),
    );

    // const response = true;
    if (response.statusCode !== 200) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi xóa' });
    }

    yield put(showSuccess(response.message || 'Xóa thành công.'));
    yield put(actions.deleteRecordSuccess(action.id));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* transferOwnershipSaga() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLatest(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLatest(constants.EXPORT_PDF, exportPdfSaga);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
}
