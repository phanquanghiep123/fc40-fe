import { takeLeading, put, all, call } from 'redux-saga/effects';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
  METHOD_REQUEST,
} from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { formDataSchema } from './FormSection/formats';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';
import * as groupAuthorize from '../../../authorize/groupAuthorize';
const APIs = {
  getTableData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exported-retail-request/list-detail-retail-request`,
  getApprover: `${
    PATH_GATEWAY.BFF_SPA_API
  }/user/get-by-privilege?privilegeCode=${groupAuthorize.CODE.xemApproverList}`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exported-retail-request/retail-request-status`,
  getReason: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/get-cancellation-receipt-reason?includeAll=true`, // Api get Reason List
  getCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/list-request-cancellation`,
  printCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/print`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  deleteRecord: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exported-retail-request`, // ?retailId={id}
  exportExcel: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exported-retail-request/export-excel`,
  exportPdf: `${PATH_GATEWAY.BFF_SPA_API}/exported-retail-request/export-pdf`,
  approvePBX: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exported-retail-request/approve-retail-request`,
  unApprovePBX: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exported-retail-request/reapprove-retail-request
  `,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();
let Uesapprover = null;

const getQueryParams = formValues => {
  const {
    deliveryCode,
    status,
    retailCode,
    ApproverLevel,
    pageSize,
    pageIndex,
    orgList,
  } = formValues;

  return {
    status: status > 0 ? status : '',
    exportedRetailRequestCode: retailCode,
    approverLevel: ApproverLevel ? ApproverLevel.value : '',
    deliveryCode: (deliveryCode && deliveryCode !== '0' && deliveryCode) || '',
    pageSize,
    pageIndex,
    strPlant: orgList.join(','),
  };
};

export function* fetchFormDataSaga(action) {
  const { formValues } = action;
  yield put(setLoading());
  try {
    const formData = { ...formDataSchema };
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    const [statusRes, approverRes, orgRes] = yield all([
      call(request, APIs.getStatus, GETOption),
      call(request, APIs.getApprover, GETOption),
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
    ]);

    // List trạng thái
    if (
      statusRes.statusCode !== responseCode.ok ||
      !statusRes.data ||
      statusRes.data.length < 1
    ) {
      throw Object({
        message: statusRes.message || 'Không lấy được danh sách trạng thái.',
      });
    }

    const status = statusRes.data;
    formData.status = status.map(item => ({
      value: item.id,
      label: item.name,
      description: item.description,
    }));

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

    if (orgRes.data.length > 1) {
      const allItem = [
        {
          value: 0,
          name: 'Tất cả',
        },
      ];
      orgRes.data = allItem.concat(orgRes.data);
    }

    const orgList = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
      type: item.organizationType,
    }));
    formData.deliveryCode = orgList;

    // set formDefaultValues
    formValues.deliveryCode = formData.deliveryCode[0].value || 0;

    // List người phê duyệt
    if (
      approverRes.statusCode !== responseCode.ok ||
      !approverRes.data ||
      approverRes.data.length < 1
    ) {
      throw Object({
        message:
          approverRes.message || 'Không lấy được danh sách Người Phê Duyệt.',
      });
    }

    Uesapprover = approverRes.data;
    formData.Approver = Uesapprover.map(item => ({
      value: item.Id,
      label: `${item.lastName} ${item.firstName}`,
      phone: item.phoneNumber,
      email: item.email,
    }));
    formData.Approver.forEach(item => {
      if (item.value === auth.meta.userId) {
        formValues.ApproverLevel = item;
      }
    });

    formValues.orgList = orgList
      .filter(item => item.value > 0)
      .map(item => item.value);
    formData.isSubmit = true;
    yield put(actions.getFormDataSuccess(formData));
  } catch (e) {
    yield put(loadingError(e.message));
  }

  yield put(actions.submitForm(formValues));
  yield put(setLoading(false));
}

export function* submitFormSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    // Mapping keys to match server params
    const queryParams = getQueryParams(formValues);
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getTableData}?${queryStr}&sort=${formValues.sort.join('&sort=')}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        authReq: true,
      }),
    );

    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin phiếu cân nhập kho' });
    }
    formValues.totalItem = response.meta.count;
    formValues.pageIndex = 0;
    yield put(actions.submitFormSuccess(formValues, response.data));
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

    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xóa bản ghi này',
      });
    }

    yield put(showSuccess(response.message || 'Đã xóa thành công'));
    yield put(actions.deleteRecordSuccess(action.recordId));
    const { formValues } = action;
    yield put(actions.pagingInit(formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* pagingInitSaga(action) {
  yield put(setLoading(true));
  const { submittedValues } = action;
  const queryParams = getQueryParams(submittedValues);
  const queryStr = serializeQueryParams(queryParams);
  const response = yield call(
    request,
    `${APIs.getTableData}?${queryStr}&sort=${submittedValues.sort.join(
      '&sort=',
    )}`,
    optionReq({
      method: 'GET',
      authReq: true,
    }),
  );
  if (response.statusCode !== 200) {
    yield put(
      loadingError(response.message || 'Có lỗi xảy ra vui lòng thử lại'),
    );
  } else {
    yield put(actions.pagingSuccess(response.data));
    yield put(setLoading(false));
  }
}

export function* exportExcel(action) {
  try {
    yield put(setLoading());
    const { formSubmittedValues } = action;
    const queryParams = getQueryParams(formSubmittedValues);
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}&sort=${formSubmittedValues.sort.join(
        '&sort=',
      )}`,
      optionReq({
        method: METHOD_REQUEST.GET,
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
export function* exportPdf(action) {
  try {
    yield put(setLoading());

    const { formSubmittedValues } = action;

    if (formSubmittedValues.ids.length <= 0) {
      throw Object({ message: 'Chưa có phiếu yêu cầu bán xá nào được chọn.' });
    }

    // Mapping keys to match server params
    const queryParams = {
      ids: formSubmittedValues.ids.join(','),
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.exportPdf}?${queryStr}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        authReq: true,
      }),
    );

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
  const { submittedValues } = action;
  try {
    yield put(setLoading());
    yield put(actions.pagingInit(submittedValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}
export function* approvelItem(action) {
  const { item, submittedValues } = action;
  yield put(setLoading());
  try {
    const URL = item.status === 1 ? APIs.approvePBX : APIs.unApprovePBX;
    const Data1 = {
      id: item.id,
      isAgreement: true,
      note: '',
    };
    const Data2 = item;
    const response = yield call(
      request,
      `${URL}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        authReq: true,
        body: item.status === 1 ? Data1 : Data2,
      }),
    );
    if (response.statusCode !== 200) {
      yield put(
        loadingError(response.message || 'Có lỗi xảy ra vui lòng thử lại'),
      );
    } else {
      yield put(showSuccess(response.message || 'Thông tin đã được cập nhật.'));
      yield put(actions.submitForm(submittedValues));
    }
  } catch (e) {
    yield put(setLoading(false));
  }
  yield put(setLoading(false));
}
export default function* RetailListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.EXPORT_PDF, exportPdf);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLeading(constants.PAGING_INIT, pagingInitSaga);
  yield takeLeading(constants.APPROVEL_ITEM, approvelItem);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
}
