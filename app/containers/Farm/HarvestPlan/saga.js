import { call, put, takeLatest, takeLeading, select } from 'redux-saga/effects';
import { loadingError, setLoading, showSuccess } from 'containers/App/actions';
import request, { optionReq, PATH_GATEWAY } from 'utils/request';
import { makeSaveFileFunc, serializeQueryParams } from 'containers/App/utils';
import { format } from 'date-fns';
import { getUserId } from 'utils/userContext';
import * as constants from './constants';
import { submittedValues, formValues, tableDataRow } from './selectors';
const APIs = {
  getOrganizations: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user?plantType=2`,
  getPlanCode: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/products/auto-complete?materialType=ZPLA`,
  getProductionOrders: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/production-orders/auto-complete`,
  saveRow: `${PATH_GATEWAY.FORECASTING_API}/farm-harvest-plan/register`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/farm-harvest-plan/export`,
  submitForm: `${PATH_GATEWAY.FORECASTING_API}/farm-harvest-plan/simple`,
  getProductOrderByPlanningCode: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/production-orders/auto-complete-by-planning-code`,
  checkNewPlan: `${PATH_GATEWAY.FORECASTING_API}/farm-harvest-plan/update-all`,
};

function* getPlanCode(action) {
  try {
    const { inputValue, callback } = action.payload;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.getPlanCode}&search=${inputValue}`,
      GETOption,
    );
    if (!(res instanceof Array)) {
      throw Object({
        message: res.message || 'Không lấy được mã kế hoạch',
      });
    }
    if (callback) {
      yield callback(
        res.map(item => ({
          label: `${item.productCode} ${item.productDescription}`, // product chính là plan code
          value: item.productCode,
        })),
      );
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getProductionOrders(action) {
  try {
    const { inputValue, callback, plantCode } = action.payload;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.getProductionOrders}?search=${inputValue}&plantCode=${
        plantCode.value
      }`,
      GETOption,
    );
    if (!(res instanceof Array)) {
      throw Object({
        message: res.message || 'Không lấy được thông tin',
      });
    }
    if (callback) {
      yield callback(
        res.map(item => ({
          label: item.productionOrderCode,
          value: item.productionOrderCode,
        })),
      );
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* submitForm(action) {
  try {
    const { values } = action.payload;
    yield put(setLoading());
    const queryParams = {
      planningName: values.planningName,
      productionOrderCode: values.productionOrderCode
        ? values.productionOrderCode.value
        : '',
      plantCode:
        values.plantCode instanceof Object ? values.plantCode.value : '',
      processDate: values.date ? values.date.toISOString() : '',
      planningCode: values.planningCode ? values.planningCode.value : '',
      pageSize: values.pageSize,
      pageIndex: values.pageIndex,
      sort: values.sort,
    };
    const queryStr = serializeQueryParams(queryParams);
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.submitForm}?${queryStr}`,
      GETOption,
    );
    if (res.statusCode !== 200 || !res.data) {
      yield put({ type: constants.SUBMIT_FORM_FAILURE });
      throw Object({
        message: res.message || 'Không lấy được thông tin kế hoạch thu hoạch',
      });
    }
    yield put({
      type: constants.SUBMIT_FORM_SUCCESS,
      payload: {
        submittedValues: values,
        tableData: res.data,
        tableMeta: res.meta,
      },
    });
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* exportExcel() {
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    let values = yield select(submittedValues());
    values = values.toJS();
    yield put(setLoading());
    const queryParams = {
      planningName: values.planningName,
      productionOrderCode: values.productionOrderCode
        ? values.productionOrderCode.value
        : '',
      plantCode:
        values.plantCode instanceof Object ? values.plantCode.value : '',
      processDate: values.date ? format(values.date, 'MM-dd-yyyy') : '',
      planningCode: values.planningCode ? values.planningCode.value : '',
    };
    const queryStr = serializeQueryParams(queryParams);
    yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
      GETOption,
      makeSaveFileFunc(),
    );
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}
function* saveRow(action) {
  try {
    const { rowindex } = action.payload;
    let data = yield select(tableDataRow(rowindex));
    data = data.toJS();
    let submitted = yield select(submittedValues());
    submitted = submitted.toJS();
    data.processDate = submitted.date.toISOString();
    yield put(setLoading());
    const POSTOption = optionReq({
      method: 'POST',
      body: data,
      authReq: true,
    });
    const res = yield call(request, `${APIs.saveRow}`, POSTOption);
    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Không thể cập nhật kế hoạch',
      });
    }
    yield put(showSuccess(res.message));
    yield submitForm({ payload: { values: submitted } });
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getOrganizations() {
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.getOrganizations}&userId=${getUserId()}`,
      GETOption,
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được Farm',
      });
    }
    yield put({
      type: constants.GET_ORGANIZATION_SUCCESS,
      payload: {
        orgs: res.data.map(item => ({ value: item.value, label: item.name })),
      },
    });
    let fromValues = yield select(formValues());
    fromValues = fromValues.toJS();
    yield submitForm({ payload: { values: fromValues } });
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getProductOrderByPlanningCode(action) {
  try {
    const { inputText, planningCode, callback } = action.payload;
    const submitted = yield select(submittedValues());
    const submit = submitted.toJS();
    console.log(submit);
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${
        APIs.getProductOrderByPlanningCode
      }?search=${inputText}&planningCode=${planningCode || ''}&plantCode=${
        submit.plantCode instanceof Object ? submit.plantCode.value : ''
      }`,
      GETOption,
    );
    if (!(res instanceof Array)) {
      throw Object({
        message: res.message || 'Không lấy được thông tin lệnh sản xuất',
      });
    }
    if (callback) {
      yield callback(
        res.map(item => ({
          ...item,
          plantCode: submit.plantCode.value,
          processDate: submit.date.toISOString(),
        })),
      );
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* checkNewPlan() {
  try {
    yield put(setLoading());
    let submitted = yield select(submittedValues());
    const { date, plantCode } = submitted.toJS();
    const data = { plantCode: plantCode.value, processDate: date };
    const POSTOption = optionReq({
      method: 'POST',
      body: data,
      authReq: true,
    });
    const res = yield call(request, `${APIs.checkNewPlan}`, POSTOption);
    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Không thể cập nhật kế hoạch',
      });
    }
    yield put(showSuccess(res.message));
    yield put(showSuccess(res.message));
    submitted = submitted.toJS();
    yield submitForm({ payload: { values: submitted } });
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// Individual exports for testing
export default function* harvestPlanSaga() {
  yield takeLeading(constants.GET_ORGANIZATION, getOrganizations);
  yield takeLatest(constants.GET_PLAN_CODE_OR_NAME, getPlanCode);
  yield takeLatest(constants.GET_PRODUCTION_ORDERS, getProductionOrders);
  yield takeLatest(
    constants.GET_PRODUCTION_ORDERS_BY_PLANNING_CODE,
    getProductOrderByPlanningCode,
  );
  yield takeLeading(constants.SUBMIT_FORM, submitForm);
  yield takeLeading(constants.EXPORT_EXCELL, exportExcel);
  yield takeLeading(constants.SAVE_ROW, saveRow);
  yield takeLeading(constants.CHECK_NEW_PLAN, checkNewPlan);
}
