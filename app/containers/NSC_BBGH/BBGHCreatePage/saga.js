/* eslint-disable no-shadow */
/* eslint-disable no-bitwise */
/**
 * Gets the repositories of the user from Github
 */

import {
  call,
  put,
  all,
  select,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';

import { loadingError, setLoading } from 'containers/App/actions';
import { localstoreUtilites } from 'utils/persistenceData';
import { transformBaskets } from 'components/GoodsWeight/utils';
import moment from 'moment';
import request, {
  optionReq,
  requestAuth,
  METHOD_REQUEST,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import {
  CREATE_BBGH_FARM,
  GET_INIT_CREATED_BBGH,
  GET_USER_AUTOCOMPLETE,
  GET_FARM_NSC_AUTO,
  GET_PROD_ORDER_AUTO,
  GET_FARM_PRODUCT_AUTO,
  GET_FINISH_PRODUCTS_AUTO,
  GET_SHIPPER_AUTO,
  GET_LEADTIME_REGULAR,
  TYPE_BBGH,
  CHANGE_SELECTED_UNIT,
  TYPE_SUPERVIOR,
  GET_PLAN_AUTO,
  GET_SUGGEST_SEARCH,
  GET_PROD_ORDER_BY_SUGGEST_AUTO,
} from './constants';
import {
  createBBGHSuccess,
  getInitCreatedBBGHSuccess,
  getLeadtimeSuccess,
  changeSelectedUnitSuccess,
  changeSubmitSuggest,
  setDataSuggestSearch,
} from './actions';
import { initialSchema } from './BBGHDetailsSchema';
import { makeSelectTypeBBGHSelected } from './selectors';
import { resetCurrentTime } from '../../../utils/datetimeUtils';
import { masterRoutine } from './routines';
import { constructorListTable } from './Dialogs/Schema';
import { serializeQueryParams } from '../../App/utils';
const auth = localstoreUtilites.getAuthFromLocalStorage();
const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;

export function* createBBGHFarm(action) {
  const selectedBBGHType = yield select(makeSelectTypeBBGHSelected());
  const body = action.BBGH;
  const actionTime = new Date();
  body.stockReceivingDateTime = resetCurrentTime(
    action.BBGH.stockReceivingDateTime,
    actionTime,
  );
  body.deliveryDateTime = resetCurrentTime(
    action.BBGH.deliveryDateTime,
    actionTime,
  );
  body.doWorkingUnitCode = body.doWorkingUnitCode.value;
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/deliveryOrders/${
        action.organizationType === TYPE_BBGH.NCC_TO_NSC ||
        selectedBBGHType === TYPE_BBGH.NCC_TO_NSC
          ? 'business-management'
          : 'farm'
      }`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body,
        authReq: true,
      }),
    );

    if (res.status === responseCode.badRequest) {
      throw Object({ message: res.title });
    }

    if (res.statusCode === responseCode.error) {
      throw Object({ message: res.message });
    }

    if (res.statusCode === responseCode.badRequest) {
      throw Object({ message: res.message });
    }

    // go back pre page
    yield put(createBBGHSuccess(res));
    yield put(action.callback());
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getInitMaster() {
  try {
    yield put(setLoading());

    const [resBaskets, resProcessTypes, resReason] = yield all([
      call(
        requestAuth,
        `${MASTER_URL}/pallet-baskets?pageSize=-1&sortDirection=asc`, // Danh sách baskets
      ),
      call(
        requestAuth,
        `${MASTER_URL}/master-code?parentCode=9`, // Phân loại xử lý
      ),
      call(
        requestAuth,
        `${MASTER_URL}/master-code?parentCode=21`, // Nguyên nhân vận chuyển theo Leadtime
      ),
    ]);

    if (!resProcessTypes[0] || !resProcessTypes[0].childs) {
      throw Object({ message: 'Không lấy được Phân loại xử lý' });
    }

    const payload = {
      baskets: transformBaskets(resBaskets.data),
      processTypes: resProcessTypes[0].childs.map(item => ({
        value: item.id,
        label: item.name,
      })),
      reasons: resReason[0].childs.map(item => ({
        value: item.id,
        label: item.name,
      })),
    };
    yield put(masterRoutine.success(payload));

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getInitCreatedBBGH() {
  try {
    // Call typeBBGH and units by id of user have login
    const [resUnits, resSuppliers, resVehicleRoute] = yield all([
      call(
        request,
        `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user?userId=${
          auth.meta.userId
        }`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      // section 6
      call(
        request,
        `${
          PATH_GATEWAY.RESOURCEPLANNING_API
        }/transporters/zone-region?pageSize=-1`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/deliveryorders/vehicle-route`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
    ]);

    // data
    if (!resUnits.data || !resUnits.data.length) {
      throw Object({ message: 'Không lấy được danh sách đơn vị' });
    }

    if (!resSuppliers) {
      throw Object({ message: 'Không lấy được danh sách bên vận chuyển' });
    }

    if (!resVehicleRoute.data) {
      throw Object({ message: 'Không lấy được loại xe tuyến' });
    }

    // filter get format {value, label}
    const units = resUnits.data.map(unit => ({
      value: unit.value,
      label: unit.name,
    }));

    const unitRegions = {};
    resUnits.data.forEach(unit => {
      unitRegions[unit.value] = {
        ...unit.region,
        organizationType: unit.organizationType, // farm/NSC/NCC
      };
    });

    const suppliers = resSuppliers.map(sup => ({
      value: sup.transporterCode,
      label: sup.fullName,
    }));

    // fake test
    // suppliers.push({ label: 'Nhà vận chuyển 1', value: 12 });

    const [resTypeBBGH] = yield all([
      call(
        request,
        `${PATH_GATEWAY.MASTERDATA_API}/master-code?parentCode=1&unitCode=${
          units[0].value
        }`, // parentCode: 1. type BBGH
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
    ]);

    if (!(resTypeBBGH[0] && resTypeBBGH[0].childs)) {
      throw Object({ message: 'Không lấy được loại biên bản giao hàng' });
    }

    // test case loai BBGH
    // resTypeBBGH[0].childs[0].id = 6;
    const types = resTypeBBGH[0].childs;
    const first = units[0];
    // set initialSchema
    const schema = Object.assign({}, initialSchema);
    schema.doWorkingUnitCode = first;
    schema.deliverCode = units[0].value;
    schema.deliveryName = units[0].label;
    schema.doType = types[0].id;
    schema.doWorkingUnitName = units[0].label;
    schema.regionName = resUnits.data[0].region.name;

    // NCC to NSC
    if (
      types[0].id === TYPE_BBGH.NCC_TO_NSC ||
      types[0].id === TYPE_BBGH.FARM_POST_HARVEST
    ) {
      schema.receiverCode = units[0].value;
      schema.receiverName = units[0].label;
      schema.receivingPersonName = auth.meta.fullName;
      schema.receivingPersonPhone = auth.meta.phoneNumber;
      schema.receivingPersonCode = auth.meta.userId;
    }

    if (types[0].id === TYPE_BBGH.NCC_TO_NSC) {
      schema.deliveryPersonPhone = '';
      schema.deliveryPersonName = '';
      schema.deliverCode = '';
      schema.deliveryName = '';
    }

    yield put(
      getInitCreatedBBGHSuccess(
        resTypeBBGH[0].childs.filter(
          type => ![TYPE_BBGH.PLANT_TO_PLANT_CODE_4, 5].includes(type.id),
        ),
        units,
        schema,
        suppliers,
        unitRegions,
        resVehicleRoute.data.map(route => ({
          value: {
            id: route.vehicleRouteCode,
            minStandardTemperature: route.minStandardTemperature,
            maxStandardTemperature: route.maxStandardTemperature,
          },
          label: route.vehicleType,
        })),
      ),
    );
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* changeSelectedUnit(action) {
  try {
    yield put(setLoading());
    const resTypeBBGH = yield call(
      request,
      `${PATH_GATEWAY.MASTERDATA_API}/master-code?parentCode=1&unitCode=${
        action.selectedUnit
      }`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (!(resTypeBBGH[0] && resTypeBBGH[0].childs)) {
      throw Object({ message: 'Không lấy được loại biên bản giao hàng' });
    }

    action.callback(resTypeBBGH[0].childs);

    yield put(
      changeSelectedUnitSuccess(
        action.selectedUnit,
        resTypeBBGH[0].childs.filter(
          type => ![TYPE_BBGH.PLANT_TO_PLANT_CODE_4, 5].includes(type.id),
        ),
      ),
    );
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getLeadtimeRegular(action) {
  try {
    yield put(setLoading());
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.MASTERDATA_API
      }/regulated-shipping-leadtime?deliveryCode=${
        action.deliveryCode
      }&receiveCode=${
        action.receiveCode
      }&pageNumber=1&pageSize=10&sortColumn=0&sortDirection=desc`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (!(res && res.data)) {
      throw Object({ message: 'Không lấy được danh sách leadtime' });
    }

    const leadtimes = res.data.map(leadtime => ({
      value: leadtime.drivingDuration,
      label: leadtime.regulatedDepartureHour,
    }));

    yield put(getLeadtimeSuccess(leadtimes));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getUserAutoComplete(action) {
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/user/get-by-org?orgId=${
        action.farmNscId
      }&filterName=${action.inputText}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (res && res.data.length !== 0) {
      action.callback(
        res.data.map(item => ({
          value: item.Id,
          label: `${item.lastName} ${item.firstName}`,
        })),
      );
    } else {
      action.callback([{ label: '', value: '' }]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getFarmNSCAutocomplete(action) {
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants/auto-complete?name=${
        action.inputText
      }&type=${action.typeBBGH}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (res) {
      if (Array.isArray(res)) {
        action.callback(res);
      } else if (Array.isArray(res.data)) {
        action.callback(res.data);
      } else {
        action.callback([{ label: '', value: '' }]);
      }
    } else {
      action.callback([{ label: '', value: '' }]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/**
 * [Farm] Auto complete LSX
 */
export function* getProdOrderAuto(action) {
  try {
    const { params, inputText, callback } = action;

    let requestURL = `${MASTER_URL}/farm-production-orders/auto-complete?search=${inputText}`;
    if (params && params.unitCode) {
      requestURL += `&unitCode=${params.unitCode}`;
    }

    // Version v8.0
    if (params && params.unitCodeReceived) {
      requestURL += `&unitCodeReceived=${params.unitCodeReceived}`;
    }

    const response = yield call(requestAuth, requestURL);
    callback(response);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}
export function* getProdOrderBySuggestAuto(action) {
  try {
    const { params, inputText, callback } = action;

    let requestURL = `${MASTER_URL}/farm-production-orders/auto-complete?search=${inputText}`;
    if (params && params.unitCode) {
      requestURL += `&unitCode=${params.unitCode}`;
    }

    // Version v8.0
    if (params && params.unitCodeReceived) {
      requestURL += `&unitCodeReceived=${params.unitCodeReceived}`;
    }

    const response = yield call(requestAuth, requestURL);
    const data = response.map(item => ({
      value: item.farmProdOrderCode,
      label: `${item.farmProdOrderCode} ${item.materialDescription}`,
    }));
    callback(data);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}
/**
 * [Farm/NCC] Auto complete Mã đi hàng
 */
export function* getFarmProductAuto(action) {
  try {
    const { params, inputText, callback } = action;

    let requestURL = `${MASTER_URL}/farm-production-orders/get-products?search=${inputText}`;

    // [Farm]
    if (params && params.unitCode) {
      requestURL += `&unitCode=${params.unitCode}`;
    }
    if (params && params.unitCodeReceived) {
      requestURL += `&unitCodeReceived=${params.unitCodeReceived}`;
    }
    if (params && typeof params.isTranscoding === 'boolean') {
      requestURL += `&productionSupervior=${
        params.isTranscoding
          ? TYPE_SUPERVIOR.BY_CODE
          : TYPE_SUPERVIOR.BY_PRODUCT
      }`;
    }

    // [NCC]
    if (params && params.isNCC) {
      requestURL += `&isNCC=${params.isNCC}`;
    }
    if (params && params.materialType) {
      requestURL += `&materialType=${params.materialType}`;
    }

    const response = yield call(requestAuth, requestURL);

    callback(response);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getFinishProductsAuto(action) {
  try {
    const { params, callback } = action;

    let requestURL = `${MASTER_URL}/farm-production-orders/get-finish-products`;
    if (params && params.productCode) {
      requestURL += `?productCode=${params.productCode}`;
    }
    if (params && params.unitCodeReceived) {
      requestURL += `&unitCodeReceived=${params.unitCodeReceived}`;
    }

    const response = yield call(requestAuth, requestURL);

    if (response) {
      callback(response);
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getShipperAuto(action) {
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/deliveryOrders/shipper/auto-complete?search=${action.inputText}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (res.data && res.data.length !== 0) {
      // call callback of react-select
      action.callback(res.data);
    } else {
      action.callback([{ label: '', value: '' }]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
export function* fetchPlanSaga(action) {
  try {
    const { inputText, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const url = `${
      PATH_GATEWAY.RESOURCEPLANNING_API
    }/products/with-type-auto-complete?materialType=ZPLA`;
    const planRes = yield call(
      request,
      `${url}&search=${inputText}`,
      GETOption,
    );
    const fieldData = [
      ...planRes.map(item => ({
        value: item.productCode,
        label: `${item.productCode} ${item.productDescription}`,
      })),
    ];
    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}
const ConvertUTCtoClient = datetime => {
  const localDate = moment
    .utc(datetime)
    .local()
    .format('YYYY-MM-DD');
  return localDate;
};
const ConverDateToYMD = datetime =>
  moment(datetime, 'DDMMMYYYY').format('YYYY-MM-DD');

const getQueryStr = formValues => {
  const {
    deliveryDateTime,
    planCode,
    planName,
    prodOrderCode,
    deliverCode,
    receiverCode,
    pageSize,
    pageIndex,
    isUpdate,
    sort,
  } = formValues;
  const stringQuery = serializeQueryParams({
    deliveryDate:
      isUpdate === 1
        ? ConvertUTCtoClient(deliveryDateTime)
        : ConverDateToYMD(new Date(deliveryDateTime)),
    deliverCode,
    receiverCode,
    planningCode: planCode ? planCode.value : '',
    planningName: planName,
    productionOrderCode: prodOrderCode ? prodOrderCode.value : '',
    pageSize,
    pageIndex,
    sort: sort ? sort[0] : '',
  });
  return stringQuery;
};
export function* fetchSuggestSearch(action) {
  const { submitValuesSuggest, callback } = action;
  let data = [];
  yield put(changeSubmitSuggest(submitValuesSuggest));
  yield put(setLoading(true));
  const mainData = {
    ...submitValuesSuggest,
    deliverCode:
      submitValuesSuggest.deliverCode && submitValuesSuggest.deliverCode.value,
  };
  try {
    const url = `${
      PATH_GATEWAY.BFF_SPA_API
    }/farm-harvest-plan/list-harvest-plant?${getQueryStr(mainData)}`;
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    const suggestDataGet = yield call(request, `${url}`, GETOption);
    if (suggestDataGet.statusCode !== responseCode.ok) {
      throw Object({
        message: 'Có lỗi xảy ra',
      });
    } else {
      try {
        submitValuesSuggest.totalItem = suggestDataGet.meta.count;
        data = constructorListTable.converDataToGrid(suggestDataGet.data);
        submitValuesSuggest.pageSizeTrue = data.length;
        yield put(changeSubmitSuggest(submitValuesSuggest));
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  } catch (e) {
    yield put();
  }
  yield put(setDataSuggestSearch(data));
  if (typeof callback === 'function') callback();
  yield put(setLoading(false));
}
/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  yield takeLeading(CREATE_BBGH_FARM, createBBGHFarm);
  yield takeLeading(GET_INIT_CREATED_BBGH, getInitCreatedBBGH);

  yield takeLatest(GET_USER_AUTOCOMPLETE, getUserAutoComplete);
  yield takeLatest(GET_FARM_NSC_AUTO, getFarmNSCAutocomplete);

  yield takeLatest(GET_PROD_ORDER_AUTO, getProdOrderAuto);
  yield takeLatest(GET_FARM_PRODUCT_AUTO, getFarmProductAuto);
  yield takeLatest(GET_FINISH_PRODUCTS_AUTO, getFinishProductsAuto);

  yield takeLatest(GET_SHIPPER_AUTO, getShipperAuto);

  yield takeLeading(GET_LEADTIME_REGULAR, getLeadtimeRegular);
  yield takeLeading(CHANGE_SELECTED_UNIT, changeSelectedUnit);

  yield takeLeading(masterRoutine.REQUEST, getInitMaster);

  yield takeLatest(GET_PLAN_AUTO, fetchPlanSaga);
  yield takeLatest(GET_SUGGEST_SEARCH, fetchSuggestSearch);

  yield takeLatest(GET_PROD_ORDER_BY_SUGGEST_AUTO, getProdOrderBySuggestAuto);
}
