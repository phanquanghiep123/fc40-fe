/* eslint-disable indent */
import { put, call, takeLatest, takeLeading } from 'redux-saga/effects';
import * as constants from './constants';
import * as actions from './actions';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import request, { PATH_GATEWAY, optionReq } from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { serializeQueryParams } from '../../App/utils';

const APIs = {
  getOrgsByUserId: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`, // ?userId=
  getRouteAutocomplete: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-pallet-basket/get-autocomplete-location-code`, // ?locationCodeKey={}
  getBasketAutocomplete: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-pallet-basket/get-autocomplete-pallet-basket`, // ?palletBasketKey={}
  getTableData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-pallet-basket/get-deli-pallet-basket`, //
  submitData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-pallet-basket/register-deli-pallet-basket`, // POST
  printData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-pallet-basket/print-deli-pallet-basket`, //
  getCustomerAutocomplete: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-pallet-basket/get-autocomplete-customer-deli-pallet-basket`,
};

const { userId, fullName } = localstoreUtilites.getAuthFromLocalStorage().meta;

export function* fetchFieldsDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const orgRes = yield call(
        request,
        `${APIs.getOrgsByUserId}?userId=${userId}`,
        optionReq({ method: 'GET', authReq: true }),
      );

      if (orgRes.statusCode !== 200 || !orgRes.data) {
        throw Object({
          message: orgRes.message || 'Không tải được danh sách đơn vị',
        });
      }

      const fieldsData = {
        org: orgRes.data
          ? orgRes.data.map(item => ({
              value: item.value,
              label: item.name,
              type: item.organizationType,
            }))
          : [],
      };

      yield put(actions.fetchFieldsDataSuccess(fieldsData));

      updatedFormValues = {
        ...formValues,
        org: fieldsData.org[0].value,
      };
    }

    yield put(actions.fetchTableData(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues /** , currentTableData */ } = action;

    const queryParams = {
      plantCode: formValues.org,
      datePicking: formValues.pickingDate.toISOString(),
      locationCodeFrom: formValues.routeFrom ? formValues.routeFrom.value : '',
      locationCodeTo: formValues.routeTo ? formValues.routeTo.value : '',
      customerName: formValues.storeName,
      pageSize: -1,
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getTableData}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không tải được thông tin khay sọt',
      });
    }

    const mappedTable = res.data.map(item => {
      const baskets = item.palletBasketDetails;
      return {
        plantCode: item.plantCode,
        storeCode: item.customerCode,
        storeName: item.customerName,
        route: item.locationCode,
        basketCode1: baskets[0] ? baskets[0].palletBasketCode : '',
        basketName1: baskets[0] ? baskets[0].palletBasketName : '',
        quantity1: baskets[0] ? baskets[0].palletBasketQuantity : null,
        basketCode2: baskets[1] ? baskets[1].palletBasketCode : '',
        basketName2: baskets[1] ? baskets[1].palletBasketName : '',
        quantity2: baskets[1] ? baskets[1].palletBasketQuantity : null,
        basketCode3: baskets[2] ? baskets[2].palletBasketCode : '',
        basketName3: baskets[2] ? baskets[2].palletBasketName : '',
        quantity3: baskets[2] ? baskets[2].palletBasketQuantity : null,
        note: item.note,
        soldTo: item.soldTo,
        isEditable: item.isAllowChange,
        isChanged: false,
      };
    });

    // const newlyAddedRows = currentTableData.filter(row => row.isManuallyAdded);
    // const notSubmittedRows = newlyAddedRows.filter(row => !row.storeCode);
    // mappedTable = [...mappedTable, ...notSubmittedRows];

    yield put(actions.fetchTableDataSuccess(formValues, mappedTable));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchRouteAutocompleteSaga(action) {
  try {
    const { inputText, callback } = action;

    const res = yield call(
      request,
      `${APIs.getRouteAutocomplete}?locationCodeKey=${inputText}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      callback(null);
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    const mappedData = res.data
      ? res.data.map(item => ({
          value: item.locationCode,
          label: item.locationCode,
        }))
      : [];

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBasketAutocompleteSaga(action) {
  try {
    const { inputText, callback } = action;

    const res = yield call(
      request,
      `${APIs.getBasketAutocomplete}?palletBasketKey=${inputText}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      callback(null);
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    const mappedData = res.data
      ? res.data.map(item => ({
          value: item.palletBasketCode,
          label: item.shortName,
        }))
      : [];

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchCustomerAutocompleteSaga(action) {
  try {
    const { inputText, submittedValues, callback } = action;

    const queryParams = {
      search: inputText,
      plantCode: submittedValues.org,
      datePicking:
        typeof submittedValues.pickingDate === 'object'
          ? submittedValues.pickingDate.toISOString()
          : submittedValues.pickingDate,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getCustomerAutocomplete}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      callback(null);
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    const mappedData = res.data
      ? res.data.map(item => ({
          value: item.customerCode,
          label: item.customerName,
          route: item.locationCode,
          soldTo: item.soldTo,
        }))
      : [];

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, submittedValues } = action;
    const { tableData } = formValues;

    const mappedData = tableData.filter(item => !!item.storeCode).map(item => ({
      plantCode: item.plantCode,
      datePickingList: formValues.pickingDate
        ? formValues.pickingDate.toISOString()
        : null,
      customerCode: item.storeCode,
      customerName: item.storeName,
      locationCode: item.route,
      routeCode: item.route,
      soldTo: item.soldTo,
      note: item.note,
      palletBasketDetails: [
        ...(item.basketCode1
          ? [
              {
                palletBasketCode: item.basketCode1,
                palletBasketName: item.basketName1,
                palletBasketQuantity: item.quantity1,
              },
            ]
          : []),
        ...(item.basketCode2
          ? [
              {
                palletBasketCode: item.basketCode2,
                palletBasketName: item.basketName2,
                palletBasketQuantity: item.quantity2,
              },
            ]
          : []),
        ...(item.basketCode3
          ? [
              {
                palletBasketCode: item.basketCode3,
                palletBasketName: item.basketName3,
                palletBasketQuantity: item.quantity3,
              },
            ]
          : []),
      ],
      isChange: item.isChanged,
      isAllowChange: item.isEditable,
    }));

    const res = yield call(
      request,
      APIs.submitData,
      optionReq({ method: 'POST', body: mappedData, authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Lưu không thành công',
      });
    }

    yield put(showSuccess(res.message || 'Lưu thành công'));
    yield put(actions.fetchTableData(submittedValues, tableData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* printDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, callback } = action;

    const queryParams = {
      plantCode: formValues.org,
      datePicking: formValues.pickingDate.toISOString(),
      locationCodeFrom: formValues.routeFrom ? formValues.routeFrom.value : '',
      locationCodeTo: formValues.routeTo ? formValues.routeTo.value : '',
      customerName: formValues.storeName,
      pageSize: -1,
      fullName,
    };
    const queryStr = serializeQueryParams(queryParams);

    const res = yield call(
      request,
      `${APIs.printData}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được bản in',
      });
    }

    callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatchers() {
  yield takeLeading(constants.FETCH_FIELDS_DATA, fetchFieldsDataSaga);
  yield takeLeading(constants.FETCH_TABLE_DATA, fetchTableDataSaga);
  yield takeLatest(
    constants.FETCH_ROUTE_AUTOCOMPLETE,
    fetchRouteAutocompleteSaga,
  );
  yield takeLatest(
    constants.FETCH_BASKET_AUTOCOMPLETE,
    fetchBasketAutocompleteSaga,
  );
  yield takeLeading(
    constants.FETCH_CUSTOMER_AUTOCOMPLETE,
    fetchCustomerAutocompleteSaga,
  );
  yield takeLeading(constants.SUBMIT_DATA, submitDataSaga);
  yield takeLeading(constants.PRINT_DATA, printDataSaga);
}
