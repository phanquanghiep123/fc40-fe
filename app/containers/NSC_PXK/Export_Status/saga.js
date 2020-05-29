import { all, call, put, takeLeading } from 'redux-saga/effects';
import { localstoreUtilites } from '../../../utils/persistenceData';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from '../../../utils/request';
import { setLoading, loadingError } from '../../App/actions';
import * as groupAuthorize from '../../../authorize/groupAuthorize';
import * as actions from './actions';
import * as constants from './constants';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getApprover: `${
    PATH_GATEWAY.BFF_SPA_API
  }/user/get-by-privilege?privilegeCode=${groupAuthorize.CODE.xemApproverList}`,
  getCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/list-request-cancellation`,
  getCustomerAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/customer/autocomplete`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga() {
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [orgRes] = yield all([
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
    ]);

    if (orgRes.statusCode !== responseCode.ok || !orgRes.data) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }

    if (orgRes.data.length < 1) {
      throw Object({
        message: 'Không lấy được danh sách đơn vị',
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
    const defaultOrg = orgList.length > 1 ? orgList[1] : orgList[0];

    yield put(actions.fetchOrgListSuccess(orgList, defaultOrg));

    const queryParams = {
      org: !defaultOrg ? null : defaultOrg.value,
    };

    yield put(actions.submitForm(queryParams));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* submitFormSaga(action) {
  try {
    yield put(setLoading());

    const queryParams = {
      receiptCode: !action.values.receiptCode
        ? null
        : action.values.receiptCode,
      supervisor: !action.values.approver ? null : action.values.approver.value,
      status: !`${action.values.status}` ? null : `${action.values.status}`,
      reasonCode: !`${action.values.reason}` ? null : action.values.reason,
      plantCode: action.values.org ? action.values.org : null,
    };

    // Serialize params to query string
    const queryStr = Object.keys(queryParams)
      .filter(
        key =>
          typeof queryParams[key] !== 'undefined' &&
          queryParams[key] !== null &&
          queryParams[key] !== '',
      )
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    const response = yield call(
      request,
      `${APIs.getCancelRequest}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (response.statusCode !== responseCode.ok || !response.data) {
      throw Object({
        message:
          response.message || 'Không lấy được danh sách Báo Cáo Chia Hàng.',
      });
    }
    const cancelRequestList = response.data.map(item => ({
      id: item.id,
      receiptCode: item.receiptCode,
      status: item.status,
      causeOfCancellation: item.causeOfCancellation,
      org: item.plantName,
      plantCode: item.plantCode,
      approverLevel1: item.approverLevel1,
      approverLevel2: item.approverLevel2,
      approverLevelName1: item.approverLevelName1,
      approverLevelName2: item.approverLevelName2,
      requesterName: item.requesterName,
      created_date: item.receiptDate,
      approve_level: item.level,
      level: item.level,
      isVisible: item.isVisible,
      isApproved: item.isApproved,
      isEditDeleteVisible: item.isEditDeleteVisible,
      isLabelVisible: item.isLabelVisible,
    }));
    yield put(actions.formSubmitSuccess(action.values, cancelRequestList));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchCustomerSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const customerRes = yield call(
      request,
      `${APIs.getCustomerAuto}?filter=${inputValue}`,
      GETOption,
    );

    const fieldData = [
      ...customerRes.map(item => ({
        value: item.customerCode,
        label: item.customerName,
      })),
    ];

    yield callback(fieldData);
    // yield put(actions.fetchCustomerSuccess(fieldData));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchGoodsSaga(action) {
  console.log('[action]', action);

  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const customerRes = yield call(
      request,
      `${APIs.getCustomerAuto}?filter=${inputValue}`,
      GETOption,
    );

    console.log('[customerRes]', customerRes);

    const fieldData = [
      ...customerRes.map(item => ({
        value: item.customerCode,
        label: item.customerName,
      })),
    ];

    yield callback(fieldData);
    // yield put(actions.fetchCustomerSuccess(fieldData));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_CUSTOMER, fetchCustomerSaga);
  yield takeLeading(constants.FETCH_GOODS, fetchGoodsSaga);
}
