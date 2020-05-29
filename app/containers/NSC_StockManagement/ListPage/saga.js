import {
  takeLeading,
  put,
  all,
  call,
  takeLatest,
  select,
} from 'redux-saga/effects';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
  requestAuth,
  METHOD_REQUEST,
} from 'utils/request';

import { localstoreUtilites } from 'utils/persistenceData';
import { loadingError, setLoading, showSuccess } from 'containers/App/actions';
import {
  getSAVWithDefault,
  getSAVWithJoin,
  getSAVWithoutJoin,
  makeSaveFileFunc,
  serializeQueryParams,
} from 'containers/App/utils';
import { startOfDay } from 'date-fns';
import * as constants from './constants';
import * as actions from './actions';
// import { formSubmittedValues } from './selectors';
import { formDataSchema } from './FormSection/formats';
import * as selectors from './selectors';
const APIs = {
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/inventory-mgts/simple`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/inventory-mgts/export`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getLocators: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/locator`,
  getWarningType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/warning-type`,
  getUoM: `${PATH_GATEWAY.RESOURCEPLANNING_API}/uoms/auto-complete`,
  getProducts: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/products/auto-complete-product`, // ?search=${inputText}
  getOrigin: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/plant-supplier/auto-complete`, // search=${inputText}&plantType=2
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getPurposeStorage: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/purpose-storage`,
  getBigImage: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/image/`,
  submitAssess: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/evaluate`,
  getSize: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/inventory-mgts/get-max-length-image`,
};

const auth = localstoreUtilites.getAuthFromLocalStorage();
export function* fetchFormDataSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const formData = { ...formDataSchema };
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [orgRes, warningType, uom, users, purposeStorage] = yield all([
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      call(request, `${APIs.getWarningType}`, GETOption),
      call(request, `${APIs.getUoM}`, GETOption),
      call(request, `${APIs.getUsers}`, GETOption),
      call(request, `${APIs.getPurposeStorage}`, GETOption),
    ]);

    // List đơn vị
    if (
      orgRes.statusCode !== responseCode.ok ||
      !orgRes.data ||
      orgRes.data.length < 1
    ) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }

    formData.org = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
      type: item.organizationType,
    }));

    formData.warningTypes = warningType.data.map(item => ({
      label: item.name,
      value: item.id,
    }));
    formData.purposeStorage = purposeStorage.data.reduce(
      (accumulator, currentValue) => {
        if (currentValue.id !== 0) {
          return accumulator.concat([
            {
              label: currentValue.name,
              value: currentValue.id,
            },
          ]);
        }
        return accumulator;
      },
      [],
    );
    formData.uom = uom.data;
    formData.users = users.data.map(item => ({
      value: item.id,
      label: `${item.lastName} ${item.firstName}`,
    }));

    // formValues.warningType = warningType.data[0].id || 0;
    formData.isSubmit = true;
    formData.locators = [
      {
        locatorCode: '0',
        description: 'Tất cả',
      },
    ];
    yield put(actions.getFormDataSuccess(formData));
    if (formData.org.length === 1) {
      // set formDefaultValues
      formValues.plantCode = formData.org[0] || 0;
      yield fetchLocators({ formValues, plantCode: formData.org[0] });
    } else {
      yield put(actions.submitForm(formValues));
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchLocators(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const locators = yield call(
      request,
      `${APIs.getLocators}?plantCode=${action.plantCode.value}`,
      GETOption,
    );
    if (
      locators.statusCode !== responseCode.ok ||
      !locators.data ||
      locators.data.length < 1
    ) {
      throw Object({
        message: locators.message || 'Không lấy được kho',
      });
    }
    formValues.locatorCode = '0';
    formValues.plantCode = action.plantCode;
    yield put(
      actions.updateLocator(
        locators.data.map(item => ({
          label: item.description,
          value: item.locatorCode,
        })),
      ),
    );
    yield put(actions.submitForm(formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  let formData = yield select(selectors.formData());
  formData = formData.toJS();
  const { formValues } = action;
  try {
    yield put(setLoading());
    const { FromDate, ToDate } = formValues;
    // Mapping keys to match server params
    const queryParams = {
      fromDate: FromDate ? startOfDay(FromDate).toISOString() : '',
      toDate: ToDate ? startOfDay(ToDate).toISOString() : '',
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      sort: formValues.sort,
      locatorCode: getSAVWithoutJoin(formValues.locatorCode),
      plantCode: getSAVWithJoin(formValues.plantCode, formData.org),
      originCodes:
        formValues.originCode !== null
          ? formValues.originCode.map(item => item.value).join(',')
          : '',
      warningClass: getSAVWithoutJoin(formValues.warningClass),
      warningType: getSAVWithoutJoin(formValues.warningType),
      purposeStorage: getSAVWithDefault(formValues.purposeStorage, 0),
      dateRemain: formValues.dateRemain,
      productCode:
        formValues.productCode !== null ? formValues.productCode.value : '',
      uoM: formValues.uom !== null ? formValues.uom.value : '',
      batchKey: formValues.batchKey,
      assessorId: getSAVWithoutJoin(formValues.assessorCode),
      stocktakerId: getSAVWithoutJoin(formValues.stocktakerCode),
    };

    const queryStr = serializeQueryParams(queryParams);
    const requestApi = `${APIs.getTableData}?${queryStr}`;
    const response = yield call(
      request,
      requestApi,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin kho' });
    }

    formValues.totalItem = response.meta.count;
    const totalQuantity = response.meta.total;
    yield put(
      actions.submitFormSuccess(
        formValues,
        response.data.map((item, index) => ({ stt: index + 1, ...item })),
        totalQuantity,
      ),
    );
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcel(action) {
  const { formValues } = action;
  let formData = yield select(selectors.formData());
  formData = formData.toJS();
  try {
    yield put(setLoading());
    const { FromDate, ToDate } = formValues;
    // Mapping keys to match server params
    const queryParams = {
      fromDate: (!!FromDate && FromDate.toISOString()) || '',
      toDate: (!!ToDate && ToDate.toISOString()) || '',
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      sort: formValues.sort,
      locatorCode: getSAVWithoutJoin(formValues.locatorCode),
      plantCode: getSAVWithJoin(formValues.plantCode, formData.org),
      originCodes:
        formValues.originCode !== null
          ? formValues.originCode.map(item => item.value).join(',')
          : '',
      warningType: getSAVWithoutJoin(formValues.warningType),
      warningClass: getSAVWithoutJoin(formValues.warningClass),
      purposeStorage: getSAVWithDefault(formValues.purposeStorage, 0),
      dateRemain: formValues.dateRemain,
      productCode:
        formValues.productCode !== null ? formValues.productCode.value : '',
      uoM: formValues.uom !== null ? formValues.uom.value : '',
      batchKey: formValues.batchKey,
      assessorId: getSAVWithoutJoin(formValues.assessorCode),
      stocktakerId: getSAVWithoutJoin(formValues.stocktakerCode),
      stocktakingDate: new Date().toISOString(),
    };
    const queryStr = serializeQueryParams(queryParams);
    const requestApi = `${APIs.exportExcel}?${queryStr}`;

    const response = yield call(
      request,
      requestApi,
      optionReq({
        method: 'GET',
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
  const { formValues, sort } = action;
  try {
    yield put(setLoading());
    formValues.sort = sort;
    yield put(actions.submitForm(formValues));
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
export function* getOriginAuto(action) {
  try {
    const { inputText, callback } = action;
    const response = yield call(
      requestAuth,
      `${APIs.getOrigin}?search=${inputText}&plantType=2`,
    );
    const fieldData = [
      ...response.map(item => ({
        value: item.code,
        label: `${item.code} ${item.name}`,
      })),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getUomAuto(action) {
  try {
    const { inputText, callback } = action;
    const response = yield call(requestAuth, `${APIs.getUoM}?key=${inputText}`);
    const fieldData = [
      ...response.data.map(item => ({
        value: item.intMeasUnit,
        label: `${item.intMeasUnit} - ${item.measUnitText}`,
      })),
    ];
    yield callback(fieldData);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

function* fetchBigImage(action) {
  try {
    const { id, callback, isRefactorImage } = action.payload;
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    let bigImage;
    if (isRefactorImage) {
      bigImage = yield call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/basket-stocktaking/adjust/image-basket-detail/${id}`,
        GETOption,
      );
    } else {
      bigImage = yield call(request, `${APIs.getBigImage}${id}`, GETOption);
    }
    if (callback) {
      yield callback(bigImage.data);
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* deleteImage(action) {
  try {
    const {
      id,
      callback,
      rowIndex,
      imgIndex,
      isRefactorImage,
    } = action.payload;
    yield put(setLoading());
    const DELETEOption = optionReq({
      method: 'DELETE',
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.getBigImage}${id}?isRefactorImage=${isRefactorImage}`,
      DELETEOption,
    );
    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Không thể xoá ảnh',
      });
    }
    yield put({
      type: constants.DELETE_IMAGE_SUCCESS,
      payload: { rowIndex, imgIndex },
    });
    if (callback) {
      yield callback();
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* submitAssess(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.submitAssess}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.data,
        authReq: true,
      }),
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    const secondRes = yield call(
      request,
      `${APIs.getTableData}?ids=${action.data.inventoryId}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        authReq: true,
      }),
    );
    if (secondRes.statusCode !== responseCode.ok) {
      throw Object({ message: secondRes.message });
    }
    yield put({
      type: constants.SUBMIT_ASSESS_SUCCESS,
      payload: {
        data: { ...secondRes.data[0], index: action.data.rowIndex + 1 },
        rowIndex: action.data.rowIndex,
      },
    });
    yield put(showSuccess(res.message));
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getSize() {
  try {
    const response = yield call(requestAuth, `${APIs.getSize}`);
    yield put(actions.getSizeFileSuccess(response.data));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* RetailListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLatest(constants.FETCH_LOCATORS, fetchLocators);
  yield takeLatest(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
  yield takeLeading(constants.GET_PRODUCT_AUTO, getProductAuto);
  yield takeLeading(constants.GET_ORIGIN_AUTO, getOriginAuto);
  yield takeLeading(constants.GET_UOM_AUTO, getUomAuto);
  yield takeLeading(constants.FETCH_BIG_IMAGE, fetchBigImage);
  yield takeLeading(constants.DELETE_IMAGE, deleteImage);
  yield takeLeading(constants.SUBMIT_ASSESS, submitAssess);
  yield takeLeading(constants.SIZE_FILE, getSize);
}
