/* eslint-disable no-empty */
import { takeLeading, put, all, call } from 'redux-saga/effects';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, {
  checkStatus,
  optionReq,
  PATH_GATEWAY,
  METHOD_REQUEST,
  responseCode,
  requestAuth,
} from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { formDataSchema } from './FormSection/formats';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';
import * as groupAuthorize from '../../../authorize/groupAuthorize';
const APIs = {
  getTableData: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/price-floor/get-price-floor-list`,
  getApprover: `${
    PATH_GATEWAY.BFF_SPA_API
  }/user/get-by-privilege?privilegeCode=${groupAuthorize.CODE.xemApproverList}`,
  getStatus: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exported-retail-request/retail-request-status`,
  getReason: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/get-cancellation-receipt-reason?includeAll=true`, // Api get Reason List
  getCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/list-request-cancellation`,
  printCancelRequest: `${
    PATH_GATEWAY.BFF_SPA_API
  }/cancellationrequestreceipt/print`,
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getRegions: `${PATH_GATEWAY.AUTHORIZATION_API}/regions?filter[isActive]=1`,
  ImportFile: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/price-floor/import-price-floor`,
  downloadFileError: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/price-floor/download-price-floor-error-file`,
  export: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/price-floor/download-price-floor-by-filter`,
  getProducts: `${PATH_GATEWAY.RESOURCEPLANNING_API}/products/auto-complete`, // ?search=${inputText}
};
const auth = localstoreUtilites.getAuthFromLocalStorage();
export function* fetchFormDataSaga(action) {
  const { formValues } = action;
  yield put(setLoading());
  try {
    const formData = { ...formDataSchema };
    const GETOption = optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    });
    const [orgRes, getRegions] = yield all([
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      call(request, `${APIs.getRegions}`, GETOption),
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

    if (
      getRegions.statusCode !== responseCode.ok ||
      !getRegions.data ||
      getRegions.data.length < 1
    ) {
      throw Object({
        message: getRegions.message || 'Không lấy được danh sách vùng sản xuất',
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
    formValues.RegionConsumeCode = getRegions.data[0].value || 0;

    formValues.orgList = orgList
      .filter(item => item.value !== 0)
      .map(item => item.value);
    formValues.regionList = getRegionsList
      .filter(item => item.value !== 0)
      .map(item => item.value);
    formData.isSubmit = true;
    yield put(actions.getFormDataSuccess(formData));
  } catch (e) {}
  yield put(actions.submitForm(formValues));
  yield put(setLoading(false));
}
export function* pagingInitSaga(action) {
  yield put(setLoading(true));
  const { submittedValues } = action;
  const { value = '' } = submittedValues.productCode || {};
  const queryParams = {
    productCode: value,
    dateFrom: submittedValues.DateFrom
      ? submittedValues.DateFrom.toISOString()
      : '',
    dateTo: submittedValues.DateTo ? submittedValues.DateTo.toISOString() : '',
    pageSize: submittedValues.pageSize,
    pageIndex: submittedValues.pageIndex,
    sort: submittedValues.sort,
    strPlant: submittedValues.orgList.join(','),
    strRegion: submittedValues.regionList.join(','),
  };
  const filterStr = `&filter[PlantCode]=${
    submittedValues.org === 0 ? '' : submittedValues.org
  }&filter[RegionProductionCode]=${
    submittedValues.RegionProductionCode === 0
      ? ''
      : submittedValues.RegionProductionCode
  }&filter[RegionConsumeCode]=${
    submittedValues.RegionConsumeCode === 0
      ? ''
      : submittedValues.RegionConsumeCode
  }`;
  const queryStr = serializeQueryParams(queryParams);
  const response = yield call(
    request,
    `${APIs.getTableData}?${queryStr}${filterStr}`,
    optionReq({
      method: METHOD_REQUEST.GET,
      authReq: true,
    }),
  );
  if (!response.data) {
    throw Object({ message: 'Không lấy được thông tin danh sách bán xá' });
  }
  yield put(actions.pagingSuccess(response.data));
  yield put(setLoading(false));
}
export function* submitFormSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    // Mapping keys to match server params
    formValues.pageIndex = 0;
    const { value = '' } = formValues.productCode || {};
    const queryParams = {
      productCode: value,
      dateFrom: formValues.DateFrom ? formValues.DateFrom.toISOString() : '',
      dateTo: formValues.DateTo ? formValues.DateTo.toISOString() : '',
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      sort: formValues.sort,
      strPlant: formValues.orgList.join(','),
      strRegion: formValues.regionList.join(','),
    };
    const filterStr = `&filter[PlantCode]=${
      formValues.org === 0 ? '' : formValues.org
    }&filter[RegionProductionCode]=${
      formValues.RegionProductionCode === 0
        ? ''
        : formValues.RegionProductionCode
    }&filter[RegionConsumeCode]=${
      formValues.RegionConsumeCode === 0 ? '' : formValues.RegionConsumeCode
    }`;
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getTableData}?${queryStr}${filterStr}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        authReq: true,
      }),
    );

    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin phiếu cân nhập kho' });
    }
    formValues.totalItem = response.meta.count;
    formValues.pageIndex = 0;
    yield put(actions.submitFormSuccess(formValues, response.data));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}
export function* exportExcel(action) {
  try {
    yield put(setLoading());
    const { formSubmittedValues, formData } = action;

    // Mapping keys to match server params
    const regionListDto = formData.RegionProductionCode.map(item => ({
      RegionCode: item.value ? item.value : '',
      RegionName: item.label ? item.label : '',
    }));
    regionListDto.shift();
    const { value = '' } = formSubmittedValues.productCode || {};
    const queryParams = {
      productCode: value,
      dateFrom: formSubmittedValues.DateFrom
        ? formSubmittedValues.DateFrom.toISOString()
        : '',
      dateTo: formSubmittedValues.DateTo
        ? formSubmittedValues.DateTo.toISOString()
        : '',
      import: 1,
      sort: formSubmittedValues.sort,
      strPlant: formSubmittedValues.orgList.join(','),
      strRegion: formSubmittedValues.regionList.join(','),
    };
    const queryStr = serializeQueryParams(queryParams);
    const filterStr = `&filter[PlantCode]=${
      formSubmittedValues.org === 0 ? '' : formSubmittedValues.org
    }&filter[RegionProductionCode]=${
      formSubmittedValues.RegionProductionCode === 0
        ? ''
        : formSubmittedValues.RegionProductionCode
    }&filter[RegionConsumeCode]=${
      formSubmittedValues.RegionConsumeCode === 0
        ? ''
        : formSubmittedValues.RegionConsumeCode
    }`;
    const response = yield call(
      request,
      `${APIs.export}?${queryStr}${filterStr}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        authReq: true,
        body: regionListDto,
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

export function* onSubmitFile(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.ImportFile}`,
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

export function* changeOrderSaga(action) {
  const { submittedValues } = action;
  try {
    yield put(setLoading());
    yield put(actions.pagingInit(submittedValues));
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
export default function* RetailListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.PAGING_INIT, pagingInitSaga);
  yield takeLeading(constants.ON_SUBMIT_FILE, onSubmitFile);
  yield takeLeading(constants.SUBMIT_FILE_SIGNALR, submitFormSignalR);
  yield takeLeading(constants.SIGNALR_PROCESSING, signalrProcessing);
  yield takeLeading(constants.CHANGE_ORDER, changeOrderSaga);
  yield takeLeading(constants.GET_PRODUCT_AUTO, getProductAuto);
}
