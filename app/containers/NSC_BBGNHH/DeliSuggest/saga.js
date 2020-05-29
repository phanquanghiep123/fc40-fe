import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from '../../../utils/request';
import {
  openDialog,
  setLoading,
  loadingError,
  showSuccess,
} from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';
// import * as demoData from './demoData';
// import { productsRoutine } from './routines';
import { formDataSchema } from './FormSection/formats';
import { serializeQueryParams } from '../../App/utils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getRouteAuto: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/delivery-receipt/get-route`, // ?userId={id}
  getDeliSuggest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/delivery-receipt/get-deli-suggest`, // ?userId={id}
};

export function* submitFormSaga(action) {
  try {
    const shopList = localStorage.getItem('deliveryReceiptStocks').split(',');
    yield put(setLoading());
    const queryParams = {
      plantCode: action.values.deliver ? action.values.deliver.value : null,
      processDate: action.values.processDate
        ? action.values.processDate.toISOString()
        : null,
      routeFrom: action.values.routeFrom ? action.values.routeFrom.value : null,
      routeTo: action.values.routeTo ? action.values.routeTo.value : null,
      shipToCodes: shopList || action.values.deliveryReceiptStocks,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getDeliSuggest}?${queryStr}&pageSize=-1`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    if (response.statusCode !== responseCode.ok || !response.data) {
      throw Object({
        message: response.message || 'Không lấy được danh sách Cửa Hàng.',
      });
    }
    // const response = demoData.storeList;
    const tableData = response.data.map(item => ({
      ...item,
      tableData: {
        checked: true,
      },
    }));

    yield put(actions.formSubmitSuccess(action.values, tableData));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* submitStoreSaga(action) {
  try {
    yield put(setLoading());

    const { selectedRecords, formValues } = action;

    if (selectedRecords.length < 1) {
      throw Object({
        message: selectedRecords.message || 'Không có Cửa Hàng nào được chọn.',
      });
    }
    yield put(
      showSuccess(selectedRecords.message || 'Cập nhật Cửa Hàng thành công'),
    );
    const newSelected = selectedRecords.map(item => item.shipToCode);

    const oldStoreList = localStorage.getItem('deliveryReceiptStocks')
      ? localStorage.getItem('deliveryReceiptStocks').split(',')
      : localStorage.getItem('deliveryReceiptStocks');

    const newStoreList = oldStoreList
      ? [...oldStoreList, ...newSelected]
      : [...newSelected];

    formValues.deliveryReceiptStocks = newStoreList;
    localStorage.setItem('deliveryReceiptStocks', newStoreList);

    yield put(actions.submitForm(formValues));

    yield put(actions.submitStoreSuccess(action.values, selectedRecords));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* openPopupSaga(action) {
  try {
    const {
      deliverCode, // Mã bên giao hàng
      deliverName, // Tên bên giao hàng
      deliveryDate, // Ngày giao hàng
      deliveryReceiptStocks, // Danh sách hàng hóa
    } = action;
    const storeList = deliveryReceiptStocks.map(item => item.shipToCode);

    localStorage.setItem('deliveryReceiptStocks', storeList || null);

    const deliver = {
      value: deliverCode,
      label: deliverName,
    };
    formDataSchema.deliver[0] = deliver;
    formDataSchema.processDate = deliveryDate;
    formDataSchema.deliveryReceiptStocks = deliveryReceiptStocks;

    yield put(actions.formDataFetched(formDataSchema));
    const formValues = {
      deliver: deliverCode,
      processDate: deliveryDate,
      deliveryReceiptStocks: localStorage
        .getItem('deliveryReceiptStocks')
        .split(','),
    };
    yield put(actions.submitForm(formValues));

    yield put(openDialog());
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchRouteSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const routeRes = yield call(
      request,
      `${APIs.getRouteAuto}?filter=${inputValue}`,
      GETOption,
    );
    const fieldData = [
      ...routeRes.data.map(item => ({
        value: item,
        label: item,
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
  yield takeLeading(constants.OPEN_POPUP, openPopupSaga);
  yield takeLeading(constants.SUBMIT_STORE, submitStoreSaga);
  yield takeLatest(constants.FETCH_ROUTE, fetchRouteSaga);
}
