/* eslint-disable indent */
import { localstoreUtilites } from 'utils/persistenceData';
import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import request, { optionReq, PATH_GATEWAY } from 'utils/request';
import { map, extend } from 'lodash';
import { loadingError, setLoading } from 'containers/App/actions';
import { mapping } from './mapping';
import * as constants from './constants';
import * as actions from './actions';
import { serializeQueryParams } from '../../App/utils';
const APIs = {
  getProducts: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventories/get-product-autocomplete`,
  processingType: `${PATH_GATEWAY.RESOURCEPLANNING_API}/master-code`,
  getSuggest: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/coordination-suggestion`,
  getDeliFormData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-export-transfer/get-data-init-deli-export-transfer`,
  getDeliTableData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-export-transfer/get-deli-export-transfer`,
  getDeliSelectProducts: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-export-transfer/get-data-select-products`,
  getDeliProductCodeAutocomplete: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-export-transfer/get-autocomplete-product-deli`,
  getBatchAuto: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventories/get-batch-autocomplete`,
};

const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* getProducts(action) {
  try {
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.getProducts}?locatorId=${action.locatorId}&filter=${action.text}`,
      GETOption,
    );
    const data = map(res.data, o =>
      extend({ viewAutoComplete: `${o.productName}` }, o),
    );

    action.callback(data);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* initScreenRequest() {
  try {
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });

    const [processingType, organizations] = yield all([
      call(request, `${APIs.processingType}?parentCode=9`, GETOption),
      call(
        request,
        `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user?userId=${
          auth.meta.userId
        }`,
        GETOption,
      ),
    ]);
    yield put(
      actions.fetchProcessingTypeSuccess(
        processingType[0] ? processingType[0].childs : [],
      ),
    );
    const organizationsData = organizations.data.map(item => ({
      ...item,
      label: item.name,
    }));
    yield put(actions.getOrganizationsSuccess(organizationsData));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getSuggest(action) {
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.getSuggest}?deliverCode=${
        action.deliverCode.value
      }&receiverCode=${action.receiverCode.value}&productNameFilter=${
        action.productName
      }&slotCodeFilter=${action.slotCode}`,
      GETOption,
    );
    yield put(
      actions.saveInventories(mapping(res.data, action.detailsCommands)),
    );
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getDeliFormDataSaga() {
  try {
    yield put(setLoading());

    const res = yield call(
      request,
      APIs.getDeliFormData,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không tải được thông tin',
      });
    }

    const { data } = res;
    const formDefaultValues = {
      exportingOrg: data.plantExport ? data.plantExport.plantCode : '',
      importingOrg: data.plantImport ? data.plantImport.plantCode : '',
      pickingDate: data.datePicking,
      fromStock: data.locator
        ? `${data.locator.locatorName} - ${data.locator.locatorCode}`
        : '',
    };

    const formData = {
      exportingOrg: [
        ...(data.plantExport
          ? [
              {
                value: data.plantExport.plantCode,
                label: data.plantExport.plantName,
              },
            ]
          : []),
      ],
      importingOrg: [
        ...(data.plantImport
          ? [
              {
                value: data.plantImport.plantCode,
                label: data.plantImport.plantName,
              },
            ]
          : []),
      ],
    };
    yield put(actions.getDeliFormDataSuccess(formData, formDefaultValues));
    // yield put(actions.getDeliTableData(formDefaultValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getDeliTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const queryParams = {
      deliverCode: formValues.exportingOrg.value,
      receiverCode: formValues.importingOrg.value,
      datePicking:
        typeof formValues.pickingDate === 'object'
          ? formValues.pickingDate.toISOString()
          : formValues.pickingDate,
      productCode: formValues.productCode ? formValues.productCode.value : null,
      productName: formValues.productName,
      exceptProductCodes: formValues.exceptProductCodes,
      pageSize: -1,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getDeliTableData}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không tải được thông tin chia chọn',
      });
    }

    const mappedData = res.data.map(item => ({
      planningCode: item.planningCode,
      productCode: item.productCode,
      productName: item.productName,
      plantCode: item.vendorCode,
      plantName: item.vendorName,
      uom: item.uom,
      batch: item.batch,
      isHighLight: item.isHighLight,
      actualPickingQuantity: item.quantityReal,
      exportedQuantity: item.quantityExport,
      remainQuantity: item.quantityRemaining,
      pickingQuantity: item.quantityPicking,
      tableData: {
        checked: true,
      },
    }));

    yield put(actions.getDeliTableDataSuccess(mappedData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getDeliProductCodeAutocompleteSaga(action) {
  try {
    const { inputValue, callback } = action;

    const res = yield call(
      request,
      `${APIs.getDeliProductCodeAutocomplete}?search=${inputValue}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      callback(null);
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    const mappedData = res.data
      ? res.data.map(item => ({
          value: item.productCode,
          label: item.productName,
          uom: item.uom,
        }))
      : [];

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getDeliSelectProducts(action) {
  try {
    yield put(setLoading());

    const { deliverCode, selectedRows, callback } = action;

    if (!selectedRows || !selectedRows.length) {
      throw Object({ message: 'Yêu cầu chọn ít nhất một sản phẩm' });
    }

    const playloadData = {
      deliverCode,
      products: selectedRows.map(item => ({
        planningCode: item.planningCode,
        productCode: item.productCode,
        productName: item.productName,
        vendorCode: item.plantCode,
        vendorName: item.plantName,
        uom: item.uom,
        batch: item.batch,
        quantityReal: item.actualPickingQuantity,
        quantityExport: item.exportedQuantity,
        quantityRemaining: item.remainQuantity,
        quantityPicking: item.pickingQuantity,
      })),
    };

    const res = yield call(
      request,
      `${APIs.getDeliSelectProducts}`,
      optionReq({
        method: 'POST',
        body: playloadData,
      }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    if (!res.data.length) {
      throw Object({ message: 'Không có dữ liệu từ Chia chọn thực tế' });
    }

    if (callback) {
      callback(res.data);
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getBatchAuto(action) {
  try {
    const { params, inputText, callback } = action;

    let requestURL = `${APIs.getBatchAuto}?filter=${inputText}`;

    if (params && params.locatorId) {
      requestURL += `&locatorId=${params.locatorId}`;
    }
    if (params && params.productCode) {
      requestURL += `&productCode=${params.productCode}`;
    }

    const response = yield call(
      request,
      requestURL,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (callback) {
      const data = map(response.data, o =>
        extend({ viewAutoComplete: `${o.inventoryQuantity} ${o.uom}` }, o),
      );
      callback(data);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* ImportStockListPageSagaWatchers() {
  yield takeLatest(constants.GET_PRODUCTS, getProducts);
  yield takeLatest(constants.GET_BATCH_AUTO, getBatchAuto);
  yield takeLatest(
    constants.GET_DELI_PRODUCT_CODE_AUTOCOMPLETE,
    getDeliProductCodeAutocompleteSaga,
  );

  yield takeLeading(
    constants.FETCH_INFO_INIT_PRODUCT_EXPORT,
    initScreenRequest,
  );
  yield takeLeading(constants.GET_SUGGEST, getSuggest);
  yield takeLeading(constants.GET_DELI_FORM_DATA, getDeliFormDataSaga);
  yield takeLeading(constants.GET_DELI_TABLE_DATA, getDeliTableDataSaga);
  yield takeLeading(constants.GET_DELI_SELECT_PRODUCTS, getDeliSelectProducts);
}
