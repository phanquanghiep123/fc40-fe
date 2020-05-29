import { all, call, put, takeLeading, select } from 'redux-saga/effects';
import request, {
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  checkStatus,
} from 'utils/request';
import { localstoreUtilites } from 'utils/persistenceData';
import { loadingError, setLoading } from 'containers/App/actions';
import * as constants from './constants';
import * as actions from './actions';
import { paramsSearchSelect, formDataSelector } from './selectors';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const APIs = {
  getOrganizations: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`,
  getPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants?pageSize=-1`,
  getSuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=-1`,
  getCustomer: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-distinct`,
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getBaskets: `${
    PATH_GATEWAY.MASTERDATA_API
  }/pallet-baskets?pageSize=-1&sortDirection=asc`,
  search: `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/inventorybasket/simple`,
  basketLocator: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventorybasket/get-basket-locator`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/inventorybasket/export`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/status`,
  getSubType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/subType`,
};

function* fetchFormDataSaga() {
  const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
  try {
    yield put(setLoading());
    let paramsSearch = yield select(paramsSearchSelect());
    paramsSearch = paramsSearch ? paramsSearch.toJS() : null;
    const [basketRes, plantRes] = yield all([
      call(requestAuth, APIs.getBaskets),
      call(requestAuth, `${APIs.getOrganizations}?userId=${userId}`),
    ]);

    // Khởi tạo lựa chọn
    const formData = {
      listPlant: plantRes.data.map(item => ({
        value: item.value,
        label: `${item.value} ${item.name}`,
      })),
      listBaskets: basketRes.data.map(item => ({
        value: item.palletBasketCode,
        label: `${item.palletBasketCode} ${item.shortName}`,
      })),
    };

    if (plantRes.data.length === 1) {
      paramsSearch.plantCode = [
        {
          label: `${plantRes.data[0].value} ${plantRes.data[0].name}`,
          value: plantRes.data[0].value,
        },
      ];
    }

    // Khởi tạo giá trị mặc định
    const initValue = {
      plantCode: [],
      basketCode: '',
      date: new Date().toISOString(),
      filterLocator: [],
      pageSize: 10,
      pageIndex: 0,
      total: 0,
    };
    if (plantRes.data.length === 1) {
      initValue.plantCode = [
        {
          label: `${plantRes.data[0].value} ${plantRes.data[0].name}`,
          value: plantRes.data[0].value,
        },
      ];
    }
    yield searchSaga({
      data: paramsSearch || initValue,
      plantRes: plantRes.data,
    });
    yield put(actions.fetchFormSuccess({ formData, initValue }));
    yield getLocatorSaga({
      inputValue: {
        plantCodes: plantRes.data.map(item => item.value).toString(),
      },
    });
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getLocatorSaga(action) {
  const { inputValue } = action;
  const queryStr = serializeQueryParams(inputValue);

  try {
    const res = yield call(
      request,
      `${APIs.basketLocator}?${queryStr}`,
      optionReq(),
    );
    if (!res.data) {
      throw Object({ message: 'Không lấy được thông tin đơn vị quản lý' });
    }
    const fieldData = [
      ...res.data.map(item => ({
        value: item.basketLocatorCode,
        label: `${item.basketLocatorCode} ${item.description}`,
      })),
    ];
    yield put(actions.getLocatorSuccess(fieldData));
    // yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* searchSaga(action) {
  const submitValues = action.data;
  let orgCodes = '';
  if (action.plantRes) {
    orgCodes = action.plantRes.map(item => item.value).toString();
  } else {
    const data = yield select(formDataSelector());
    orgCodes = data
      .toJS()
      .listPlant.map(item => item.value)
      .toString();
  }

  try {
    const queryParams = {
      orgCodes,
      plantCode:
        submitValues.plantCode.length !== 0
          ? submitValues.plantCode.map(item => item.value).toString()
          : null,
      filterLocator:
        submitValues.filterLocator.length !== 0
          ? submitValues.filterLocator.map(item => item.value).toString()
          : null,
      basketCode:
        submitValues.basketCode.length !== 0
          ? submitValues.basketCode.map(item => item.value).toString()
          : null,
      pageSize: submitValues.pageSize,
      pageIndex: submitValues.pageIndex,
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
        total: res.meta.total,
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
  const data = yield select(formDataSelector());
  const orgCodes = data
    .toJS()
    .listPlant.map(item => item.value)
    .toString();
  const queryParams = {
    orgCodes,
    plantCode:
      submitValues.plantCode.length !== 0
        ? submitValues.plantCode.map(item => item.value).toString()
        : null,
    basketCode:
      submitValues.basketCode.length !== 0
        ? submitValues.basketCode.map(item => item.value).toString()
        : null,
    filterLocator:
      submitValues.filterLocator.length !== 0
        ? submitValues.filterLocator.map(item => item.value).toString()
        : null,
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
export default function* stockBasketManagementSaga() {
  yield takeLeading(constants.FETCH_FORM, fetchFormDataSaga);
  yield takeLeading(constants.GET_RECEIVER, getLocatorSaga);
  yield takeLeading(constants.SEARCH, searchSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
}
