import { put, call, all, takeLatest, takeLeading } from 'redux-saga/effects';
import request, {
  PATH_GATEWAY,
  optionReq,
  responseCode,
  logout,
} from 'utils/request';
import { startOfDay } from 'date-fns';
import * as constants from './constants';
import * as actions from './actions';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import { serializeQueryParams, makeSaveFileFunc } from '../../App/utils';

const APIs = {
  getOrgsByUserId: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`, // ?userId=
  export: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/total-weight-export`,
  getTableData: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/simple`,
  getSuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=100`,
  purchaseStopping: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/register-purchase-stopping`,
  checkWarning: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/total-weight-warning-checking`,
  sendEmail: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/send-email-warning`,
  downloadWarningFile: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/totalweightmgts/total-weight-warning-export`,
  getRegions: `${PATH_GATEWAY.AUTHORIZATION_API}/regions`,
};

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
      const data = {};

      const [orgByUserRes, regions] = yield all([
        call(
          request,
          `${APIs.getOrgsByUserId}?userId=${userId}`,
          optionReq({
            method: 'GET',
            authReq: true,
          }),
        ),
        call(
          request,
          `${APIs.getRegions}`,
          optionReq({ method: 'GET', authReq: true }),
        ),
      ]);

      if (regions.statusCode !== 200) {
        throw Object({ message: 'Không lấy được thông tin vùng miền' });
      }

      // List of orgs by userId
      if (!orgByUserRes.data) {
        throw Object({
          message:
            orgByUserRes.message ||
            'Không lấy được dữ liệu Đơn vị theo ID người dùng',
        });
      }

      const itemAll = {
        value: '0',
        label: 'Tất cả',
      };
      data.unitCode = [
        ...(orgByUserRes.data.length > 1 ? [itemAll] : []),
        ...orgByUserRes.data.map(item => ({
          value: item.value,
          label: item.name,
        })),
      ];

      // Danh sách ID tất cả đơn vị nhận hàng
      data.unitCodes = '';
      if (orgByUserRes.data.length > 0) {
        data.unitCodes = orgByUserRes.data.reduce(
          (prev, curr) =>
            `${typeof prev === 'string' ? prev : prev.value},${curr.value}`,
        );
      }

      data.regions = regions.data;
      yield put(actions.fetchFormDataSuccess(data));

      updatedFormValues = {
        ...formValues,
        unitCode: data.unitCode[0] ? data.unitCode[0].value : '',
        unitCodes: data.unitCodes || '',
      };
    }

    yield put(actions.submitForm(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchDeliveryOrg(action) {
  try {
    const { inputValue, callback } = action;
    const supplierRes = yield call(
      request,
      `${APIs.getSuppliers}&search=${inputValue}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    const fieldData = supplierRes.data.map(item => ({
      value: item.supplierCode,
      label: item.name1,
    }));
    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  try {
    yield put(setLoading());
    const { formValues } = action;

    // Mapping keys to match server params
    const queryParams = {
      unitCode: formValues.unitCode,
      unitCodes: formValues.unitCodes,
      processingDate: formValues.processingDate
        ? formValues.processingDate.toISOString()
        : null,
      supplierCode: formValues.supplier ? formValues.supplier.value : '',
      isPurchaseStopping: formValues.isPurchaseStopping,
      isWarning: formValues.isWarning,
    };

    const queryStr = serializeQueryParams(queryParams);

    const response = yield call(
      request,
      `${APIs.getTableData}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (response.statusCode !== 200 || !response.data) {
      throw Object({
        message:
          response.message || 'Không lấy được thông tin cân tổng điều phối',
      });
    }

    yield put(actions.submitFormSuccess(formValues, response.data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* purchaseStopping(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.purchaseStopping}`,
      optionReq({
        method: 'POST',
        body: action.ids,
        authReq: true,
      }),
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    yield put(showSuccess(res.message));
    yield put(setLoading(false));
    action.callback();
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* checkWarning(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.checkWarning}`,
      optionReq({
        method: 'POST',
        body: action.form,
        authReq: true,
      }),
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* sendEmail(action) {
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.sendEmail}`,
      optionReq({
        method: 'POST',
        body: { processDate: action.date },
        authReq: true,
      }),
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    yield put(setLoading(false));
    yield put(showSuccess(res.message));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* downloadWarningFile(action) {
  try {
    const res = yield call(
      request,
      `${APIs.downloadWarningFile}?processingDate=${new Date(
        action.date,
      ).toISOString()}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
      makeSaveFileFunc(),
    );
    if (!(res instanceof Response)) {
      if (res.statusCode !== responseCode.ok) {
        throw Object({ message: res.message });
      }
      if (res.message) {
        yield put(showSuccess(res.message));
      }
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// Input formSubmittedValues, callback
export function* exportExcelSaga(action) {
  try {
    yield put(setLoading());
    const { formSubmittedValues } = action;

    // Mapping keys to match server params
    const queryParams = {
      unitCode: formSubmittedValues.unitCode,
      unitCodes: formSubmittedValues.unitCodes,
      processingDate: formSubmittedValues.processingDate
        ? formSubmittedValues.processingDate.toISOString()
        : null,
      supplierCode: formSubmittedValues.supplierCode,
      isPurchaseStopping: formSubmittedValues.isPurchaseStopping,
      isWarning: formSubmittedValues.isWarning,
    };

    const queryStr = serializeQueryParams(queryParams);

    const response = yield call(
      request,
      `${APIs.export}?${queryStr}`,
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

function processResponse(response) {
  if (response.status === responseCode.forbid) {
    window.location.assign('/trang-404');
  }

  if (
    response.status === responseCode.unauthorized &&
    window.location.pathname !== '/dang-nhap'
  ) {
    logout();
  }
  if (
    response.headers.get('content-type') &&
    response.headers.get('content-type').indexOf('application/json') > -1
  )
    return response.json();
  makeSaveFileFunc('Chi tiết lỗi.xlsx')(response);
  return Object.assign(
    {
      statusCode: 500,
      message:
        'File tải lên không hợp lệ, vui lòng kiểm tra lại theo file được tải xuống',
    },
    response,
  );
}

function* submitForm(action) {
  try {
    yield put(setLoading());
    const formData = new FormData();
    Object.keys(action.form).forEach(key => {
      if (key === 'date') {
        formData.append(key, startOfDay(action.form[key]).toISOString());
      } else {
        formData.append(key, action.form[key]);
      }
    });
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/totalweightmgts/total-weight-import`,
      optionReq({ method: 'POST', body: formData, authReq: true }),
      processResponse,
    );
    if (res && res.statusCode !== 200) {
      throw Object({ message: res.message });
    }
    // if (res) {
    //   yield put(showSuccess(res.message));
    // }
    // yield put(setLoading(false));
    // yield action.callback();
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* submitFormSignalR(action) {
  try {
    const { res } = action;
    if (res.statusCode !== responseCode.ok) {
      yield call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/totalweightmgts/total-weight-download-pending?processingDate=${new Date(
          action.processingDate,
        ).toISOString()}`,
        optionReq({ method: 'GET', authReq: true }),
        makeSaveFileFunc(),
      );
      throw Object({ message: res.message });
    }
    yield action.callback();
    yield put(setLoading(false));
    yield put(showSuccess(res.message));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* signalrProcessing(action) {
  try {
    const { res } = action;
    if (!res.data) {
      throw Object({ message: res.message });
    }
    yield put(showSuccess(res.message));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLatest(constants.FETCH_DELIVERY_ORG, fetchDeliveryOrg);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.CHECK_WARNING, checkWarning);
  yield takeLeading(constants.SEND_EMAIL, sendEmail);
  yield takeLeading(constants.DOWNLOAD_WARNING_FILE, downloadWarningFile);
  yield takeLeading(constants.PURCHASE_STOPPING, purchaseStopping);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLeading(constants.SUBMIT_FILE, submitForm);
  yield takeLeading(constants.SUBMIT_FILE_SIGNALR, submitFormSignalR);
  yield takeLeading(constants.SIGNALR_PROCESSING, signalrProcessing);
}
