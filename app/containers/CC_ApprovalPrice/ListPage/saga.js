import { takeLeading, put, all, call } from 'redux-saga/effects';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
  requestAuth,
  METHOD_REQUEST,
  checkStatus,
} from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { formDataSchema } from './FormSection/formats';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

const APIs = {
  getTableData: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/get-approved-price-list`,
  exportExcel: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/download-file-excel-approved-price-list`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getRegions: `${PATH_GATEWAY.AUTHORIZATION_API}/regions?filter[isActive]=1`,
  getProducts: `${PATH_GATEWAY.RESOURCEPLANNING_API}/products/auto-complete`, // ?search=${inputText}
  postFile: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/import-approved-price-list`,
  downloadFileError: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/download-import-approved-price-error-file`,
  downloadFileSample: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/approved-price/download-import-approved-price-sample-file`,
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
    const [orgRes, getRegions] = yield all([
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      call(request, `${APIs.getRegions}`, GETOption),
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

    if (orgRes.data.length > 1) {
      const allItem = [
        {
          value: 0,
          name: 'Tất cả',
        },
      ];
      orgRes.data = allItem.concat(orgRes.data);
    }

    const orgList = orgRes.data.map(item => ({
      value: item.value,
      label: item.name,
      type: item.organizationType,
    }));
    formData.org = orgList;

    // List vùng sản xuất
    if (
      getRegions.statusCode !== responseCode.ok ||
      !getRegions.data ||
      getRegions.data.length < 1
    ) {
      throw Object({
        message: getRegions.message || 'Không lấy được danh sách vùng miền',
      });
    }

    if (getRegions.data.length > 1) {
      const allgetRegions = [
        {
          value: 0,
          name: 'Tất cả',
          isActive: true,
        },
      ];
      getRegions.data = allgetRegions.concat(getRegions.data);
    }

    const getRegionsList = getRegions.data.map(item => ({
      value: item.value,
      label: item.name,
      regionId: item.regionId,
    }));

    formData.RegionProductionCode = getRegionsList;
    formData.RegionConsumeCode = getRegionsList;

    // set formDefaultValues
    formValues.org = orgRes.data[0].value || 0;
    formValues.RegionProductionCode = getRegions.data[0].value || 0;

    formValues.orgList = orgList
      .filter(item => item.value > 0)
      .map(item => item.value);
    formValues.regionList = getRegionsList
      .filter(item => item.value !== 0)
      .map(item => item.value);
    formData.isSubmit = true;
    yield put(actions.getFormDataSuccess(formData));
    yield put(actions.submitForm(formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());

    const {
      DateFrom,
      DateTo,
      org,
      RegionProductionCode,
      productCode,
    } = formValues;
    // Mapping keys to match server params
    const { value = '' } = productCode || {};
    const queryParams = {
      productCode: value,
      dateFrom: (!!DateFrom && DateFrom.toISOString()) || '',
      dateTo: (!!DateTo && DateTo.toISOString()) || '',
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      sort: formValues.sort,
      strPlant: formValues.orgList.join(','),
      strRegion: formValues.regionList.join(','),
    };

    let filterStr = (!!org && org !== '0' && `&filter[plantCode]=${org}`) || '';
    filterStr +=
      (!!RegionProductionCode &&
        RegionProductionCode !== '0' &&
        `&filter[regionCode]=${RegionProductionCode}`) ||
      '';

    const queryStr = serializeQueryParams(queryParams);
    const requestApi = `${APIs.getTableData}?${queryStr}${filterStr}`;

    const response = yield call(
      request,
      requestApi,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin phiếu cân nhập kho' });
    }

    formValues.totalItem = response.meta.count;

    yield put(actions.submitFormSuccess(formValues, response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* onSubmitFile(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.postFile}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        authReq: true,
        body: action.form,
      }),
    );
    if (response.statusCode !== 200 || !response.data) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi in.' });
    }
    checkStatus(response);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

function* submitFormSignalR(action) {
  try {
    const { res } = action;
    if (res.statusCode !== responseCode.ok) {
      yield call(
        request,
        APIs.downloadFileError,
        optionReq({
          method: METHOD_REQUEST.POST,
          body: res.data,
          authReq: true,
        }),
        makeSaveFileFunc(),
      );
      throw Object({
        message: res.message || 'Import dữ liệu không thành công.',
      });
    }
    yield action.callback();
    yield put(setLoading(false));
    yield put(showSuccess(res.message || 'Import dữ liệu thành công.'));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* signalrProcessing(action) {
  try {
    const { res } = action;
    if (!res.data) {
      throw Object({
        message: res.message || 'Import dữ liệu không thành công.',
      });
    }
    yield put(showSuccess(res.message || 'Import dữ liệu thành công.'));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcel(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const {
      DateFrom,
      DateTo,
      org,
      RegionProductionCode,
      productCode,
    } = formValues;
    // Mapping keys to match server params
    const { value = '' } = productCode || {};
    const queryParams = {
      productCode: value,
      dateFrom: (!!DateFrom && DateFrom.toISOString()) || '',
      dateTo: (!!DateTo && DateTo.toISOString()) || '',
      sort: formValues.sort,
      strPlant: formValues.orgList.join(','),
      strRegion: formValues.regionList.join(','),
    };

    let filterStr = (!!org && org !== '0' && `&filter[plantCode]=${org}`) || '';
    filterStr +=
      (!!RegionProductionCode &&
        RegionProductionCode !== '0' &&
        `&filter[regionCode]=${RegionProductionCode}`) ||
      '';

    const queryStr = serializeQueryParams(queryParams);
    const requestApi = `${APIs.exportExcel}?${queryStr}${filterStr}`;

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
function* downloadSampleFile(action) {
  try {
    const { res } = action;
    yield put(setLoading(true));
    yield call(
      request,
      APIs.downloadFileSample,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: res,
        authReq: true,
      }),
      makeSaveFileFunc(),
    );
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
export default function* RetailListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
  yield takeLeading(constants.GET_PRODUCT_AUTO, getProductAuto);
  yield takeLeading(constants.ON_SUBMIT_FILE, onSubmitFile);
  yield takeLeading(constants.SUBMIT_FILE_SIGNALR, submitFormSignalR);
  yield takeLeading(constants.SIGNALR_PROCESSING, signalrProcessing);
  yield takeLeading(constants.DOWNLOAD_SAMPLE_FILE, downloadSampleFile);
}
