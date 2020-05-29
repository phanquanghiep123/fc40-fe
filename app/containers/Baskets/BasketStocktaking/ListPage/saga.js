/* eslint-disable eqeqeq */
/* eslint-disable indent */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
import { takeLeading, put, call, all } from 'redux-saga/effects';
import moment from 'moment';
import { get } from 'lodash';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../../App/actions';
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
  convertDateTimeString,
} from '../../../App/utils';
import { constSchema } from './TableSection1/schema';
import { formatToCurrency } from '../../../../utils/numberUtils';

const APIs = {
  getListReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-stocktaking/simple-detail`,
  getBasketReport: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-stocktaking/simple`,
  getBasketCode: `${
    PATH_GATEWAY.MASTERDATA_API
  }/pallet-baskets?pageSize=-1&sortDirection=asc`,
  getOrgStocktaking: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/status`,
  getStocktakingType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/stocktaking-type`,
  getAfterStocktaking: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/after-status`,
  print: `${
    PATH_GATEWAY.BFF_SPA_API
  }/basket-stocktaking-report/print-stoctaking-report`,
  exportExcel: `${
    PATH_GATEWAY.BFF_SPA_API
  }/basket-stocktaking-report/export-excel-report`,
  getConfig: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/setting/get-by-key?filter[Key]=StocktakingMaxDaysFromAndToFinishDate`,
  syncReportData: `${
    PATH_GATEWAY.REPORTADAPTER_API
  }/basket-stocktaking/manual-sync`,
};

const auth = localstoreUtilites.getAuthFromLocalStorage();
const getQueryParams = (formValues, formData) => {
  const {
    DateFrom,
    DateTo,
    pageSize,
    pageIndex,
    basketCode,
    orgStocktaking,
    status,
    stocktakingType,
    afterStocktaking,
    isDifference,
    basketStockTakingCode,
    stocktakingRound,
    sort = [],
  } = { ...formValues };
  const strSort = (sort.length && `&sort=${sort.join('&sort=')}`) || '';
  const { orgListStocktaking, listBasketCode } = formData || {};
  const isExistOrgSelected =
    (orgStocktaking && orgStocktaking.length > 0 && !!orgStocktaking[0]) ||
    false;
  const PlantCode =
    (isExistOrgSelected && orgStocktaking.map(item => item.value).join(',')) ||
    (orgListStocktaking &&
      orgListStocktaking.map(item => item.value).join(','));
  const isExistBasketSelected =
    (basketCode && basketCode.length > 0 && !!basketCode[0]) || false;
  const BasketCode =
    (isExistBasketSelected && basketCode.map(item => item.value).join(',')) ||
    (listBasketCode && listBasketCode.map(item => item.value).join(','));
  let statusType = '';
  if (status != 0) {
    statusType = status;
  }
  let stocktakingtype = '';
  if (stocktakingType != 0) {
    stocktakingtype = stocktakingType;
  }
  let afterstocktaking = '';
  if (afterStocktaking != 0) {
    afterstocktaking = afterStocktaking;
  }
  let isdifference = '';
  if (isDifference != false) {
    isdifference = isDifference;
  }
  return `${serializeQueryParams({
    pageSize,
    pageIndex,
    stocktakingDateFrom: moment(DateFrom).format('YYYY-MM-DD'),
    stocktakingDateTo: moment(DateTo).format('YYYY-MM-DD'),
    basketCodes: BasketCode,
    plantCode: PlantCode,
    statusType,
    stocktakingType: stocktakingtype,
    afterStatus: afterstocktaking,
    differenceType: isdifference,
    basketStockTakingCode,
    stocktakingRound,
  })}${strSort}`;
};

export function* fetchFormDataSaga(action) {
  const { formValues, formIsSubmitted } = action;
  try {
    yield put(setLoading());
    const formData = { ...formDataSchema };
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [
      orgRes,
      basketRes,
      statusRes,
      stocktakingTypeRes,
      afterStocktakingRes,
    ] = yield all([
      call(
        request,
        `${APIs.getOrgStocktaking}?userId=${auth.meta.userId}`,
        GETOption,
      ),
      call(requestAuth, `${APIs.getBasketCode}`, GETOption),
      call(requestAuth, `${APIs.getStatus}`, GETOption),
      call(requestAuth, `${APIs.getStocktakingType}`, GETOption),
      call(requestAuth, `${APIs.getAfterStocktaking}`, GETOption),
    ]);
    // get list org Stocktaking
    if (
      orgRes.statusCode !== responseCode.ok ||
      !orgRes.data ||
      orgRes.data.length < 1
    ) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }
    const orgListStocktaking = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
    }));
    formData.orgListStocktaking = orgListStocktaking;
    // get list basket
    const basketList = basketRes.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} ${item.shortName}`,
    }));
    formData.listBasketCode = basketList;
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
    // get stocktakingtype
    if (
      stocktakingTypeRes.statusCode !== responseCode.ok ||
      !stocktakingTypeRes.data ||
      stocktakingTypeRes.data.length < 1
    ) {
      throw Object({
        message:
          stocktakingTypeRes.message || 'Không lấy được danh sách loại kiểm kê',
      });
    }
    if (stocktakingTypeRes.data.length > 1) {
      const allItem = [
        {
          id: 0,
          name: 'Tất cả',
        },
      ];
      stocktakingTypeRes.data = allItem.concat(stocktakingTypeRes.data);
    }
    const stocktakingTypeList = stocktakingTypeRes.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    formData.stocktakingTypeList = stocktakingTypeList;
    // get afterStocktaking
    if (
      afterStocktakingRes.statusCode !== responseCode.ok ||
      !afterStocktakingRes.data ||
      afterStocktakingRes.data.length < 1
    ) {
      throw Object({
        message:
          afterStocktakingRes.message ||
          'Không lấy được danh sách xử lý sau kiểm kê',
      });
    }
    if (afterStocktakingRes.data.length > 1) {
      const allItem = [
        {
          id: 0,
          name: 'Tất cả',
        },
      ];
      afterStocktakingRes.data = allItem.concat(afterStocktakingRes.data);
    }
    const afterStocktakingList = afterStocktakingRes.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    formData.afterStocktakingList = afterStocktakingList;

    const response = yield call(request, `${APIs.getConfig}`, GETOption);
    const configValue = get(response, `data[0].value`, 0);
    formData.ConfigShowDate = configValue || 0;
    formValues.DateFrom = moment(formValues.DateFrom).subtract(
      (!formIsSubmitted && configValue) || 0,
      'days',
    );
    yield put(actions.getFormDataSuccess(formData, formValues));
    yield put(actions.submitForm(formValues, formData));
    yield put(actions.submitFormBasket(formValues, formData));
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
      Number.isNaN(parseFloat(value)) || value === null
        ? ''
        : formatToCurrency(value);
    const items = get(response, 'data.listBasketStocktakingReport', []);
    const getItem = items.map(item => ({
      [constSchema.basketStockTakingCode]: item.basketStockTakingCode,
      [constSchema.statusName]: item.statusName,
      [constSchema.afterStatusName]: item.afterStatusName,
      [constSchema.date]: convertDateTimeString(item.date),
      [constSchema.basketCode]: item.basketCode,
      [constSchema.basketName]: item.basketName,
      [constSchema.plantName]: item.plantName,
      [constSchema.basketLocatorCode]: item.basketLocatorName,
      [constSchema.documentQuantity]: formattedValue(item.documentQuantity),
      [constSchema.stockTakingQuantity]: formattedValue(
        item.stockTakingQuantity,
      ),
      [constSchema.diffferenceQuantity]: formattedValue(
        item.diffferenceQuantity,
      ),
      [constSchema.stocktakingTypeName]: item.stocktakingTypeName,
      [constSchema.stocktakingRound]: item.stocktakingRound,
    }));
    const quantity = get(response, 'data.totalQuantityDto', []);
    let totalRowData = {};
    if (quantity !== null) {
      totalRowData = {
        totalCol: true,
        [constSchema.basketLocatorCode]: 'Tổng',
        [constSchema.documentQuantity]: formattedValue(
          quantity.documentQuantity,
        ),
        [constSchema.stockTakingQuantity]: formattedValue(
          quantity.stockTakingQuantity,
        ),
        [constSchema.diffferenceQuantity]: formattedValue(
          quantity.stockTakingDifferencePhysical,
        ),
      };
    }
    if (!response.data) {
      throw Object({
        message: 'Không lấy được thông tin báo cáo khay sọt kiểm kê',
      });
    }
    formValues.totalItem = response.meta.count;
    yield put(actions.submitFormSuccess(formValues, getItem, totalRowData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormBasketSaga(action) {
  const { formValuesBasket, formData } = action;
  try {
    const queryParams = getQueryParams(formValuesBasket, formData);
    const requestApi = `${APIs.getBasketReport}?${queryParams}`;
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
      Number.isNaN(parseFloat(value)) || value === null
        ? ''
        : formatToCurrency(value);
    const items = get(response, 'data.listBasketStocktakingReport', []);
    const getItem = items.map(item => ({
      [constSchema.basketStockTakingCode]: item.basketStockTakingCode,
      [constSchema.basketCode]: item.basketCode,
      [constSchema.basketName]: item.basketName,
      [constSchema.documentQuantity]: formattedValue(item.documentQuantity),
      [constSchema.quantityByWay]: formattedValue(item.quantityByWay),
      [constSchema.totalDocumentQuantity]: formattedValue(
        item.totalDocumentQuantity,
      ),
      [constSchema.stockTakingQuantity]: formattedValue(
        item.stockTakingQuantity,
      ),
      [constSchema.actualQuantityExported]: formattedValue(
        item.actualQuantityExported,
      ),
      [constSchema.actualStockTakingQuantity]: formattedValue(
        item.actualStockTakingQuantity,
      ),
      [constSchema.difference]: formattedValue(item.difference),
      [constSchema.diffferenceQuantity]: formattedValue(
        item.diffferenceQuantity,
      ),
      [constSchema.stockTakingDifferenceByWay]: formattedValue(
        item.stockTakingDifferenceByWay,
      ),
      [constSchema.absDifference]: formattedValue(item.absDifference),
    }));
    const quantity = get(response, 'data.totalQuantityDto', []);
    let totalRowData = {};
    if (quantity !== null) {
      totalRowData = {
        totalCol: true,
        [constSchema.basketName]: 'Tổng',
        [constSchema.documentQuantity]: formattedValue(
          quantity.documentQuantity,
        ),
        [constSchema.quantityByWay]: formattedValue(quantity.quantityByWay),
        [constSchema.totalDocumentQuantity]: formattedValue(
          quantity.totalDocumentQuantity,
        ),
        [constSchema.stockTakingQuantity]: formattedValue(
          quantity.stockTakingQuantity,
        ),
        [constSchema.actualQuantityExported]: formattedValue(
          quantity.actualQuantityExported,
        ),
        [constSchema.actualStockTakingQuantity]: formattedValue(
          quantity.actualStockTakingQuantity,
        ),
        [constSchema.difference]: formattedValue(quantity.difference),
        [constSchema.diffferenceQuantity]: formattedValue(
          quantity.stockTakingDifferencePhysical,
        ),
        [constSchema.stockTakingDifferenceByWay]: formattedValue(
          quantity.stockTakingDifferenceByWay,
        ),
        [constSchema.absDifference]: formattedValue(quantity.absDifference),
      };
    }
    if (!response.data) {
      throw Object({
        message: 'Không lấy được thông tin kết quả kiểm kê theo mã khay sọt',
      });
    }
    formValuesBasket.totalItemBS = response.meta.count;
    yield put(
      actions.submitFormBasketSuccess(formValuesBasket, getItem, totalRowData),
    );
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

export function* syncReportSaga(action) {
  const { values, submittedValues, submittedValuesBasket } = action.payload;
  const dateTo = new Date();
  try {
    yield put(setLoading(true));
    const body = {
      from: values.dateFrom
        ? moment(values.dateFrom)
            .format('YYYY/MM/DD')
            .toString()
        : null,
      to: moment(dateTo)
        .format('YYYY/MM/DD')
        .toString(),
      requestId: values.requestId,
      plantCode:
        values.plantCode.length !== 0
          ? values.plantCode.map(item => item.value).toString()
          : null,
    };
    const res = yield call(
      request,
      APIs.syncReportData,
      optionReq({
        method: 'POST',
        authReq: true,
        body,
      }),
    );
    checkStatus(res);
    if (res && res.statusCode === responseCode.ok) {
      yield put(actions.submitForm(submittedValues));
      yield put(actions.submitFormBasket(submittedValuesBasket));
      yield put(setLoading(false));
      yield put(showSuccess(res.message || 'Chạy báo cáo thành công'));
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* BasketStocktakingListPageSaga() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.SUBMIT_FORM_BASKET, submitFormBasketSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
  yield takeLeading(constants.SYNC_DATA, syncReportSaga);
}
