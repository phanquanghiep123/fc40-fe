import { all, call, put, takeLeading, select } from 'redux-saga/effects';
import request, {
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  checkStatus,
} from 'utils/request';
import { loadingError, setLoading } from 'containers/App/actions';
import { localstoreUtilites } from 'utils/persistenceData';
import * as constants from './constants';
import * as actions from './actions';
import { paramsSearchSelect, listData } from './selectors';
import { makeSaveFileFunc, serializeQueryParams } from '../App/utils';

export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const APIs = {
  getOrganizations: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`,
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getBaskets: `${
    PATH_GATEWAY.MASTERDATA_API
  }/pallet-baskets?pageSize=-1&sortDirection=asc`,
  search: `${PATH_GATEWAY.BFF_SPA_API}/asset-document/simple`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/asset-document/export`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/asset-document/documentStatus`,
  getSubType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/asset-document/documentType`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/asset-document/print`,
};

function* fetchFormDataSaga() {
  const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
  try {
    yield put(setLoading());
    const [basketRes, userRes, subTypeRes, statusRes, orgRes] = yield all([
      call(requestAuth, APIs.getBaskets),
      call(requestAuth, APIs.getUsers),
      call(requestAuth, APIs.getSubType),
      call(requestAuth, APIs.getStatus),
      call(requestAuth, `${APIs.getOrganizations}?userId=${userId}`),
    ]);

    // Khởi tạo lựa chọn
    const formData = {
      listUser: userRes.data.map(item => ({
        value: item.id,
        label: `${item.lastName} ${item.firstName}`,
      })),
      listSubType: subTypeRes.map(item => ({
        value: item.id,
        label: item.name,
      })),
      listStatus: statusRes.map(item => ({
        value: item.id,
        label: item.name,
      })),
      listBaskets: basketRes.data.map(item => ({
        value: item.palletBasketCode,
        label: `${item.palletBasketCode} - ${item.shortName}`,
      })),
      listOrgs: orgRes.data.map(item => ({
        value: item.value,
        label: item.name,
      })),
    };

    let paramsSearch = yield select(paramsSearchSelect());
    paramsSearch = paramsSearch ? paramsSearch.toJS() : null;
    if (orgRes.data.length === 1) {
      paramsSearch.plantCode = {
        label: orgRes.data[0].name,
        value: orgRes.data[0].value,
      };
    }
    // Khởi tạo giá trị mặc định
    const initValue = {
      assetDocumentCode: '',
      assetDocumentType: '',
      status: '',
      basketDocumentCode: '',
      userId: '',
      filterBasket: '',
      dateFrom: new Date(),
      dateTo: new Date(),
      stockTakingCode: '',
      plantCode: '',
      basketCancellReceiptCode: '',
      pageSize: 10,
      pageIndex: 0,
      totalItem: 0,
    };
    if (orgRes.data.length === 1) {
      initValue.plantCode = {
        label: orgRes.data[0].name,
        value: orgRes.data[0].value,
      };
    }
    yield searchSaga({ data: paramsSearch || initValue }, orgRes);
    yield put(actions.fetchFormSuccess({ formData, initValue }));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* searchSaga(action, orgs) {
  const submitValues = action.data;
  let orgCodes = '';
  if (orgs) {
    orgCodes = orgs.data.map(item => item.value).join(',');
  } else {
    const org = yield select(listData('formData'));
    const orgData = org.toJS();
    if (orgData.listOrgs) {
      orgCodes = orgData.listOrgs.map(item => item.value).join(',');
    }
  }
  try {
    const queryParams = {
      orgCodes,
      assetDocumentCode: submitValues.assetDocumentCode,
      basketDocumentCode: submitValues.basketDocumentCode,
      basketCancellReceiptCode: submitValues.basketCancellReceiptCode,
      stockTakingCode: submitValues.stockTakingCode,
      assetDocumentType:
        submitValues.assetDocumentType && submitValues.assetDocumentType.value,
      status: submitValues.status && submitValues.status.value,
      userId: submitValues.userId && submitValues.userId.value,
      plantCode: submitValues.plantCode && submitValues.plantCode.value,
      dateFrom: submitValues.dateFrom
        ? submitValues.dateFrom.toISOString()
        : '',
      dateTo: submitValues.dateTo ? submitValues.dateTo.toISOString() : '',
      filterBasket:
        submitValues.filterBasket && submitValues.filterBasket.value,
      pageSize: submitValues.pageSize || 10,
      pageIndex: submitValues.pageIndex || 0,
      sort: submitValues.sort && submitValues.sort,
    };
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(request, `${APIs.search}?${queryStr}`, optionReq());
    yield checkStatus(res);
    yield put(
      actions.searchSuccess(res.data, {
        ...submitValues,
        pageSize: submitValues.pageSize,
        pageIndex: submitValues.pageIndex,
        totalItem: res.meta.count,
      }),
    );
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* exportExcelSaga() {
  const paramsSearch = yield select(paramsSearchSelect());
  const submitValues = paramsSearch.toJS();

  const org = yield select(listData('formData'));
  const orgData = org.toJS();

  const orgCodes = orgData.listOrgs.map(item => item.value).join(',');

  const queryParams = {
    orgCodes,
    assetDocumentCode: submitValues.assetDocumentCode,
    basketDocumentCode: submitValues.basketDocumentCode,
    basketCancellReceiptCode: submitValues.basketCancellReceiptCode,
    stockTakingCode: submitValues.stockTakingCode,
    assetDocumentType:
      submitValues.assetDocumentType && submitValues.assetDocumentType.value,
    status: submitValues.status && submitValues.status.value,
    userId: submitValues.userId && submitValues.userId.value,
    plantCode: submitValues.plantCode && submitValues.plantCode.value,
    dateFrom: submitValues.dateFrom ? submitValues.dateFrom.toISOString() : '',
    dateTo: submitValues.dateTo ? submitValues.dateTo.toISOString() : '',
    filterBasket: submitValues.filterBasket && submitValues.filterBasket.value,
  };
  try {
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
      optionReq(),
      makeSaveFileFunc(),
    );
    checkStatus(response);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* printSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.print}?ids=${action.ids}&isReprint=false`,
      optionReq(),
    );
    action.callback(response.data);
    checkStatus(response);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* exportImportPropertyListSaga() {
  yield takeLeading(constants.FETCH_FORM, fetchFormDataSaga);
  yield takeLeading(constants.SEARCH, searchSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.PRINT, printSaga);
}
