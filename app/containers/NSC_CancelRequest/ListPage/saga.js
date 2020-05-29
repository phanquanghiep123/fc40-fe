/* eslint-disable indent */
import { all, call, put, takeLeading, takeLatest } from 'redux-saga/effects';
import { localstoreUtilites } from '../../../utils/persistenceData';
import request, {
  checkStatus,
  optionReq,
  PATH_GATEWAY,
} from '../../../utils/request';
import {
  setLoading,
  loadingError,
  showSuccess,
  showWarning,
} from '../../App/actions';
import * as groupAuthorize from '../../../authorize/groupAuthorize';
import * as actions from './actions';
import * as constants from './constants';
import {
  getNested,
  makeSaveFileFunc,
  serializeQueryParams,
} from '../../App/utils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  deleteRecordProduct: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/request-cancellation-status?isIncludeAll=true`,
  getReceiptType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/cancellation-receipt-type?includeAll=true`,
  getReason: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/get-cancellation-receipt-reason?includeAll=true`, // Api get Reason List
  getApprover: `${
    PATH_GATEWAY.BFF_SPA_API
  }/user/get-by-privileges?privilegeCodes=${groupAuthorize.CODE.pheDuyetYCH},${
    groupAuthorize.CODE.pheDuyetYCHKS
  }`,
  getCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/list-request-cancellation`,
  printCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/print`,
  getRequesters: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getPalletBaskets: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/pallet-baskets/get-autocomplete-pallet-basket`, // ?palletBasketKey=
  deleteRecordBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/baskets`, // DELETE /{id},
  exportExcel: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/export-excel`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    const statusWaiting = 1; // @todo: fixed code
    let updatedFormValues = null;

    if (fetchNew) {
      const GETOption = optionReq({
        method: 'GET',
        authReq: true,
      });

      const [
        orgRes,
        statusRes,
        receiptTypeRes,
        reasonRes,
        approverRes,
      ] = yield all([
        call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
        call(request, APIs.getStatus, GETOption),
        call(request, APIs.getReceiptType, GETOption),
        call(request, APIs.getReason, GETOption),
        call(request, APIs.getApprover, GETOption),
      ]);

      if (orgRes.statusCode !== 200 || !orgRes.data || !orgRes.data.length) {
        yield put(
          showWarning(orgRes.message || 'Không lấy được danh sách đơn vị'),
        );
      }

      if (
        statusRes.statusCode !== 200 ||
        !statusRes.data ||
        !statusRes.data.length
      ) {
        yield put(
          showWarning(
            statusRes.message || 'Không lấy được danh sách trạng thái.',
          ),
        );
      }

      if (
        receiptTypeRes.statusCode !== 200 ||
        !receiptTypeRes.data ||
        !receiptTypeRes.data.length
      ) {
        yield put(
          showWarning(
            receiptTypeRes.message || 'Không lấy được danh sách loại phiếu.',
          ),
        );
      }

      if (
        reasonRes.statusCode !== 200 ||
        !reasonRes.data ||
        !reasonRes.data.length
      ) {
        yield put(
          showWarning(
            reasonRes.message || 'Không lấy được danh sách lý do huỷ.',
          ),
        );
      }

      if (
        approverRes.statusCode !== 200 ||
        !approverRes.data ||
        !approverRes.data.length
      ) {
        yield put(
          showWarning(
            approverRes.message || 'Không lấy được danh sách Người Phê Duyệt.',
          ),
        );
      }

      // Map data
      const formData = {
        org: orgRes.data
          ? [
              // ...(orgRes.data.length > 1
              //   ? [
              //       {
              //         value: 0,
              //         label: 'Tất cả',
              //       },
              //     ]
              //   : []),
              ...orgRes.data.map(item => ({
                value: item.value,
                label: item.name,
                type: item.organizationType,
              })),
            ]
          : [],
        status: statusRes.data.map(item => ({
          value: item.id,
          label: item.name,
          description: item.description,
        })),
        receiptType: receiptTypeRes.data.map(item => ({
          value: item.id,
          label: item.name,
        })),
        reason: reasonRes.data.map(item => ({
          value: item.id,
          label: item.name,
          description: item.description,
          receiptType: item.receiptType,
        })),
        approver: approverRes.data.map(item => ({
          value: item.Id,
          label: `${item.lastName} ${item.firstName}`,
          phone: item.phoneNumber,
          email: item.email,
        })),
      };
      updatedFormValues = {
        ...formValues,
        // org: formData.org[1] ? formData.org[1].value : formData.org[0].value,
        // org: {
        //   label: formData.org[0].label,
        //   value: formData.org[0].value,
        //   type: formData.org[0].type,
        // },
        status: formData.status.filter(item => item.value === statusWaiting)
          .length
          ? statusWaiting
          : formData.status[0].value || '',
        receiptType: formData.receiptType.length
          ? formData.receiptType[0].value
          : '',
        reason: formData.reason.length ? formData.reason[0].value : '',
      };
      // yield put(actions.submitForm(updatedFormValues || formValues));
      yield submitFormSaga({ values: updatedFormValues || formValues });
      yield put(actions.fetchFormDataSuccess(formData));
    } else {
      // yield put(actions.submitForm(updatedFormValues || formValues));
      yield submitFormSaga({ values: updatedFormValues || formValues });
    }
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* submitFormSaga(action) {
  try {
    yield put(setLoading());
    const { values } = action;

    const sortKeyMapping = {
      receiptCode: 'receiptCode',
      status: 'status',
      plantCode: 'plantCode',
      created_date: 'receiptDate',
      causeOfCancellation: 'reasonCode',
      receiptType: 'requestType',
    };
    const sortKey = sortKeyMapping[values.sortKey] || '';
    const sortType =
      sortKey && values.sortType && values.sortType.toLowerCase() === 'desc'
        ? '-'
        : '';

    const sort = `${sortType}${sortKey}`;
    const queryParams = {
      receiptCode: values.receiptCode,
      supervisor: getNested(values, 'approver', 'value'), // người phê duyệt
      creator: getNested(values, 'requester', 'value'), // người tạo phiếu
      exporter: getNested(values, 'executor', 'value'), // người xuất huỷ
      status: values.status,
      // basketCode: getNested(values, 'basketCode', 'value'),
      // productCode: values.productCode,
      receiptType: values.receiptType, // Loại phiếu
      reasonCode: values.reason,
      productBasketCode: values.goodCode, // mã hàng hoá
      // plantCode: values.org !== 0 ? values.org.value : null,
      plantCode: values.org && values.org.value,
      createdDateFrom: values.requestDateFrom
        ? values.requestDateFrom.toISOString()
        : null,
      createdDateTo: values.requestDateTo
        ? values.requestDateTo.toISOString()
        : null,
      approvedDateFrom: values.approveDateFrom
        ? values.approveDateFrom.toISOString()
        : null,
      approvedDateTo: values.approveDateTo
        ? values.approveDateTo.toISOString()
        : null,
      exportCancellationDateFrom: values.executeDateFrom
        ? values.executeDateFrom.toISOString()
        : null,
      exportCancellationDateTo: values.executeDateTo
        ? values.executeDateTo.toISOString()
        : null,

      pageSize: values.pageSize,
      pageIndex: values.pageIndex,
      sort,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getCancelRequest}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được danh sách Phiếu Yêu Cầu Huỷ.',
      });
    }

    if (values.pageIndex > 0 && res.data && res.data.length === 0) {
      values.pageIndex = 0;
      yield submitFormSaga(action);
      return;
    }

    const tableData = res.data.map(item => ({
      id: item.id,
      receiptCode: item.receiptCode,
      status: item.status,
      causeOfCancellation: item.causeOfCancellation,
      org: item.plantName,
      plantCode: item.plantCode,
      approverLevel1: item.approverLevel1,
      approverLevel2: item.approverLevel2,
      approverLevel3: item.approverLevel3,
      approverLevelName1: item.approverLevelName1,
      approverLevelName2: item.approverLevelName2,
      approverLevelName3: item.approverLevelName3,
      requester: item.requester,
      created_date: item.receiptDate,
      approve_level: item.level,
      level: item.level,
      isVisible: item.isVisible,
      isApproved: item.isApproved,
      isDeleteVisible: item.isDeleteVisible,
      isEditVisible: item.isEditVisible,
      isLabelVisible: item.isLabelVisible,
      isBasket: item.isBasket,
      receiptType: item.receiptType,
    }));

    values.count = res.meta.count;

    yield put(actions.formSubmitSuccess(values, tableData));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* deleteRecordSaga(action) {
  try {
    yield put(setLoading());
    const { id, isBasket } = action;

    if (typeof id === 'undefined') {
      throw Object({ message: 'Chưa lấy được Mã PYCH để xóa' });
    }

    if (typeof isBasket === 'undefined') {
      throw Object({ message: 'Chưa xác định được loại phiếu để xóa' });
    }

    const response = yield call(
      request,
      `${isBasket ? APIs.deleteRecordBasket : APIs.deleteRecordProduct}/${id}`,
      optionReq({ method: 'DELETE', authReq: true }),
    );

    if (response.statusCode !== 200) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi xóa' });
    }

    yield put(showSuccess(response.message || 'Xóa thành công.'));
    yield put(actions.recordDeleted(id, isBasket));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* printSelectedSaga(action) {
  try {
    yield put(setLoading());
    if (!action.selectedRecords || action.selectedRecords.length <= 0) {
      throw Object({ message: 'Chưa có Phiếu Yêu Cầu Huỷ nào được chọn.' });
    }
    const ids = action.selectedRecords.map(record => record.id).join('&ids=');
    const response = yield call(
      request,
      `${APIs.printCancelRequest}?ids=${ids}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (response.statusCode !== 200 || !response.data) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi in.' });
    }

    yield action.callback(response.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* fetchBasketACSaga(action) {
  try {
    const { inputText, callback } = action.payload;

    const res = yield call(
      request,
      `${APIs.getPalletBaskets}?palletBasketKey=${inputText}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (!res.data) {
      throw Object({ message: res.message || 'Có lỗi xảy ra khi tìm kiếm' });
    }

    const mappedData = res.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} ${item.shortName}`,
    }));

    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* fetchRequesterACSaga(action) {
  try {
    const { inputText, callback } = action.payload;
    const res = yield call(
      request,
      `${APIs.getRequesters}&filterName=${inputText}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Có lỗi xảy ra khi tìm kiếm' });
    }

    const mappedData = res.data.map(item => ({
      value: item.id,
      label: `${item.lastName} ${item.firstName}`,
    }));

    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* fetchApproverACSaga(action) {
  try {
    const { inputText, callback } = action.payload;
    const res = yield call(
      request,
      `${APIs.getApprover}&filterName=${inputText}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Có lỗi xảy ra khi tìm kiếm' });
    }

    const mappedData = res.data.map(item => ({
      value: item.Id,
      label: `${item.lastName} ${item.firstName}`,
    }));

    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* exportExcelSaga(action) {
  try {
    yield put(setLoading());
    const { filters } = action.payload;

    const queryParams = {
      receiptCode: filters.receiptCode,
      supervisor: getNested(filters, 'approver', 'value'), // người phê duyệt
      creator: getNested(filters, 'requester', 'value'), // người tạo phiếu
      exporter: getNested(filters, 'executor', 'value'), // người xuất huỷ
      status: filters.status,
      // basketCode: getNested(filters, 'basketCode', 'value'),
      // productCode: filters.productCode,
      receiptType: filters.receiptType, // Loại phiếu
      reasonCode: filters.reason,
      productBasketCode: filters.goodCode, // mã hàng hoá
      // plantCode: filters.org !== 0 ? filters.org.value : null,
      plantCode: filters.org && filters.org.value,
      createdDateFrom: filters.requestDateFrom
        ? filters.requestDateFrom.toISOString()
        : null,
      createdDateTo: filters.requestDateTo
        ? filters.requestDateTo.toISOString()
        : null,
      approvedDateFrom: filters.approveDateFrom
        ? filters.approveDateFrom.toISOString()
        : null,
      approvedDateTo: filters.approveDateTo
        ? filters.approveDateTo.toISOString()
        : null,
      exportCancellationDateFrom: filters.executeDateFrom
        ? filters.executeDateFrom.toISOString()
        : null,
      exportCancellationDateTo: filters.executeDateTo
        ? filters.executeDateTo.toISOString()
        : null,

      pageSize: -1,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
      makeSaveFileFunc(),
    );

    yield checkStatus(res);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
  yield takeLatest(constants.FETCH_BASKET_AC, fetchBasketACSaga);
  yield takeLatest(constants.FETCH_REQUESTER_AC, fetchRequesterACSaga);
  yield takeLatest(constants.FETCH_APPROVER_AC, fetchApproverACSaga);
  yield takeLatest(constants.FETCH_EXECUTOR_AC, fetchRequesterACSaga); // same source as requester
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
}
