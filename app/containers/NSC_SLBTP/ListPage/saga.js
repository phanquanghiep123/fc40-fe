import { takeLeading, put, all, call } from 'redux-saga/effects';
import { get as _get, isEmpty as _isEmpty, filter as _filter } from 'lodash';
import moment from 'moment';
import * as constants from './constants';

import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  METHOD_REQUEST,
  responseCode,
  requestAuth,
} from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { formDataSchema } from './FormSection/formats';
import {
  makeSaveFileFunc,
  serializeQueryParams,
  converYearMonthDay,
  getFarmsWithFromAndTo,
} from '../../App/utils';
import { constSchema, fields } from './TableSection/schema';

const FIX_URL = 'actual-output-reports';
const APIs = {
  getTableData: `${PATH_GATEWAY.REPORTADAPTER_API}/${FIX_URL}/get-report`,
  getFarmData: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  getDetail: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/${FIX_URL}/history-harvest-plant`,
  export: `${PATH_GATEWAY.BFF_SPA_API}/actual-output-report/export-excel`,
  getRegions: `${PATH_GATEWAY.AUTHORIZATION_API}/regions?filter[isActive]=1`,
  getProducts: `${PATH_GATEWAY.MASTERDATA_API}/products/auto-complete`,
  getLSXs: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/production-orders/auto-complete`,
  getConfig: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/setting/get-by-key?filter[Key]=ActualOuputReportMaxDaysFromAndToFinishDate`,
};

const auth = localstoreUtilites.getAuthFromLocalStorage();

const getQueryStr = formValues => {
  const {
    farmIdFrom = { value: '' },
    farmIdTo = { value: '' },
    dateFrom,
    dateTo,
    LSXCodeFrom = { value: '' },
    LSXCodeTo = { value: '' },
    pageSize,
    productCode = { value: '' },
    pageIndex,
    Regions = [],
    productName,
    Farms = [],
    sort = [],
    filterArg,
  } = formValues;
  const strSort = (sort.length && `&sort=${sort.join('&sort=')}`) || '';
  const strplantCode =
    (Farms.length &&
      `&plantCode=${Farms.map(item => item.value).join('&plantCode=')}`) ||
    '';
  const strregionCode =
    (Regions.length &&
      `&regionCode=${Regions.map(item => item.value).join('&regionCode=')}`) ||
    '';
  const mapFilter = filterArg.filter(value => formValues[value]).map(value => {
    if (formValues[value] && typeof formValues[value] === 'object')
      return `filter[${value}]=${formValues[value].value}`;
    return `filter[${value}]=${formValues[value]}`;
  });
  const strFilter = (mapFilter.length && `&${mapFilter.join('&sort=')}`) || '';
  return `${serializeQueryParams({
    fromFarm: _get(farmIdFrom, 'value', ''),
    toFarm: _get(farmIdTo, 'value', ''),
    fromFinishDate: moment(dateFrom).format('YYYY-MM-DD'),
    toFinishDate: moment(dateTo).format('YYYY-MM-DD'),
    fromOrder: _get(LSXCodeFrom, 'value', ''),
    toOrder: _get(LSXCodeTo, 'value', ''),
    productCode: _get(productCode, 'value', ''),
    productName,
    pageSize,
    pageIndex,
  })}${strSort}${strplantCode}${strFilter}${strregionCode}`;
};
export function* fetchFormDataSaga(action) {
  let isRun = false;
  const urlParams = new URL(window.location.href);
  const isRunG = urlParams.searchParams.get('isrun');
  if (isRunG === 'true') {
    isRun = true;
    window.history.replaceState(
      'Object',
      'Ghi nhận sản lượng BTP thực tế',
      '/danh-sach-ghi-nhan-slbtp-thuc-te',
    );
  }
  const { submittedValues } = action;
  const formData = { ...formDataSchema };
  yield put(setLoading());
  try {
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    const [Farms, Regions, Config = {}] = yield all([
      call(
        request,
        `${APIs.getFarmData}?userId=${auth.meta.userId}`,
        GETOption,
      ),
      call(request, `${APIs.getRegions}`, GETOption),
      call(request, `${APIs.getConfig}`, GETOption),
    ]);
    if (
      (Farms && Farms.statusCode !== responseCode.ok) ||
      !Farms.data ||
      Farms.data.length < 1
    ) {
      throw Object({
        message: Farms.message || 'Không lấy được danh sách Farm',
      });
    } else {
      const customFarms = _filter(
        Farms.data,
        item => item.organizationType === 2, // Chỉ lọc theo Farm, NSC có organizationType = 4
      );

      if (customFarms.length < 1) {
        throw Object({
          message: Farms.message || 'Không lấy được danh sách Farm',
        });
      } else {
        formData.Farms = customFarms.map(item => ({
          value: item.value,
          label: `${item.value} ${item.name}`,
        }));
        submittedValues.Farms = formData.Farms;
      }
    }
    if (
      (Regions && Regions.statusCode === responseCode.ok) ||
      (Regions.data && Regions.data.length < 1)
    ) {
      formData.Regions = Regions.data;
      submittedValues.Regions = formData.Regions;
    }
    if ((Config && Config.status !== responseCode.ok) || !Config.data) {
      throw Object({
        message: Config.message || 'Không lấy được giá trị cài đặt',
      });
    } else {
      formData.ConfigShowDate = Config.data[0].value;
      submittedValues.ConfigShowDate = Config.data[0].value;
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
  }
  submittedValues.isSubmit = true;
  submittedValues.isRun = isRun;
  if (submittedValues.isRun === true) {
    yield put(showSuccess(`Chạy báo cáo thành công`));
  }
  yield put(actions.getFormDataSuccess(formData));
  yield put(actions.submitForm(submittedValues));
}

export function* submitFormSaga(action) {
  yield put(setLoading());
  let isRun = false;
  const urlParams = new URL(window.location.href);
  const isRunG = urlParams.searchParams.get('isrun');
  if (isRunG === 'true') {
    isRun = true;
    window.history.replaceState(
      'Object',
      'Ghi nhận sản lượng BTP thực tế',
      '/danh-sach-ghi-nhan-slbtp-thuc-te',
    );
  }
  const { submittedValues } = action;
  const { dateFrom, dateTo } = submittedValues;
  const df = converYearMonthDay(dateFrom);
  const dt = converYearMonthDay(dateTo);
  const numberShowColumnDate = dt.diff(df, 'days') + 1;
  submittedValues.numberShowColumnDate = numberShowColumnDate;
  try {
    const queryStr = getQueryStr(submittedValues);
    const url = `${APIs.getTableData}?${queryStr}`;
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    const response = yield call(request, url, GETOption);
    const pagelist = _get(response, 'data.pagelist', []);
    const pagetotal = _get(response, 'data.pagetotal', {});
    if (pagetotal) {
      pagetotal.is_after = true;
    }
    const { count = 0 } = response.meta;
    const collectionData =
      pagelist != null && pagelist.length > 0 ? [...pagelist, pagetotal] : [];
    submittedValues.totalItem = count;
    const createDataTable = collectionData.map(item => {
      const ListSemiFinishedProducts =
        item[constSchema.ListSemiFinishedProducts];
      const newItem = { ...item };
      if (_isEmpty(ListSemiFinishedProducts) === false) {
        ListSemiFinishedProducts.forEach((element, i) => {
          const key = `date${i}`;
          fields.forEach(field => {
            newItem[`${key}${field.field}`] = element[field.key];
          });
        });
      }
      return newItem;
    });
    yield put(actions.submitFormSuccess(submittedValues, createDataTable));
    if (isRun === true) {
      yield put(showSuccess(`Chạy báo cáo thành công`));
      const formData = submittedValues;
      formData.isRun = false;
      yield put(actions.getFormDataSuccess(formData));
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
  yield put(setLoading(false));
}

export function* exportExcel(action) {
  try {
    yield put(setLoading());
    const { submittedValues } = action;
    const queryStr = getQueryStr(submittedValues);
    const response = yield call(
      request,
      `${APIs.export}?${queryStr}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        authReq: true,
      }),
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
export function* changeOrderSaga(action) {
  const { submittedValues } = action;
  try {
    yield put(setLoading());
    yield put(actions.submitForm(submittedValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getProductAuto(action) {
  try {
    const { inputText, callback } = action;
    const response = yield call(
      requestAuth,
      `${APIs.getProducts}?search=${inputText}`,
    );
    const fieldData = [
      ...response.map(item => ({
        value: item.productCode,
        label: `${item.productCode} ${item.productDescription}`,
      })),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getProductionOrderAuto(action) {
  try {
    const { inputText, Farms, farmIdFrom, farmIdTo, callback } = action;
    const newList = getFarmsWithFromAndTo(Farms, farmIdFrom, farmIdTo).map(
      item => item.value,
    );
    const stringPlanCode = newList
      ? `&plantCode=${newList.join('&plantCode=')}`
      : '';
    const url = `${APIs.getLSXs}?userId=${
      auth.meta.userId
    }&search=${inputText}${stringPlanCode}`;
    const response = yield call(requestAuth, url);
    const fieldData = [
      ...response.map(item => ({
        value: item.productionOrderCode,
        label: `${item.productionOrderCode} ${
          item.productName ? item.productName : ''
        }`,
      })),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* OutputOfSemiFinishedListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.GET_PRODUCT_AUTO, getProductAuto);
  yield takeLeading(constants.GET_LSX_AUTO, getProductionOrderAuto);
}
