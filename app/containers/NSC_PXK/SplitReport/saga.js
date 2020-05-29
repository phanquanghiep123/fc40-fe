import { all, call, put, takeLeading } from 'redux-saga/effects';
import { startOfDay } from 'date-fns';
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
import { serializeQueryParams } from '../../App/utils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getApprover: `${
    PATH_GATEWAY.BFF_SPA_API
  }/user/get-by-privilege?privilegeCode=${groupAuthorize.CODE.xemApproverList}`,
  getSplitReport: `${
    PATH_GATEWAY.BFF_SPA_API
  }/product-allocation/get-report-export-product`,
  getCustomerAuto: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-not-block`,
  getPlanAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/products/auto-complete`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga(action) {
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
      processDate: action.formValues.processDate || null,
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
      processorCode: !action.values.org ? null : action.values.org,
      productName: !action.values.productName
        ? null
        : action.values.productName,
      processDate: !action.values.processDate
        ? null
        : startOfDay(action.values.processDate).toISOString(),
      customerCode: !action.values.customer
        ? null
        : action.values.customer.value,
      planningCode: !action.values.planningCode
        ? null
        : action.values.planningCode.value,
    };
    const queryStr = serializeQueryParams(queryParams);
    const resSplit = yield call(
      request,
      `${APIs.getSplitReport}?${queryStr}&pageSize=-1`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (resSplit.statusCode !== responseCode.ok || !resSplit.data) {
      throw Object({
        message:
          resSplit.message || 'Không lấy được danh sách Báo Cáo Chia Hàng.',
      });
    }
    const totalValue = {
      differentRatio: 0,
      realQuantity: 0,
      differentQuantity: 0,
      planedPickingQuantity: 0,
    };
    if (resSplit.data.length > 0) {
      resSplit.data.forEach(item => {
        totalValue.differentRatio += item.differentRatio;
        totalValue.realQuantity += item.realQuantity;
        totalValue.differentQuantity += item.differentQuantity;
        totalValue.planedPickingQuantity += item.planedPickingQuantity;
      });
    }
    const decimalTotal = {
      differentRatio: Math.round(totalValue.differentRatio * 1000) / 1000,
      realQuantity: Math.round(totalValue.realQuantity * 1000) / 1000,
      differentQuantity: Math.round(totalValue.differentQuantity * 1000) / 1000,
      planedPickingQuantity:
        Math.round(totalValue.planedPickingQuantity * 1000) / 1000,
    };

    yield put(
      actions.formSubmitSuccess(action.values, resSplit.data, decimalTotal),
    );
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
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchPlanSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const planRes = yield call(
      request,
      `${APIs.getPlanAuto}?search=${inputValue}`,
      GETOption,
    );

    const fieldData = [
      ...planRes.map(item => ({
        value: item.productCode,
        label: `${item.productCode} ${item.productDescription}`,
      })),
    ];
    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_CUSTOMER, fetchCustomerSaga);
  yield takeLeading(constants.FETCH_PLAN, fetchPlanSaga);
}
