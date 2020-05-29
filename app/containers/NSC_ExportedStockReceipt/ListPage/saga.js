import { put, all, call, takeLatest, takeLeading } from 'redux-saga/effects';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, { PATH_GATEWAY, optionReq } from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { formDataSchema } from './FormSection/formats';
import { serializeQueryParams, makeSaveFileFunc } from '../../App/utils';

const APIs = {
  getOrgsByUserId: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`, // ?userId=
  getPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants?pageSize=100`, // limit to 100
  getSuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=100`, // limit to 100
  getExportType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/export-type`,
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/ExportedStockReceipts/simple`,
  deleteRecord: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts`, // /{id}
  printSelected: `${PATH_GATEWAY.BFF_SPA_API}/ExportedStockReceipts/print`, // ?ids=1,2,3
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/exportedstockreceipts/export`,
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
};

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
      const formData = { ...formDataSchema };
      const GETOption = optionReq({
        method: 'GET',
        authReq: true,
      });
      const [orgByUserRes, exportTypesRes, users] = yield all([
        call(request, `${APIs.getOrgsByUserId}?userId=${userId}`, GETOption),
        call(request, APIs.getExportType, GETOption),
        call(request, APIs.getUsers, GETOption),
      ]);

      // Đơn vị xuất hàng
      if (!orgByUserRes.data) {
        throw Object({ message: 'Không lấy được thông tin đơn vị xuất hàng' });
      }
      if (!users.data) {
        throw Object({ message: 'Không lấy được thông tin người xuất kho' });
      }

      if (orgByUserRes.data.length === 0)
        throw Object({
          message: 'Tài khoản không có quyền thao tác trên bất kỳ đơn vị nào',
        });
      formData.deliverCode = [
        // ...(orgByUserRes.data.length > 1 ? [itemAll] : []),
        ...orgByUserRes.data.map(item => ({
          value: item.value,
          label: item.name,
        })),
      ];
      formData.users = users.data.map(item => ({
        value: item.id,
        label: `${item.lastName} ${item.firstName}`,
      }));
      formData.users.forEach(item => {
        if (item.value === userId) {
          formValues.user = item;
        }
      });

      // Danh sách ID tất cả đơn vị xuất hàng
      formData.orgCodes = orgByUserRes.data.map(item => item.value).join(',');

      if (
        !formValues.exportType ||
        (!formValues.exportType.length && formData.exportType)
      ) {
        formValues.exportType = formData.exportType[0]
          ? [formData.exportType[0].value]
          : [];
      }

      formData.users = users.data.map(item => ({
        value: item.id,
        label: `${item.lastName} ${item.firstName}`,
      }));
      // Loại xuất kho
      if (!exportTypesRes.data) {
        throw Object({ message: 'Không lấy được thông tin loại xuất kho' });
      }
      formData.exportType = exportTypesRes.data.map(item => ({
        value: item.id,
        label: item.name,
      }));

      yield put(actions.fetchFormDataSuccess(formData));

      updatedFormValues = {
        ...formValues,
        // deliverCode: (formValues.deliverCode = formData.deliverCode[1]
        //   ? formData.deliverCode[1].value
        //   : formData.deliverCode[0].value),
        orgCodes: formData.orgCodes || '',
        exportType: formData.exportType[0]
          ? [formData.exportType[0].value]
          : [],
        status: formData.status[0] ? formData.status[0].value : '',
      };
    }

    yield put(actions.submitForm(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchReceiverOrgSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const [farmRes, supplierRes] = yield all([
      call(request, `${APIs.getPlants}&search=${inputValue}`, GETOption),
      call(request, `${APIs.getSuppliers}&search=${inputValue}`, GETOption),
    ]);
    if (!farmRes.data || !supplierRes.data) {
      throw Object({ message: 'Không lấy được thông tin đơn vị nhận hàng' });
    }

    const fieldData = [
      ...farmRes.data.map(item => ({
        value: item.plantCode,
        label: item.plantName,
      })),
      ...supplierRes.data.map(item => ({
        value: item.supplierCode,
        label: item.name1,
      })),
    ];

    yield callback(fieldData);
    yield put(actions.fetchReceiverOrgSuccess(fieldData));
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
      status: formValues.status,
      exportingUnitCode: formValues.deliverCode
        ? formValues.deliverCode.value
        : 0,
      expStockRecptCode: formValues.expStockRecptCode,
      receiverCode: formValues.receiverCode
        ? formValues.receiverCode.value
        : null,
      exportedDateFrom: formValues.exportedDateFrom
        ? formValues.exportedDateFrom.toISOString()
        : '',
      exportedDateTo: formValues.exportedDateTo
        ? formValues.exportedDateTo.toISOString()
        : '',
      exportType: formValues.exportType,
      orgCodes: formValues.orgCodes,
      pageSize: formValues.pageSize,
      filterProduct: formValues.filterProduct,
      userId: formValues.user ? formValues.user.value : null,
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

    if (!response.data) {
      throw Object({ message: 'Không lấy được thông tin phiếu xuất kho' });
    }
    const convertResponse = response.data.map(item => ({
      ...item,
      documentCodeRefer:
        item.documentRefer && item.documentRefer.documentCodeRefer,
      documentIdRefer: item.documentRefer && item.documentRefer.documentIdRefer,
      deliverCodeRefer:
        item.documentRefer && item.documentRefer.deliverCodeRefer,
      receiverCodeRefer:
        item.documentRefer && item.documentRefer.receiverCodeRefer,
      subTypeRefer: item.documentRefer && item.documentRefer.subTypeRefer,
    }));
    yield put(actions.submitFormSuccess(formValues, convertResponse));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* deleteRecordSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.deleteRecord}/${action.recordId}`,
      optionReq({
        method: 'DELETE',
        authReq: true,
      }),
    );

    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xóa bản ghi này',
      });
    }

    yield put(showSuccess(response.message || 'Đã xóa thành công'));
    yield put(actions.deleteRecordSuccess(action.recordId));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* printSelectedSaga(action) {
  try {
    yield put(setLoading());
    if (action.selectedRecords.length <= 0) {
      throw Object({ message: 'Chưa có phiếu xuất kho nào được chọn.' });
    }

    const ids = action.selectedRecords
      .map(record => record.documentId)
      .join(',');
    const response = yield call(
      request,
      `${APIs.printSelected}?ids=${ids}`,
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

export function* exportExcel(action) {
  try {
    yield put(setLoading());
    const { formSubmittedValues } = action;

    // Mapping keys to match server params
    const queryParams = {
      status: formSubmittedValues.status,
      exportingUnitCode: formSubmittedValues.deliverCode
        ? formSubmittedValues.deliverCode.value
        : 0,
      expStockRecptCode: formSubmittedValues.expStockRecptCode,
      receiverCode: formSubmittedValues.receiverCode
        ? formSubmittedValues.receiverCode.value
        : null,
      exportedDateFrom: formSubmittedValues.exportedDateFrom
        ? formSubmittedValues.exportedDateFrom.toISOString()
        : '',
      exportedDateTo: formSubmittedValues.exportedDateTo
        ? formSubmittedValues.exportedDateTo.toISOString()
        : '',
      exportType: formSubmittedValues.exportType,
      orgCodes: formSubmittedValues.orgCodes,
      filterProduct: formSubmittedValues.filterProduct,
      userId: formSubmittedValues.user ? formSubmittedValues.user.value : null,
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

export default function* ImportStockListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLatest(constants.FETCH_RECEIVER_ORG, fetchReceiverOrgSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
}
