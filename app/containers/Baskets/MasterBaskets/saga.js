import { call, put, select, takeLeading } from 'redux-saga/effects';
import request, {
  requestAuth,
  optionReq,
  METHOD_REQUEST,
  PATH_GATEWAY,
  checkStatus,
} from 'utils/request';
import { showSuccess, loadingError, setLoading } from 'containers/App/actions';
import * as constants from './constants';
import * as actions from './actions';
import { paramSearchSelector } from './selectors';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

const APIs = {
  getUoms: `${PATH_GATEWAY.RESOURCEPLANNING_API}/uoms/auto-complete`,
  getSize: `${PATH_GATEWAY.RESOURCEPLANNING_API}/pallet-baskets/size`,
  search: `${PATH_GATEWAY.MASTERDATA_API}/pallet-baskets/simple`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/pallet-basket/export`,
  getDetail: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/pallet-baskets/get-pallet-basket-detail`,
  save: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/pallet-baskets/save-pallet-basket`,
  deleteBasket: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/pallet-baskets/delete-pallet-basket`,
};

const options = optionReq({
  method: METHOD_REQUEST.GET,
  body: null,
  authReq: true,
});

export function* getSizeSaga() {
  try {
    const response = yield call(requestAuth, `${APIs.getSize}`, options);
    const mappedData = [];
    response.data.forEach(item => {
      mappedData.push({
        value: item.id,
        label: item.name,
      });
    });
    yield put(actions.getSizeSuccess(mappedData));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getUomsSaga() {
  try {
    const response = yield call(requestAuth, `${APIs.getUoms}`, options);
    // checkStatus(response);
    const mappedData = response.data.map(item => ({
      value: item.intMeasUnit,
      label: `${item.intMeasUnit} ${
        item.measUnitText ? `- ${item.measUnitText}` : ''
      }`,
    }));
    yield put(actions.getUomsSuccess(mappedData));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* searchSaga(action) {
  const queryParams = {
    ...action.data,
    size: action.data.size ? action.data.size.value : '',
    pageSize: -1,
  };
  try {
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(request, `${APIs.search}?${queryStr}`, options);
    checkStatus(res);
    yield put(actions.searchMasterSuccess(res.data, action.data));
    yield put(setLoading(false));
    if (typeof action.callback === 'function') {
      yield action.callback();
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* deleteSaga(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.deleteBasket}`,
      optionReq({
        method: METHOD_REQUEST.DELETE,
        body: action.idRowData,
        authReq: true,
      }),
    );
    checkStatus(res);
    yield put(actions.deleteBasketSuccess(action.idTable));
    yield put(showSuccess(res.message));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* saveSaga(action) {
  const { data } = action;
  const values = {
    id: data.id,
    palletBasketCode: data.palletBasketCode,
    fullName: data.fullName,
    shortName: data.shortName,
    netWeight: data.netWeight,
    weightUnit: data.weightUnit.value,
    uoM: data.uoM.value,
    size: data.size,
    length: data.length,
    width: data.width,
    height: data.height,
    registerPlace: 2,
    registerDate: new Date(),
    isUsed: data.isUsed,
    tableData: data.tableData ? { id: data.tableData.id } : null,
  };
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      APIs.save,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: values,
        authReq: true,
      }),
    );
    checkStatus(res);
    if (action.data.tableData) {
      yield put(actions.saveSuccess(values));
    }
    if (action.callback) {
      yield action.callback(action.data.tableData && action.data.tableData);
    }
    yield put(showSuccess(res.message));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* exportExcelSaga() {
  const data = yield select(paramSearchSelector());
  const dataTojs = data.toJS();
  const queryParams = {
    palletBasketCode: dataTojs.palletBasketCode,
    palletBasketName: dataTojs.palletBasketName,
    size: dataTojs.size ? dataTojs.size.value : '',
    pageSize: -1,
  };
  try {
    yield put(setLoading());
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
      options,
      makeSaveFileFunc(),
    );
    checkStatus(res);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// Individual exports for testing
export default function* masterBasketsSaga() {
  yield takeLeading(constants.SEARCH_MASTER, searchSaga);
  yield takeLeading(constants.SAVE, saveSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.DELETE_BASKET, deleteSaga);
  yield takeLeading(constants.GET_UOMS, getUomsSaga);
  yield takeLeading(constants.GET_SIZE, getSizeSaga);
}
