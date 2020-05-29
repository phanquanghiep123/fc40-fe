import { takeLeading, put, all, call } from 'redux-saga/effects';
import { get, filter, isEmpty, findIndex, slice } from 'lodash';
import moment from 'moment';
import * as constants from './constants';
import { loadingError, setLoading } from '../../App/actions';
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
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';
import { constSchema } from './TableSection/schema';

const FIX_URL = 'harvest-plant';
const APIs = {
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/${FIX_URL}/list-harvest-plant`,
  getFarmData: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getDetail: `${PATH_GATEWAY.FORECASTING_API}/${FIX_URL}/history-harvest-plant`, // ?ProductionOrderCode={ProductionOrderCode},?FinishDate={FinishDate},?ProductCode={ProductCode}
  export: `${PATH_GATEWAY.BFF_SPA_API}/${FIX_URL}/export-excel-harvest-plant`,
  exportHistory: `${
    PATH_GATEWAY.BFF_SPA_API
  }/${FIX_URL}/export-excel-history-harvest-plant`,
  getRegions: `${PATH_GATEWAY.AUTHORIZATION_API}/regions?filter[isActive]=1`,
  getProducts: `${PATH_GATEWAY.MASTERDATA_API}/products/auto-complete`, // ?search=${inputText}
  getLSXs: `${PATH_GATEWAY.MASTERDATA_API}/production-orders/auto-complete`, // ?search=${inputText}
  getConfig: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/setting/get-by-key?filter[Key]=HarvestPlantMaxDateFromFinishDateToFinishDate`, // ?search=${inputText}
};

const auth = localstoreUtilites.getAuthFromLocalStorage();
const mappingDate = date =>
  moment([date.getFullYear(), date.getMonth(), date.getDate()]);

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
    fromFarm: get(farmIdFrom, 'value', ''),
    toFarm: get(farmIdTo, 'value', ''),
    fromFinishDate: moment(dateFrom).format('YYYY-MM-DD'),
    toFinishDate: moment(dateTo).format('YYYY-MM-DD'),
    fromOrder: get(LSXCodeFrom, 'value', ''),
    toOrder: get(LSXCodeTo, 'value', ''),
    productCode: get(productCode, 'value', ''),
    productName,
    pageSize,
    pageIndex,
  })}${strSort}${strplantCode}${strFilter}${strregionCode}`;
};

export function* fetchFormDataSaga(action) {
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
      !Farms ||
      ((Farms && Farms.statusCode !== responseCode.ok) || !Farms.data)
    ) {
      throw Object({
        message: Farms.message || 'Không lấy được danh sách Farm',
      });
    }

    const customFarms = filter(
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
        label: item.name,
      }));
      submittedValues.Farms = formData.Farms;
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
  } catch (e) {
    yield put(setLoading(false));
  }
  submittedValues.isSubmit = true;
  yield put(actions.getFormDataSuccess(formData));
  yield put(actions.submitForm(submittedValues));
  yield put(setLoading(false));
}
export function* submitFormSaga(action) {
  const { submittedValues } = action;
  const { dateFrom, dateTo } = submittedValues;
  const df = mappingDate(dateFrom);
  const dt = mappingDate(dateTo);
  const numberShowColumnDate = dt.diff(df, 'days');
  submittedValues.numberShowColumnDate = numberShowColumnDate;
  try {
    yield put(setLoading());
    const queryStr = getQueryStr(submittedValues);
    const url = `${APIs.getTableData}?${queryStr}`;
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    const response = yield call(request, url, GETOption);
    const harvestPlants = get(response, 'data.harvestPlants', []);
    let masterData = [];
    submittedValues.totalItem = 0;
    if (harvestPlants) {
      const total = get(response, 'data.total', {});
      const { count = 0 } = response.meta;
      const {
        plannedQuantity,
        color,
        plannedDate,
      } = constSchema.forcastingQuantityItem;
      const footer = {
        [constSchema.regionName]: 'Tổng cộng',
        [constSchema.plannedQuantity]: total.planningQuantity,
        [constSchema.orderQuantity]: total.targetQuantity,
        is_after: true,
        [constSchema.forcastingQuantity]: total.totalQuantityFinishDate.map(
          item => ({
            [plannedQuantity]: item.totalQuantity > 0 ? item.totalQuantity : '',
            finishDate: item.finishDate,
          }),
        ),
      };
      const collectionData = [...harvestPlants, footer];
      if (count > 0) {
        masterData = collectionData.map(item => {
          const forcastingQuantityItems = item[constSchema.forcastingQuantity];
          let customItem = { ...item };
          forcastingQuantityItems.forEach((element, key) => {
            customItem = {
              ...customItem,
              [`date${key}`]: element[plannedQuantity],
              [`date${key}_color`]: element[color],
              [`date${key}_value`]: element[plannedDate],
            };
          });

          return customItem;
        });
      }
      submittedValues.totalItem = count;
    }
    yield put(actions.submitFormSuccess(submittedValues, masterData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(actions.submitFormSuccess(submittedValues, []));
    yield put(setLoading(false));
  }
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
export function* exportHistoryExcel(action) {
  yield put(setLoading());
  const { submittedValues } = action;
  const queryStr = getQueryStr(submittedValues);
  const response = yield call(
    request,
    `${APIs.exportHistory}?${queryStr}`,
    optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    }),
    makeSaveFileFunc(),
  );
  if (response.status !== 200) {
    yield put(loadingError(response.message || 'Có lỗi xảy ra khi xuất file'));
  }
  yield put(setLoading(false));
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
export function* getItemSaga(action) {
  const { item, callback } = action;
  yield put(setLoading());
  try {
    const url = `${APIs.getDetail}?productionOrderCode=${
      item[constSchema.productionOrderCode]
    }&finishDate=${item[constSchema.finishDate]}&productCode=${
      item[constSchema.productCode]
    }`;
    const response = yield call(
      request,
      url,
      optionReq({
        method: METHOD_REQUEST.GET,
        authReq: true,
      }),
    );
    let masterData = [];
    if (response.status !== responseCode.ok || response.data.length < 1) {
      throw Object({ message: response.message || 'Có lỗi xảy ra.' });
    } else {
      masterData = response.data;
    }
    callback(masterData);
  } catch (e) {
    yield put(setLoading(false));
  }
  yield put(setLoading(false));
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

const getFarmsWithFromAndTo = (farms = [], from = null, to = null) => {
  if (isEmpty(farms) || (!from && !to)) return farms;
  const startIndex = from ? findIndex(farms, obj => obj.value === from) : 0;
  const toIndex = to ? findIndex(farms, obj => obj.value === to) : startIndex;
  const lenght = toIndex > startIndex ? toIndex : startIndex;
  return slice(farms, startIndex, lenght + 1);
};

export function* getLSXAuto(action) {
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
export default function* RetailListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
  yield takeLeading(constants.GET_ITEM, getItemSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.EXPORT_HISTORY_EXCEL, exportHistoryExcel);
  yield takeLeading(constants.GET_PRODUCT_AUTO, getProductAuto);
  yield takeLeading(constants.GET_LSX_AUTO, getLSXAuto);
}
