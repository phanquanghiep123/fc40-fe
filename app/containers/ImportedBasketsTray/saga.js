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
  responseCode,
  requestAuth,
  // METHOD_REQUEST,
} from 'utils/request';
import {
  // getSAVWithDefault,
  // getSAVWithJoin,
  getSAVWithoutJoin,
  makeSaveFileFunc,
  serializeQueryParams,
} from 'containers/App/utils';
import * as groupAuthorize from 'authorize/groupAuthorize';
import { localstoreUtilites } from 'utils/persistenceData';
// import { formDataSchema } from './FormSection/formats';
import { startOfDay } from 'date-fns';
import * as constants from './constants';
import * as actions from './actions';

import { formDataSchema } from './FormSection/formats';
// import * as selectors from './selectors';

export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getApprover: `${
    PATH_GATEWAY.BFF_SPA_API
  }/user/get-by-privilege?privilegeCode=${groupAuthorize.CODE.xemApproverList}`,
  getTableData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/import-stock-receipts-basket/simple`,
  getPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants?pageSize=100`,
  getSuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=100`,
  getCustomer: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-distinct?pageSize=100`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/status`,
  exportExcel: `${
    PATH_GATEWAY.BFF_SPA_API
  }/import-stock-receipts-basket/export-excel`,
  exportPdf: `${PATH_GATEWAY.BFF_SPA_API}/import-stock-receipts-basket/print`,
  deleteRecord: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket`, // ?retailId={id}
  getTypeBaskets: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/import-type`,
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
    const [orgRes, typeRes, users, basketsResponse, typeBasketsRes] = yield all(
      [
        call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
        // call(request, `${APIs.getStatus}`, GETOption),
        call(request, `${APIs.getStatus}`, GETOption),
        call(request, `${APIs.getUsers}`, GETOption),
        call(
          requestAuth,
          `${MASTER_URL}/pallet-baskets?pageSize=-1&sortDirection=asc`,
        ),
        call(request, `${APIs.getTypeBaskets}`, GETOption),
      ],
    );

    // List đơn vị
    if (
      orgRes.statusCode !== responseCode.ok ||
      !orgRes.data ||
      orgRes.data.length < 1
    ) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }

    formData.org = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
      type: item.organizationType,
    }));
    formData.orgCodes = orgRes.data.map(item => item.value).join(',');
    // if (typeRes.data.length > 1) {
    //   const allItem = [
    //     {
    //       id: 0,
    //       name: 'Tất cả',
    //     },
    //   ];
    //   typeRes.data = allItem.concat(typeRes.data);
    // }
    formData.status = typeRes.data.map(item => ({
      label: item.name,
      value: item.id,
    }));
    formData.users = users.data.map(item => ({
      value: item.id,
      label: `${item.lastName} ${item.firstName}`,
    }));
    formData.filterBasket = basketsResponse.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} - ${item.shortName}`,
      palletWeight: item.netWeight,
    }));
    formData.importType = typeBasketsRes.data.map(item => ({
      label: item.name,
      value: item.id,
    }));
    formData.isSubmit = true;
    formValues.status = formData.status[0] || 0;
    formValues.orgCodes = formData.orgCodes;
    formValues.receiver = formData.org.length === 1 ? formData.org[0] : '';

    yield submitFormSaga({ formValues });
    yield put(actions.getFormDataSuccess(formData));
    // yield put(actions.submitForm(formValues));
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
      importedDateFrom: FromDate ? startOfDay(FromDate).toISOString() : '',
      importedDateTo: ToDate ? startOfDay(ToDate).toISOString() : '',
      basketDocumentCode: formValues.basketDocumentCode,
      importType:
        formValues.importType !== null
          ? formValues.importType.map(item => item.value).join(',')
          : '',
      userId: getSAVWithoutJoin(formValues.userId),
      filterBasket: getSAVWithoutJoin(formValues.filterBasket),
      doCode: formValues.doCode,
      sort: formValues.sort,
      deliverCode: getSAVWithoutJoin(formValues.deliver),
      receiverCode: getSAVWithoutJoin(formValues.receiver),
      status: getSAVWithoutJoin(formValues.status),
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      orgCodes: formValues.orgCodes,
      deliverType: formValues.deliverType,
    };

    const queryStr = serializeQueryParams(queryParams);
    const requestApi = `${APIs.getTableData}?${queryStr}`;
    const response = yield call(request, requestApi, GETOption);
    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin kho' });
    }
    formValues.totalItem = response.meta.count;
    yield put(actions.submitFormSuccess(formValues, response.data));
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
      throw Object({ message: 'Chưa có phiếu PNKS nào được chọn.' });
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

export function* deleteRecordSaga(action) {
  try {
    yield put(setLoading());
    if (typeof action.id === 'undefined') {
      throw Object({ message: 'Chưa lấy được Mã PNKS để xóa' });
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

export function* fetchDeliveryOrgSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [farmRes, supplierRes, customerRes] = yield all([
      call(request, `${APIs.getPlants}&search=${inputValue}`, GETOption),
      call(request, `${APIs.getSuppliers}&search=${inputValue}`, GETOption),
      call(request, `${APIs.getCustomer}&filter=${inputValue}`, GETOption),
    ]);

    if (!farmRes.data || !supplierRes.data || !customerRes.data) {
      throw Object({ message: 'Không lấy được thông tin đơn vị giao hàng' });
    }

    const fieldData = [
      ...farmRes.data.map(item => ({
        value: item.plantCode,
        deliverType: 1,
        label: `${item.plantCode} ${item.plantName}`,
      })),
      ...supplierRes.data.map(item => ({
        value: item.supplierCode,
        deliverType: 2,
        label: `${item.supplierCode} ${item.name1}`,
      })),
      ...customerRes.data.map(item => ({
        value: item.customerCode,
        deliverType: 3,
        label: `${item.customerCode} ${item.customerName}`,
      })),
    ];

    yield callback(fieldData);
    yield put(actions.fetchDeliveryOrgSuccess(fieldData));
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
      importedDateFrom: FromDate ? startOfDay(FromDate).toISOString() : '',
      importedDateTo: ToDate ? startOfDay(ToDate).toISOString() : '',
      basketDocumentCode: formValues.basketDocumentCode,
      importType:
        formValues.importType !== null
          ? formValues.importType.map(item => item.value).join(',')
          : '',
      userId: getSAVWithoutJoin(formValues.userId),
      filterBasket: getSAVWithoutJoin(formValues.filterBasket),
      doCode: formValues.doCode,
      sort: formValues.sort,
      deliverCode: getSAVWithoutJoin(formValues.deliver),
      receiverCode: getSAVWithoutJoin(formValues.receiver),
      status: getSAVWithoutJoin(formValues.status),
      orgCodes: formValues.orgCodes,
      deliverType: formValues.deliverType,
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

export function* changeOrderSaga(action) {
  const { formValues, sort } = action;
  try {
    formValues.sort = sort;
    yield put(actions.submitForm(formValues));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* transferOwnershipSaga() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLatest(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLatest(constants.EXPORT_PDF, exportPdfSaga);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLatest(constants.FETCH_DELIVERY_ORG, fetchDeliveryOrgSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
}
