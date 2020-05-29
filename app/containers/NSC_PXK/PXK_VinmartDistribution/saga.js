/* eslint-disable no-unused-vars,indent */
import {
  all,
  call,
  put,
  takeLatest,
  takeLeading,
  select,
} from 'redux-saga/effects';
import request, { optionReq, PATH_GATEWAY } from '../../../utils/request';
import { setLoading, showSuccess, loadingError } from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';
import { formSubmittedValues } from './selectors';

const APIs = {
  getMappingValue: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/product-allocation/get-default-value-mapping`,
  getOrgsByUserId: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`, // ?userId=
  getTableData: `${
    PATH_GATEWAY.BFF_SPA_API
  }/product-allocation/get-data-product-allocation`,
  getCustomerAutocomplete: `${
    PATH_GATEWAY.BFF_SPA_API
  }/product-allocation/get-autocomplete-customer-deli`,
  createReceipt: `${
    PATH_GATEWAY.BFF_SPA_API
  }/product-allocation/create-export-sell-deli`,
  getProductAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/products/auto-complete`,
  getFarmAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants`,
  getsuppliersAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers`,
  getPlanning: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/products/auto-complete?materialType=ZPLA`,
  exportExcel: `${
    PATH_GATEWAY.BFF_SPA_API
  }/product-allocation/export-data-product-allocation`,
};
function mappingFunction(obj, currentValue) {
  // eslint-disable-next-line no-param-reassign,no-return-assign
  obj[currentValue.plantCode] = {
    label: currentValue.customerName,
    value: currentValue.customerCode,
  };
  return obj;
}

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;

      const [mappingValue, orgRes] = yield all([
        call(
          request,
          `${APIs.getMappingValue}`,
          optionReq({ method: 'GET', authReq: true }),
        ),
        call(
          request,
          `${APIs.getOrgsByUserId}?userId=${userId}`,
          optionReq({ method: 'GET', authReq: true }),
        ),
      ]);

      // List of orgs by userId
      if (!orgRes.data) {
        throw Object({
          message: orgRes.message || 'Không lấy được dữ liệu đơn vị',
        });
      }

      if (!(mappingValue instanceof Array)) {
        throw Object({
          message: orgRes.message || 'Không lấy được dữ liệu hỗ trợ nhập',
        });
      }

      const formData = {
        org: orgRes.data.map(item => ({
          value: item.value,
          label: item.name,
        })),
        mappingValues: mappingValue.reduce(mappingFunction, {}),
      };

      yield put(actions.fetchFormDataSuccess(formData));

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      updatedFormValues = {
        ...formValues,
        org: formData.org[0] ? formData.org[0].value : '',
        date: currentDate,
      };
    }

    if (!formValues.date || !formValues.customer) {
      yield put(setLoading(false));
      return;
    }

    yield put(actions.fetchTableData(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const queryParams = {
      plantProcessCode: formValues.org ? formValues.org.value : '',
      customerCode: formValues.customer ? formValues.customer.value : '',
      productCode: formValues.productCode ? formValues.productCode.value : '',
      productName: formValues.productName,
      planningCode: formValues.planningCode
        ? formValues.planningCode.value
        : '',
      planningName: formValues.planningName,
      vendorCode: formValues.vendorCode ? formValues.vendorCode.value : '',
      dateProcess: formValues.date ? formValues.date.toISOString() : '',
      pageSize: -1,
      // pageIndex: '',
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getTableData}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (!res.data) {
      throw Object({
        message: res.message || 'Không lấy được dữ liệu',
      });
    }

    const firstRow = {
      requireVM: false,
      requireVMP: false,
    };

    let key = 1; // data start from 2nd row, the first row is empty
    const spreadTableData = [];
    res.data.forEach(rowGroup => {
      const mainRowIndex = key;
      let isMainRowAdded = false; // main row of the row group

      const mainRow = {
        planningCode: rowGroup.planningCode,
        planningName: rowGroup.planningName,
        vendorCode: rowGroup.vendorCode,
        vendorName: rowGroup.vendorName,
        uom: rowGroup.uom,
        quantityExpect: rowGroup.quantityExpect,
      };

      if (
        !rowGroup.details ||
        !Array.isArray(rowGroup.details) ||
        rowGroup.details.length === 0
      ) {
        spreadTableData.push(mainRow);
        key += 1;
      } else {
        // if there is a details array => spread details
        let currentRow = { ...mainRow };
        rowGroup.details.forEach(detail => {
          const mainDetailIndex = key;
          let isMainDetailAdded = false;

          const mainDetail = {
            productCode: detail.productCode,
            productName: detail.productName,
            ratioVinMart: detail.ratioVinMart,
            ratioVinMartString: detail.ratioVinMartString,
            ratioVinMartPlus: detail.ratioVinMartPlus,
            ratioVinMartPlusString: detail.ratioVinMartPlusString,
          };

          // Check VM/VM+ if they are required to create export receipt
          if (!firstRow.requireVM && detail.ratioVinMart) {
            firstRow.requireVM = true;
          }
          if (!firstRow.requireVMP && detail.ratioVinMartPlus) {
            firstRow.requireVMP = true;
          }

          if (
            (!detail.items && !Array.isArray(detail.items)) ||
            detail.items.length === 0
          ) {
            currentRow = {
              ...(isMainRowAdded ? {} : mainRow),
              ...mainDetail,
            };

            // push row to array
            spreadTableData.push(currentRow);
            isMainRowAdded = true;
            key += 1;
          } else {
            // if there is items array => spread items
            detail.items.forEach(item => {
              const itemDetail = {
                batch: item.batch,
                quantityAllocation: item.quantityAllocation,
                quantityExportVinMart: item.quantityExportVinMart,
                quantityExportVinMartPlus: item.quantityExportVinMartPlus,
              };

              if (!isMainDetailAdded) {
                currentRow = { ...mainDetail, ...itemDetail };
                isMainDetailAdded = true;
              } else {
                currentRow = { ...itemDetail, mainDetailIndex };
              }

              if (!isMainRowAdded) {
                currentRow = { ...mainRow, ...currentRow };
                isMainRowAdded = true;
              } else {
                currentRow.mainRowIndex = mainRowIndex;
              }

              // push row to array
              spreadTableData.push(currentRow);
              key += 1;
            });
          }
        });
      }
    });

    yield put(
      actions.fetchTableDataSuccess(formValues, [firstRow, ...spreadTableData]),
    );
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchCustomerAutocompleteSaga(action) {
  try {
    const { inputValue, callback } = action;
    const res = yield call(
      request,
      `${APIs.getCustomerAutocomplete}?search=${inputValue}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      callback([]);
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    const mappedData = res.data.map(item => ({
      value: item.customerCode,
      label: item.customerName,
    }));

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchSoldToVinmartAutocompleteSaga(action) {
  try {
    const { inputValue, callback } = action;
    const res = yield call(
      request,
      `${APIs.getCustomerAutocomplete}?search=${inputValue}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      callback([]);
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    // @todo: confirm param with BA
    const mappedData = res.data.map(item => ({
      value: item.customerCode,
      label: item.customerCode,
      name: item.customerName,
    }));

    callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitCreateExportReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    const bodyParams = {
      plantProcessCode: formValues.org ? formValues.org.value : '',
      customerCode: formValues.customer ? formValues.customer.value : null,
      dateProcess: formValues.date ? formValues.date.toISOString() : null,
      soldToVinmart: formValues.soldToVinmart
        ? formValues.soldToVinmart.value
        : null,
      soldToVinmartPlus: formValues.soldToVinmartPlus
        ? formValues.soldToVinmartPlus.value
        : null,
    };

    const res = yield call(
      request,
      `${APIs.createReceipt}`,
      optionReq({ method: 'POST', body: bodyParams, authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Tạo phiếu không thành công',
      });
    }

    yield put(showSuccess(res.message || 'Tạo phiếu thành công'));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchProductSaga(action) {
  try {
    const { inputValue, callback } = action.payload;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const productRes = yield call(
      request,
      `${APIs.getProductAuto}?search=${inputValue}`,
      GETOption,
    );
    const fieldData = [
      ...productRes.map(item => ({
        value: item.productCode,
        label: `${item.productCode} ${item.productDescription}`,
      })),
    ];

    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchPlanning(action) {
  try {
    const { inputValue, callback } = action.payload;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const productRes = yield call(
      request,
      `${APIs.getPlanning}&search=${inputValue}`,
      GETOption,
    );
    const fieldData = [
      ...productRes.map(item => ({
        value: item.productCode,
        label: `${item.productCode} ${item.productDescription}`,
      })),
    ];

    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchFarmNCCSaga(action) {
  try {
    const { inputValue, callback } = action.payload;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const farmRes = yield call(
      request,
      `${APIs.getFarmAuto}?pageSize=100&search=${inputValue}`,
      GETOption,
    );
    const supRes = yield call(
      request,
      `${APIs.getsuppliersAuto}?pageSize=100&search=${inputValue}`,
      GETOption,
    );
    const fieldData = [
      ...farmRes.data.map(item => ({
        value: item.plantCode,
        label: item.plantName,
      })),
      ...supRes.data.map(data => ({
        label: data.name1,
        value: data.supplierCode,
      })),
    ];

    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcel() {
  try {
    yield put(setLoading());
    const formValues = yield select(formSubmittedValues());
    const queryParams = {
      plantProcessCode: formValues.org ? formValues.org.value : '',
      customerCode: formValues.customer ? formValues.customer.value : '',
      productCode: formValues.productCode ? formValues.productCode.value : '',
      productName: formValues.productName,
      planningCode: formValues.planningCode
        ? formValues.planningCode.value
        : '',
      planningName: formValues.planningName,
      vendorCode: formValues.vendorCode ? formValues.vendorCode.value : '',
      dateProcess: formValues.date ? formValues.date.toISOString() : '',
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
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

export default function* sagaWatcher() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_TABLE_DATA, fetchTableDataSaga);
  yield takeLatest(
    constants.FETCH_CUSTOMER_AUTOCOMPLETE,
    fetchCustomerAutocompleteSaga,
  );
  yield takeLatest(
    constants.FETCH_SOLDTO_VINMART_AUTOCOMPLETE,
    fetchSoldToVinmartAutocompleteSaga,
  );
  yield takeLeading(
    constants.SUBMIT_CREATE_EXPORT_RECEIPT,
    submitCreateExportReceiptSaga,
  );
  yield takeLeading(constants.FETCH_PRODUCT, fetchProductSaga);
  yield takeLeading(constants.FETCH_FARM_NCC, fetchFarmNCCSaga);
  yield takeLeading(constants.FETCH_PLANNING, fetchPlanning);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
}
