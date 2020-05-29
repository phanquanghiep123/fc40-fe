/* eslint-disable indent */
import { takeLeading, put, all, call } from 'redux-saga/effects';
import { startOfDay } from 'date-fns';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  requestAuth,
} from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import {
  convertDateString,
  makeSaveFileFunc,
  serializeQueryParams,
} from '../../App/utils';

const forecastingApi = 'forecasting-api/api/v1';
const APIs = {
  getFarmsByUser: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getProducts: `${PATH_GATEWAY.MASTERDATA_API}/products/auto-complete`, // ?search=${inputText}
  getLSX: `${PATH_GATEWAY.MASTERDATA_API}/production-orders/auto-complete`, // ?search=${inputText}&&userId={}
  getSettings: `${forecastingApi}/settings`,
  getTableData: `${forecastingApi}/quantity-plan`,
  postImportCSV: `${forecastingApi}/quantity-plan/import-quantity-plan`,
  postQuantity: `${forecastingApi}/quantity-plan`, // /{id} - PUT
  getExportExcel: `${forecastingApi}/quantity-plan/export-excel`,
};

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    const auth = localstoreUtilites.getAuthFromLocalStorage();
    let updatedFormValues = null;

    if (fetchNew) {
      const GETOption = optionReq({ method: 'GET', authReq: true });
      const { userId } = auth.meta;

      const [farmRes, configRes] = yield all([
        call(
          request,
          `${APIs.getFarmsByUser}?userId=${userId}&plantType=2`,
          GETOption,
        ),
        call(
          request,
          `${APIs.getSettings}?key=QuantityPlanDateRange`,
          GETOption,
        ),
      ]);

      if (farmRes.statusCode !== 200 || !farmRes.data) {
        yield put(
          loadingError(farmRes.message || 'Không tải được danh sách Farm'),
        );
      }

      if (configRes.statusCode !== 200 || !configRes.data) {
        yield put(
          loadingError(
            configRes.message || 'Không tải được cài đặt giới hạn ngày',
          ),
        );
      }

      const farmOptions = farmRes.data
        ? farmRes.data.map(item => ({
            value: item.value,
            label: `${item.value} ${item.name}`,
          }))
        : [];

      const formData = {
        farmFrom: farmOptions,
        farmTo: farmOptions,
        maxDateRange: parseInt(configRes.data, 10),
        plants: farmOptions.map(item => item.value).join(','),
        plantArray: farmOptions.map(item => item.value),
      };

      yield put(actions.fetchFormDataSuccess(formData));

      updatedFormValues = {
        ...formValues,
        // farmFrom: formData.farmFrom[0] || null,
        // farmTo: formData.farmTo[0] || null,
        plants: formData.plants,
        maxDateRange: parseInt(configRes.data, 10),
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
    const { formValues } = action;

    const sortKeyMapping = {
      productionOrder: 'productionOrder',
      productCode: 'productCode',
      productName: 'productName',
      plantCode: 'plantCode',
      plantName: 'plantName',
    };
    const sortKey = sortKeyMapping[formValues.sortKey] || '';
    const sortType =
      sortKey &&
      formValues.sortType &&
      formValues.sortType.toLowerCase() === 'desc'
        ? '-'
        : '';

    const queryParams = {
      fromFarm: formValues.farmFrom ? formValues.farmFrom.value : '',
      toFarm: formValues.farmTo ? formValues.farmTo.value : '',
      fromOrder: formValues.lsxFrom ? formValues.lsxFrom.value : '',
      toOrder: formValues.lsxTo ? formValues.lsxTo.value : '',
      fromDate: formValues.dateFrom
        ? startOfDay(formValues.dateFrom).toISOString()
        : '',
      toDate: formValues.dateTo
        ? startOfDay(formValues.dateTo).toISOString()
        : '',
      productCode: formValues.productCode ? formValues.productCode.value : '',
      productName: formValues.productName,
      plants: formValues.plants,

      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      sort: `${sortType}${sortKey}`,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(requestAuth, `${APIs.getTableData}?${queryStr}`);

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Không tải được dữ liệu' });
    }

    const spreadData = res.data.map(row => {
      const updatedRow = {
        ...row,
        productionOrder: row.productionOrder,
        projectedQuantity: null,
      };

      /* spread date columns */
      row.quantityDtos.forEach(col => {
        const dateString = convertDateString(col.planDate);
        updatedRow[`date_${dateString}`] = col;
      });

      return updatedRow;
    });

    formValues.count = res.meta.count;

    yield put(actions.fetchTableDataSuccess(formValues, spreadData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcelSaga(action) {
  try {
    yield put(setLoading());
    const { submittedValues: val } = action;

    // Mapping keys to match server params
    const queryParams = {
      fromFarm: val.farmFrom ? val.farmFrom.value : null,
      toFarm: val.farmTo ? val.farmTo.value : null,
      fromOrder: val.lsxFrom,
      toOrder: val.lsxTo,
      fromDate: val.dateFrom ? startOfDay(val.dateFrom).toISOString() : null,
      toDate: val.dateTo ? startOfDay(val.dateTo).toISOString() : null,
      productCode: val.productCode,
      productName: val.productName,
      plants: val.plants,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getExportExcel}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
      makeSaveFileFunc(),
    );

    if (res.statusCode && res.statusCode !== 200) {
      throw Object({ message: res.message || 'Xuất Excel không thành công' });
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* importCSVSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, searchFormValues } = action;

    const formData = yield new FormData();
    yield formData.append('uploadingFile', formValues.fileData);

    const res = yield call(
      request,
      `${APIs.postImportCSV}`,
      optionReq({ method: 'POST', body: formData, authReq: true }),
      makeSaveFileFunc(),
    );

    if (res.statusCode !== 200) {
      yield put(loadingError(res.message || 'Tải lên không thành công'));
    } else {
      yield put(actions.fetchTableData(searchFormValues)); // re-fetch table data
      yield put(showSuccess(res.message || 'Tải lên thành công'));
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchProductsAutocompleteSaga(action) {
  try {
    const { inputValue, callback } = action;

    let res = yield call(
      requestAuth,
      `${APIs.getProducts}?search=${inputValue}`,
    );

    if (!res) {
      callback(null);
      throw Object({ message: 'Không lấy được dữ liệu' });
    }

    // limit result to 100
    if (res.length > 100) res = res.slice(0, 100);

    const fieldData = res
      ? res.map(item => ({
          value: item.productCode,
          label: `${item.productCode} ${item.productDescription}`,
        }))
      : [];

    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchLSXAutocompleteSaga(action) {
  try {
    const { inputValue, plantArray, callback } = action;
    const auth = localstoreUtilites.getAuthFromLocalStorage();
    const queryParams = {
      search: inputValue,
      userId: auth.meta.userId,
    };

    const plantCodeStr = `&plantCode=${plantArray.join('&plantCode=')}`;
    const queryStr = serializeQueryParams(queryParams) + plantCodeStr;

    let res = yield call(requestAuth, `${APIs.getLSX}?${queryStr}`);
    if (!res) {
      callback(null);
      throw Object({ message: 'Không lấy được dữ liệu' });
    }

    // limit result to 100
    if (res.length > 100) res = res.slice(0, 100);

    const fieldData = res
      ? res.map(item => ({
          value: item.productionOrderCode,
          label: `${item.productionOrderCode || ''} ${item.productName || ''}`,
        }))
      : [];

    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* updateQuantitySaga(action) {
  try {
    yield put(setLoading());
    const { updateValues, submittedSearchValues } = action;

    const body = {
      id: updateValues.id,
      quantity: updateValues.quantity,
      note: updateValues.note,
      planDate: updateValues.planDate
        ? startOfDay(new Date(updateValues.planDate)).toISOString()
        : null,

      plantCode: updateValues.plantCode,
      productionOrder: updateValues.productionOrder,
      productCode: updateValues.productCode,
    };

    const res = yield call(
      request,
      `${APIs.postQuantity}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({ message: res.message || 'Cập nhật không thành công' });
    }

    yield put(showSuccess(res.message || 'Cập nhật thành công'));
    yield put(actions.fetchTableData(submittedSearchValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* RetailListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_TABLE_DATA, fetchTableDataSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.IMPORT_CSV, importCSVSaga);
  yield takeLeading(constants.FETCH_PRODUCTS_AC, fetchProductsAutocompleteSaga);
  yield takeLeading(constants.FETCH_LSX_AC, fetchLSXAutocompleteSaga);
  yield takeLeading(constants.UPDATE_QUANTITY, updateQuantitySaga);
}
