import { put, all, call, takeLatest, takeLeading } from 'redux-saga/effects';
import * as constants from './constants';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import * as actions from './actions';
import request, { PATH_GATEWAY, optionReq } from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

const APIs = {
  getOrgsByUserId: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`, // ?userId=
  getPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants?pageSize=-1`,
  getSuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=-1`,
  getImportType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts/import-type`,
  getTableData: `${PATH_GATEWAY.BFF_SPA_API}/importedstockreceipts/simple`,
  deleteRecord: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts`, // /{id}
  printSelected: `${PATH_GATEWAY.BFF_SPA_API}/importedstockreceipts/print`, // ?ids=1,2,3
  export: `${PATH_GATEWAY.BFF_SPA_API}/importedstockreceipts/export`,
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
};

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
    let updatedFormValues = null;

    if (fetchNew) {
      const GETOption = optionReq({ method: 'GET', authReq: true });
      const [orgByUserRes, importTypeRes, userRes] = yield all([
        call(request, `${APIs.getOrgsByUserId}?userId=${userId}`, GETOption),
        call(request, APIs.getImportType, GETOption),
        call(request, APIs.getUsers, GETOption),
      ]);

      if (!orgByUserRes.data) {
        throw Object({
          message:
            orgByUserRes.message || 'Không lấy được thông tin đơn vị nhận hàng',
        });
      }
      if (!importTypeRes.data) {
        throw Object({
          message:
            importTypeRes.message || 'Không lấy được thông tin loại nhập kho',
        });
      }

      const formData = {
        receiverOrgCode: [
          ...orgByUserRes.data.map(item => ({
            value: item.value,
            label: item.name,
          })),
        ],
        orgCodes: orgByUserRes.data.map(item => item.value).join(','),
        importType: importTypeRes.data.map(item => ({
          value: item.id,
          label: item.name,
        })),
        weighingStaffs: userRes.data.map(item => ({
          value: item.id,
          label: `${item.lastName} ${item.firstName}`,
          phone: item.phoneNumber,
          email: item.email,
        })),
      };

      yield put(actions.fetchFormDataSuccess(formData));

      updatedFormValues = {
        ...formValues,
        orgCodes: formData.orgCodes || '',
        importType: formData.importType[0]
          ? [formData.importType[0].value]
          : [],
        weighingStaffId: formData.weighingStaffs[0]
          ? formData.weighingStaffs[0].value
          : '',
      };
    }

    yield put(actions.submitForm(updatedFormValues || formValues));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitFormSaga(action) {
  const { formValues } = action;

  try {
    yield put(setLoading());

    // Mapping keys to match server params
    const queryParams = {
      receiverOrgCode: formValues.receiverOrgCode
        ? formValues.receiverOrgCode.value
        : 0,
      impStockRecptCode: formValues.impStockRecptCode,
      importType: formValues.importType,
      doCode: formValues.doCode,
      deliverOrgCode: formValues.deliverOrgCode
        ? formValues.deliverOrgCode.value
        : null,
      importedDateFrom: formValues.importedDateFrom
        ? formValues.importedDateFrom.toISOString()
        : '',
      importedDateTo: formValues.importedDateTo
        ? formValues.importedDateTo.toISOString()
        : '',
      status: formValues.status,
      orgCodes: formValues.orgCodes,
      userId: formValues.weighingStaff ? formValues.weighingStaff.value : '',
      filterProduct: formValues.filterProduct,
      pageSize: formValues.pageSize,
      pageIndex: formValues.pageIndex,
      ids: formValues.ids,
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
      throw Object({ message: 'Không lấy được thông tin phiếu cân nhập kho' });
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

export function* exportExcel(action) {
  try {
    yield put(setLoading());
    const { formSubmittedValues } = action;

    // Mapping keys to match server params

    const queryParams = {
      receiverOrgCode: formSubmittedValues.receiverOrgCode,
      impStockRecptCode: formSubmittedValues.impStockRecptCode,
      importType: formSubmittedValues.importType,
      doCode: formSubmittedValues.doCode,
      deliverOrgCode: formSubmittedValues.deliverOrgCode
        ? formSubmittedValues.deliverOrgCode.value
        : null,
      importedDateFrom: formSubmittedValues.importedDateFrom
        ? formSubmittedValues.importedDateFrom.toISOString()
        : null,
      importedDateTo: formSubmittedValues.importedDateTo
        ? formSubmittedValues.importedDateTo.toISOString()
        : null,
      status: formSubmittedValues.status,
      orgCodes: formSubmittedValues.orgCodes,
      userId: formSubmittedValues.weighingStaff
        ? formSubmittedValues.weighingStaff.value
        : '',
      ids: formSubmittedValues.ids,
      filterProduct: formSubmittedValues.filterProduct,
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
      throw Object({ message: 'Chưa có phiếu nhập kho nào được chọn.' });
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

export function* fetchDeliveryOrgSaga(action) {
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
      throw Object({ message: 'Không lấy được thông tin đơn vị giao hàng' });
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
    yield put(actions.fetchDeliveryOrgSuccess(fieldData));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* ImportStockListPageSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
  yield takeLatest(constants.FETCH_DELIVERY_ORG, fetchDeliveryOrgSaga);
}
