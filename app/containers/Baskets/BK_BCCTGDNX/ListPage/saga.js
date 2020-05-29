/* eslint-disable prettier/prettier */
/* eslint-disable indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import { takeLeading, put, call, all } from 'redux-saga/effects';
import { get } from 'lodash';
import moment from 'moment';
import * as constants from './constants';
import { loadingError, setLoading } from '../../../App/actions';
import * as actions from './actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
  checkStatus,
  requestAuth,
} from '../../../../utils/request';
import { localstoreUtilites } from '../../../../utils/persistenceData';
import { formDataSchema } from './FormSection/formats';
import {
  serializeQueryParams,
  makeSaveFileFunc,
  convertDateString,
} from '../../../App/utils';
import { formatToCurrency } from '../../../../utils/numberUtils';
import { constSchema } from './TableSection/schema';

const APIs = {
  getListReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/export-reports/list-report-search`,
  getBasketCode: `${
    PATH_GATEWAY.MASTERDATA_API
  }/pallet-baskets?pageSize=-1&sortDirection=asc`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/print-import-export`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/list-report-search`,
  getConfig: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/setting/get-by-key?filter[Key]=ImportExportMaxDaysFromAndToFinishDate`,
};

const auth = localstoreUtilites.getAuthFromLocalStorage();
const getQueryParams = (formValues, formData) => {
  const {
    DateFrom,
    DateTo,
    pageSize,
    pageIndex,
    basketCode = { value: '' },
    org,
    Sort = [],
  } = formValues;
  const { orgList } = formData || {};
  const isExistOrgSelected = (org && org.length > 0 && !!org[0]) || false;
  const sort = (Sort.length && `&sort=${Sort.join('&sort=')}`) || '';
  const PlantCode =
    (isExistOrgSelected && org.map(item => item.value).join(',')) ||
    (orgList && orgList.map(item => item.value).join(','));
  return `${serializeQueryParams({
    pageSize,
    pageIndex,
    dateFrom: moment(DateFrom).format('YYYY-MM-DD'),
    dateTo: moment(DateTo).format('YYYY-MM-DD'),
    basketCode: basketCode
      ? basketCode.map(item => item.value).join(',')
      : null,
    plantCode: PlantCode,
  })}${sort}`;
};

export function* fetchFormDataSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const formData = { ...formDataSchema };
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [orgRes, basketRes] = yield all([
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      call(requestAuth, `${APIs.getBasketCode}`, GETOption),
    ]);
    if (
      orgRes.statusCode !== responseCode.ok ||
      !orgRes.data ||
      orgRes.data.length < 1
    ) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }
    const orgList = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
      type: item.organizationType,
    }));
    formData.orgList = orgList;

    const basketList = basketRes.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} ${item.shortName}`,
    }));
    formData.basketCode = basketList;
    const response = yield call(request, `${APIs.getConfig}`, GETOption);
    const configValue = get(response, `data[0].value`, 0);
    if (configValue) {
      formData.ConfigShowDate = configValue;
      formValues.ConfigShowDate = configValue;
    }
    yield put(actions.getFormDataSuccess(formData));
    yield put(actions.submitForm(formValues, formData));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  const { formValues, formData } = action;
  try {
    const queryParams = getQueryParams(formValues, formData);
    const { DateFrom, DateTo } = formValues;
    const requestApi = `${APIs.getListReport}?${queryParams}`;
    yield put(setLoading(true));
    const response = yield call(
      request,
      requestApi,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    // get data
    const data = get(response, 'data.searchDtos', []);
    const formattedValue = value =>
      Number.isNaN(parseFloat(value)) || value === 0
        ? ''
        : formatToCurrency(value);
    const getData = data.map(item => ({
      [constSchema.date]: convertDateString(item.date),
      [constSchema.plantName]: item.plantName,
      [constSchema.basketCode]: item.basketCode,
      [constSchema.basketName]: item.basketName,
      [constSchema.uom]: item.uom,
      [constSchema.importQuantity]: formattedValue(item.importQuantity),
      [constSchema.exportQuantity]: formattedValue(item.exportQuantity),
      [constSchema.waitInventory]: formattedValue(item.waitInventory),
      [constSchema.roadInventory]: formattedValue(item.roadInventory),
    }));
    const totalQuantity = get(response, 'data.totalQuantityDto', []);
    // get total
    let totalRowData = [];
    const totalDto = {
      totalCol: true,
      [constSchema.date]: 'Tổng',
      [constSchema.importQuantity]: formattedValue(
        totalQuantity.totalDto.totalImport,
      ),
      [constSchema.exportQuantity]: formattedValue(
        totalQuantity.totalDto.totalExport,
      ),
      [constSchema.waitInventory]: formattedValue(
        totalQuantity.totalDto.totalWaitInventory,
      ),
      [constSchema.roadInventory]: formattedValue(
        totalQuantity.totalDto.totalRoadInventory,
      ),
    };
    const totalInventoryFist = {
      totalCol: true,
      [constSchema.date]: `Tổng tồn đầu kỳ (${moment(DateFrom).format(
        'DD/MM/YYYY',
      )})`,

      [constSchema.importQuantity]: formattedValue(
        totalQuantity.totalInventoryFist,
      ),
    };
    const totalInventoryLast = {
      totalCol: true,
      [constSchema.date]: `Tổng tồn cuối kỳ (${moment(DateTo).format(
        'DD/MM/YYYY',
      )})`,
      [constSchema.importQuantity]: formattedValue(
        totalQuantity.totalInventoryLast,
      ),
    };
    totalRowData = [totalDto, totalInventoryFist, totalInventoryLast];
    formValues.totalItem = response.meta.count;
    if (!response.data) {
      throw Object({
        message: 'Không lấy được thông tin báo cáo giao dịch',
      });
    }
    yield put(actions.submitFormSuccess(formValues, getData, totalRowData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* printSelectedSaga(action) {
  const { formValues, formData, callback } = action;
  try {
    yield put(setLoading());
    const queryParams = getQueryParams(
      { ...formValues, pageSize: -1 },
      formData,
    );
    const requestApi = `${APIs.print}?${queryParams}`;
    const response = yield call(
      request,
      requestApi,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    checkStatus(response);
    callback(response.data);
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* exportExcelSaga(action) {
  const { formValues, formData } = action;
  try {
    yield put(setLoading());
    const queryParams = getQueryParams(
      { ...formValues, pageSize: -1 },
      formData,
    );
    const requestApi = `${APIs.exportExcel}?${queryParams}`;
    const response = yield call(
      request,
      requestApi,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
      makeSaveFileFunc(),
    );
    checkStatus(response);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* TransactionReportListPageSaga() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
}
