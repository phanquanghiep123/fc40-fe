/* eslint-disable eqeqeq */
/* eslint-disable indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import { takeLeading, put, call, all } from 'redux-saga/effects';
import moment from 'moment';
import { get } from 'lodash';
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
import { constSchema } from './TableSection/schema';
import { formatToCurrency } from '../../../../utils/numberUtils';

const APIs = {
  getListReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/borrow-reports/borrow-lend-data-search`,
  getBasketCode: `${
    PATH_GATEWAY.MASTERDATA_API
  }/pallet-baskets?pageSize=-1&sortDirection=asc`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  getVendorType: `${PATH_GATEWAY.REPORTADAPTER_API}/borrow-reports/get-vendor`,
  getStatus: `${PATH_GATEWAY.REPORTADAPTER_API}/borrow-reports/get-status`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/print-borrow`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/borrow-report/export-excel`,
  getVendor: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/borrow-reports/get-auto-complete-vendor`,
  getConfig: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/setting/get-by-key?filter[Key]=BorrowLendMaxDaysFromAndToFinishDate`,
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
    status,
    vendorType,
    vendor = { value: '' },
  } = formValues;
  const { orgList } = formData || {};
  const isExistOrgSelected = (org && org.length > 0 && !!org[0]) || false;
  const PlantCode =
    (isExistOrgSelected && org.map(item => item.value).join(',')) ||
    (orgList && orgList.map(item => item.value).join(','));
  let statusType = '';
  if (status != 0) {
    statusType = status;
  }
  let vendortype = '';
  if (vendorType != 0) {
    vendortype = vendorType;
  }
  const sort = (Sort.length && `&sort=${Sort.join('&sort=')}`) || '';
  return `${serializeQueryParams({
    pageSize,
    pageIndex,
    dateFrom: moment(DateFrom).format('YYYY-MM-DD'),
    dateTo: moment(DateTo).format('YYYY-MM-DD'),
    basketCode: basketCode
      ? basketCode.map(item => item.value).join(',')
      : null,
    plantCode: PlantCode,
    statusType,
    vendorType: vendortype,
    vendorCode: vendor !== null ? vendor.value : '',
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
    const [orgRes, basketRes, vendorTypeRes, statusRes] = yield all([
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      call(requestAuth, `${APIs.getBasketCode}`, GETOption),
      call(requestAuth, `${APIs.getVendorType}`, GETOption),
      call(requestAuth, `${APIs.getStatus}`, GETOption),
    ]);
    // get list org
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
    }));
    formData.orgList = orgList;
    // get list basket
    const basketList = basketRes.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} ${item.shortName}`,
    }));
    formData.basketCode = basketList;
    // get list vendor style
    if (
      vendorTypeRes.statusCode !== responseCode.ok ||
      !vendorTypeRes.data ||
      vendorTypeRes.data.length < 1
    ) {
      throw Object({
        message:
          vendorTypeRes.message || 'Không lấy được danh sách loại vendor',
      });
    }
    if (vendorTypeRes.data.length > 1) {
      const allItem = [
        {
          id: 0,
          name: 'Tất cả',
        },
      ];
      vendorTypeRes.data = allItem.concat(vendorTypeRes.data);
    }
    const vendorType = vendorTypeRes.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    formData.vendorTypeList = vendorType;
    // get list status
    if (
      statusRes.statusCode !== responseCode.ok ||
      !statusRes.data ||
      statusRes.data.length < 1
    ) {
      throw Object({
        message: statusRes.message || 'Không lấy được danh sách trạng thái',
      });
    }
    if (statusRes.data.length > 1) {
      const allItem = [
        {
          id: 0,
          name: 'Tất cả',
        },
      ];
      statusRes.data = allItem.concat(statusRes.data);
    }
    const status = statusRes.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    formData.statusList = status;
    const response = yield call(request, `${APIs.getConfig}`, GETOption);
    const configValue = get(response, `data[0].value`, 0);
    if (configValue) {
      formData.ConfigShowDate = configValue;
      formValues.ConfigShowDate = configValue;
    }
    yield put(actions.getFormDataSuccess(formData));
    yield put(actions.submitForm(formValues, formData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  const { formValues, formData } = action;
  try {
    const queryParams = getQueryParams(formValues, formData);
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
    const formattedValue = value =>
      Number.isNaN(parseFloat(value)) || value === 0
        ? ''
        : formatToCurrency(value);
    const items = get(response, 'data.items', []);
    const getItem = items.map(item => ({
      [constSchema.processDate]: convertDateString(item.processDate),
      [constSchema.plantCode]: item.plantCode,
      [constSchema.plantName]: item.plantName,
      [constSchema.vendorTypeName]: item.vendorTypeName,
      [constSchema.vendorCode]: item.vendorCode,
      [constSchema.vendorName]: item.vendorName,
      [constSchema.basketCode]: item.basketCode,
      [constSchema.basketName]: item.basketName,
      [constSchema.uom]: item.uom,
      [constSchema.borrowBasketQuantity]: formattedValue(
        item.borrowBasketQuantity,
      ),
      [constSchema.lendBasketQuantity]: formattedValue(item.lendBasketQuantity),
      [constSchema.netOff]: formattedValue(item.netOff),
      [constSchema.status]: item.status,
    }));
    const quantity = get(response, 'data', []);
    let totalRowData = {};
    if (quantity !== null) {
      totalRowData = {
        totalCol: true,
        [constSchema.processDate]: 'Tổng',
        [constSchema.borrowBasketQuantity]: formattedValue(
          quantity.totalBorrowQuantity,
        ),
        [constSchema.lendBasketQuantity]: formattedValue(
          quantity.totalLendQuantity,
        ),
        [constSchema.netOff]: formattedValue(quantity.totalNetOff),
      };
    }
    if (!response.data) {
      throw Object({
        message:
          'Không lấy được thông tin báo cáo số lượng khay sọt mượn/ cho mượn',
      });
    }
    formValues.totalItem = response.meta.count;
    yield put(actions.submitFormSuccess(formValues, getItem, totalRowData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchVendorSaga(action) {
  try {
    const { inputValue, vendorType, callback } = action;

    const stringVendorCode = (!!vendorType && `&type=${vendorType}`) || '';
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const response = yield call(
      request,
      `${APIs.getVendor}?keyword=${inputValue}${stringVendorCode}`,
      GETOption,
    );

    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin mã khay sọt' });
    }
    const fieldData = response.data
      ? response.data.map(item => ({
          value: item.code,
          label: `${item.code} ${item.name}`,
        }))
      : [];
    yield callback(fieldData);
    yield put(actions.fetchVendorCodeSuccess(fieldData));
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

export default function* BorrowBasketReportListPageSaga() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_VENDOR_CODE, fetchVendorSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
}
