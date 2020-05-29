/* eslint-disable indent */
import { all, call, put, takeLeading } from 'redux-saga/effects';
import { localstoreUtilites } from '../../../utils/persistenceData';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from '../../../utils/request';
import { setLoading, loadingError, showSuccess } from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getCustomerAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/customer/autocomplete`,
  getBBGNHHTypes: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/delivery-receipt/types`,
  getCreatorAuto: `${PATH_GATEWAY.AUTHENTICATION_API}/users`,
  getBBGNHHList: `${PATH_GATEWAY.BFF_SPA_API}/delivery-receipt`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/delivery-receipt/export-excel`,
  exportExcelLog: `${
    PATH_GATEWAY.BFF_SPA_API
  }/delivery-receipt/export-excel-for-log`,
  exportExcelIcd: `${
    PATH_GATEWAY.BFF_SPA_API
  }/delivery-receipt/export-excel-for-icd`,
  printBBGNHH: `${PATH_GATEWAY.BFF_SPA_API}/delivery-receipt/print`,
  deleteRecord: `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/delivery-receipt`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const GETOption = optionReq({
        method: 'GET',
        authReq: true,
      });
      const [orgRes, typeRes] = yield all([
        call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
        call(request, APIs.getBBGNHHTypes, GETOption),
      ]);

      if (orgRes.statusCode !== 200 || !orgRes.data || !orgRes.data.length) {
        throw Object({
          message: 'Không lấy được danh sách đơn vị',
        });
      }

      if (typeRes.statusCode !== 200 || !typeRes.data || !typeRes.data.length) {
        throw Object({
          message: typeRes.message || 'Không lấy được danh sách Loại BBGNHH',
        });
      }

      const formData = {
        org: [
          // ...(orgRes.data.length > 1
          //   ? [
          //       {
          //         value: 0,
          //         label: 'Tất cả',
          //       },
          //     ]
          //   : []),
          ...orgRes.data.map(item => ({
            value: item.value,
            label: item.name,
            type: item.organizationType,
          })),
        ],
        type: [
          ...(typeRes.data.length > 1
            ? [
                {
                  value: 0,
                  label: 'Tất cả',
                },
              ]
            : []),
          ...typeRes.data.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ],
      };

      yield put(actions.formDataFetched(formData));

      updatedFormValues = {
        ...formValues,
        // org: formData.org[1] ? formData.org[1].value : formData.org[0].value,
        deliveryReceiptType:
          formData.type[0] &&
          (formData.type[0].value || formData.type[0].value === 0)
            ? formData.type[0].value
            : '',
      };
    }

    yield put(actions.submitForm(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* submitFormSaga(action) {
  try {
    yield put(setLoading());
    const { values } = action;
    const queryParams = {
      plantCode: values.org ? values.org.value : null,
      doCode: values.code,
      creatorCode: values.creatorCode ? values.creatorCode.value : null,
      deliveryReceiptType: values.deliveryReceiptType,
      stockExportReceiptCode: values.stockExportReceiptCode,
      customerCode: values.customer ? values.customer.value : null,
      dateFrom: values.deliveryDateFrom
        ? values.deliveryDateFrom.toISOString()
        : null,
      dateTo: values.deliveryDateTo
        ? values.deliveryDateTo.toISOString()
        : null,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getBBGNHHList}?${queryStr}&pageSize=-1`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (response.statusCode !== responseCode.ok || !response.data) {
      throw Object({
        message:
          response.message ||
          'Không lấy được danh sách Biên Bản Giao Nhận Hàng Hoá.',
      });
    }
    yield put(actions.formSubmitSuccess(action.values, response.data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* deleteRecordSaga(action) {
  try {
    yield put(setLoading());
    if (typeof action.id === 'undefined') {
      throw Object({
        message: 'Chưa lấy được Mã Biên Bản Giao Nhận Hàng Hoá để xóa',
      });
    }
    const response = yield call(
      request,
      `${APIs.deleteRecord}/${action.id}`,
      optionReq({
        method: 'DELETE',
        authReq: true,
      }),
    );

    // const response = true;
    if (response.statusCode !== 200) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi xóa' });
    }

    yield put(showSuccess(response.message || 'Xóa thành công.'));
    yield put(actions.recordDeleted(action.id, response));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* printSelectedSaga(action) {
  try {
    yield put(setLoading());
    if (!action.selectedRecords || action.selectedRecords.length <= 0) {
      throw Object({
        message: 'Chưa có Biên Bản Giao Nhận Hàng Hoá nào được chọn.',
      });
    }
    const ids = action.selectedRecords.map(record => record.id).join(',');
    const response = yield call(
      request,
      `${APIs.printBBGNHH}?ids=${ids}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (response.statusCode !== 200 || !response.data) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi in.' });
    }

    yield action.callback(response.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchCustomerSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const customerRes = yield call(
      request,
      `${APIs.getCustomerAuto}?filter=${inputValue}`,
      GETOption,
    );

    const fieldData = [
      ...customerRes.map(item => ({
        value: item.customerCode,
        label: item.customerName,
      })),
    ];

    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcel(action) {
  try {
    const queryParams = {
      plantCode: !action.values.org ? null : action.values.org.value,
      doCode: !action.values.code ? null : action.values.code,
      creatorCode: !action.values.creatorCode
        ? null
        : action.values.creatorCode.value,
      deliveryReceiptType: !action.values.deliveryReceiptType
        ? null
        : action.values.deliveryReceiptType,
      stockExportReceiptCode: !action.values.stockExportReceiptCode
        ? null
        : action.values.stockExportReceiptCode,
      customerCode: !action.values.customer
        ? null
        : action.values.customer.value,
      dateFrom: !action.values.deliveryDateFrom
        ? null
        : action.values.deliveryDateFrom.toISOString(),
      dateTo: !action.values.deliveryDateTo
        ? null
        : action.values.deliveryDateTo.toISOString(),
    };
    const queryStr = serializeQueryParams(queryParams);

    const response = yield call(
      request,
      `${APIs.exportExcel}?${queryStr}`,
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

export function* exportExcelLog(action) {
  try {
    yield put(setLoading());
    if (!action.selectedRecords || action.selectedRecords.length <= 0) {
      throw Object({
        message: 'Chưa có Biên Bản Giao Nhận Hàng Hoá nào được chọn.',
      });
    }
    const ids = action.selectedRecords.map(record => record.id).join(',');
    const queryParams = {
      userName: auth.meta.fullName,
      email: auth.meta.email,
      phone: auth.meta.phoneNumber,
      ids,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.exportExcelLog}?${queryStr}`,
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

export function* exportExcelIcd(action) {
  try {
    yield put(setLoading());
    if (!action.selectedRecords || action.selectedRecords.length <= 0) {
      throw Object({
        message: 'Chưa có Biên Bản Giao Nhận Hàng Hoá nào được chọn.',
      });
    }
    const ids = action.selectedRecords.map(record => record.id).join(',');
    const queryParams = {
      userName: auth.meta.fullName,
      email: auth.meta.email,
      phone: auth.meta.phoneNumber,
      ids,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.exportExcelIcd}?${queryStr}`,
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

export function* fetchCreatorSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const creatorRes = yield call(
      request,
      `${APIs.getCreatorAuto}?filterName=${inputValue}&pageSize=-1`,
      GETOption,
    );
    const fieldData = [
      ...creatorRes.data.map(item => ({
        value: item.id,
        label: `${item.lastName} ${item.firstName}`,
      })),
    ];
    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
  yield takeLeading(constants.FETCH_CUSTOMER, fetchCustomerSaga);
  yield takeLeading(constants.FETCH_CREACTOR, fetchCreatorSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.EXPORT_EXCEL_LOG, exportExcelLog);
  yield takeLeading(constants.EXPORT_EXCEL_ICD, exportExcelIcd);
}
