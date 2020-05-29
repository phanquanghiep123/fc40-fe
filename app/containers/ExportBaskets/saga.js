import { all, call, put, takeLeading, select } from 'redux-saga/effects';
import request, {
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  METHOD_REQUEST,
  checkStatus,
} from 'utils/request';
import { localstoreUtilites } from 'utils/persistenceData';
import { loadingError, setLoading, showSuccess } from 'containers/App/actions';
import * as constants from './constants';
import * as actions from './actions';
import { paramsSearchSelect, listData } from './selectors';
import { makeSaveFileFunc, serializeQueryParams } from '../App/utils';

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
  search: `${PATH_GATEWAY.BFF_SPA_API}/exportstockreceiptsbaskets/simple`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/exportstockreceiptsbaskets/export`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/status`,
  getSubType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/subType`,
  deleteBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/exportstockreceiptsbaskets/print`,
};

const options = optionReq({ method: 'GET', body: null, authReq: true });
function* fetchFormDataSaga(action) {
  const { doCode } = action.payload;
  const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
  try {
    yield put(setLoading());
    const [basketRes, deliverRes, userRes, subTypeRes, statusRes] = yield all([
      call(requestAuth, APIs.getBaskets),
      // Bên giao hàng
      call(requestAuth, `${APIs.getOrganizations}?userId=${userId}`),
      //  Người Xuất Kho
      call(requestAuth, APIs.getUsers),
      //  Loại xuất khay sọt
      call(requestAuth, APIs.getSubType),
      // Trạng thái
      call(requestAuth, APIs.getStatus),
    ]);

    // Khởi tạo lựa chọn
    const formData = {
      listUser: userRes.data.map(item => ({
        value: item.id,
        label: `${item.lastName} ${item.firstName}`,
      })),
      listDeliver: deliverRes.data.map(item => ({
        value: item.value,
        label: item.name,
      })),
      listSubType: subTypeRes.map(item => ({
        value: item.id,
        label: item.name,
        description: item.description,
      })),
      listStatus: statusRes.map(item => ({
        value: item.id,
        label: item.name,
        description: item.description,
      })),
      listBaskets: basketRes.data.map(item => ({
        value: item.palletBasketCode,
        label: `${item.palletBasketCode} - ${item.shortName}`,
      })),
    };

    let paramsSearch = yield select(paramsSearchSelect());
    paramsSearch = paramsSearch ? paramsSearch.toJS() : null;
    if (deliverRes.data.length === 1) {
      paramsSearch.deliverCode = {
        label: deliverRes.data[0].name,
        value: deliverRes.data[0].value,
      };
    }
    // Khởi tạo giá trị mặc định
    const initValue = {
      basketDocumentCode: '',
      exportType: [],
      status: [],
      deliverCode: '',
      receiverCode: '',
      doCode: '',
      userId: '',
      filterBasket: '',
      exportedDateFrom: null,
      exportedDateTo: new Date(),
      documentCode: '',
    };
    if (doCode) {
      initValue.doCode = doCode;
      initValue.exportedDateTo = null;
      yield searchSaga({ data: initValue }, deliverRes);
    } else {
      if (deliverRes.data.length === 1) {
        initValue.deliverCode = {
          label: deliverRes.data[0].name,
          value: deliverRes.data[0].value,
        };
      }
      initValue.status = [
        {
          description: null,
          label: 'Chưa hoàn thành',
          value: 1,
        },
      ];
      // initValue.userId = {
      //   value: userId,
      //   label: fullName,
      // };
      yield searchSaga({ data: paramsSearch || initValue }, deliverRes);
    }
    yield put(actions.fetchFormSuccess({ formData, initValue }));
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getReceiverSaga(action) {
  const { inputValue, callback } = action;
  try {
    const [farmRes, supplierRes, customerRes] = yield all([
      call(request, `${APIs.getPlants}&search=${inputValue}`, options),
      call(request, `${APIs.getSuppliers}&search=${inputValue}`, options),
      call(request, `${APIs.getCustomer}?filter=${inputValue}`, options),
    ]);

    if (!farmRes.data || !supplierRes.data || !customerRes.data) {
      throw Object({ message: 'Không lấy được thông tin đơn vị giao hàng' });
    }

    const fieldData = [
      ...farmRes.data.map(item => ({
        value: item.plantCode,
        receiverType: 1,
        label: `${item.plantCode} ${item.plantName}`,
      })),
      ...supplierRes.data.map(item => ({
        value: item.supplierCode,
        receiverType: 2,
        label: `${item.supplierCode} ${item.name1}`,
      })),
      ...customerRes.data.map(item => ({
        value: item.customerCode,
        receiverType: 3,
        label: `${item.customerCode} ${item.customerName}`,
      })),
    ];
    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* searchSaga(action, deliver) {
  const submitValues = action.data;
  let orgCodes = '';
  if (deliver) {
    orgCodes = deliver.data.map(item => item.value).join(',');
  } else {
    const org = yield select(listData('formData'));
    const orgData = org.toJS();
    if (orgData.listDeliver) {
      orgCodes = orgData.listDeliver.map(item => item.value).join(',');
    }
  }
  try {
    const queryParams = {
      basketDocumentCode: submitValues.basketDocumentCode,
      documentCode: submitValues.documentCode,
      doCode: submitValues.doCode,
      deliverCode: submitValues.deliverCode && submitValues.deliverCode.value,
      receiverCode:
        submitValues.receiverCode && submitValues.receiverCode.value,
      receiverType:
        submitValues.receiverCode && submitValues.receiverCode.receiverType,
      exportType:
        submitValues.exportType &&
        submitValues.exportType.map(item => item.value).toString(),
      status:
        submitValues.status.length !== 0
          ? submitValues.status.map(item => item.value).toString()
          : null,
      userId: submitValues.userId && submitValues.userId.value,
      exportedDateFrom: submitValues.exportedDateFrom
        ? submitValues.exportedDateFrom.toISOString()
        : '',
      exportedDateTo: submitValues.exportedDateTo
        ? submitValues.exportedDateTo.toISOString()
        : '',
      filterBasket:
        submitValues.filterBasket && submitValues.filterBasket.value,
      pageSize: submitValues.pageSize || 10,
      pageIndex: submitValues.pageIndex || 0,
      sort: submitValues.sort && submitValues.sort,
      orgCodes,
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
  const org = yield select(listData('formData'));
  const orgData = org.toJS();
  const orgCodes = orgData.listDeliver.map(item => item.value).join(',');
  const submitValues = paramsSearch.toJS();
  const queryParams = {
    orgCodes,
    ...submitValues,
    doCode: submitValues.doCode,
    documentCode: submitValues.documentCode,
    deliverCode: submitValues.deliverCode && submitValues.deliverCode.value,
    receiverCode: submitValues.receiverCode && submitValues.receiverCode.value,
    receiverType:
      submitValues.receiverCode && submitValues.receiverCode.receiverType,
    exportType: submitValues.exportType.map(item => item.value).toString(),
    status:
      submitValues.status.length !== 0
        ? submitValues.status.map(item => item.value).toString()
        : null,
    userId: submitValues.userId && submitValues.userId.value,
    exportedDateFrom: submitValues.exportedDateFrom
      ? submitValues.exportedDateFrom.toISOString()
      : '',
    exportedDateTo: submitValues.exportedDateTo
      ? submitValues.exportedDateTo.toISOString()
      : '',
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

export function* deleteSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.deleteBasket}/${action.ids.idItem}`,
      optionReq({
        method: METHOD_REQUEST.DELETE,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    yield put(actions.deleteExportBasketSuccess(action.ids.idRow));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// export function* orderChangeSaga() {
//   console.log(1);
// }

export default function* exportBasketSaga() {
  yield takeLeading(constants.FETCH_FORM, fetchFormDataSaga);
  yield takeLeading(constants.GET_RECEIVER, getReceiverSaga);
  yield takeLeading(constants.SEARCH, searchSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.PRINT, printSaga);
  yield takeLeading(constants.DELETE_EXPORT_BASKET, deleteSaga);
  // yield takeLeading(constants.ORDER_CHANGE, orderChangeSaga);
}
