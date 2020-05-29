import { put, call, all, takeLatest, takeLeading } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import * as constants from './constants';
import * as actions from './actions';
import request, {
  PATH_GATEWAY,
  optionReq,
  checkStatus,
} from '../../../utils/request';
import { localstoreUtilites } from '../../../utils/persistenceData';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';
import { linksTo } from './TableSection/linksTo';

const APIs = {
  deleteRecord: `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/DeliveryOrders/`, // id
  getOrgsByUserId: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`, // ?userId=
  getPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants?pageSize=100`,
  getSuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=100`,
  getStatuses: `${PATH_GATEWAY.RESOURCEPLANNING_API}/master-code?parentCode=2`,
  getDoTypes: `${PATH_GATEWAY.RESOURCEPLANNING_API}/master-code?parentCode=1`,
  getRecordsSimple: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/DeliveryOrders/simple`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/DeliveryOrders/print`, // ?ids=1,2,3
  export: `${PATH_GATEWAY.BFF_SPA_API}/DeliveryOrders/export`,
  requestAutoCreate: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts/auto-create`,
  createNewImportBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/deliveryorders/create-new-import-basket-document`,
};

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
      const GETOption = optionReq({
        method: 'GET',
        authReq: true,
      });

      const [orgByUserRes, plantRes, statusRes, doTypes] = yield all([
        call(request, `${APIs.getOrgsByUserId}?userId=${userId}`, GETOption),
        call(request, APIs.getPlants, GETOption),
        call(request, APIs.getStatuses, GETOption),
        call(request, APIs.getDoTypes, GETOption),
      ]);

      if (orgByUserRes.statusCode !== 200 || !orgByUserRes.data) {
        throw Object({
          message:
            orgByUserRes.message ||
            'Không lấy được dữ liệu Đơn vị theo ID người dùng',
        });
      }

      if (!plantRes.data) {
        throw Object({
          message: plantRes.message || 'Không lấy được dữ liệu Farm/NSC/NCC',
        });
      }

      if (!statusRes[0] || !statusRes[0].childs) {
        throw Object({
          message:
            statusRes.message || 'Không lấy được dữ liệu Trạng thái BBGH',
        });
      }

      const data = {
        org: orgByUserRes.data.map(item => ({
          value: item.value,
          label: item.name,
        })),
        receiveOrg: plantRes.data.map(item => ({
          value: item.plantCode,
          label: item.plantName,
        })),
        doTypes: [{ value: 0, label: 'Tất cả' }].concat(
          doTypes[0].childs.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ),
        status: [
          ...(statusRes[0].childs.length > 1
            ? [{ value: '0', label: 'Tất cả' }]
            : []),
          ...statusRes[0].childs.map(item => ({
            value: item.id,
            label: item.name,
          })),
        ],
      };

      yield put(actions.formDataFetched(data));

      updatedFormValues = {
        ...formValues,
        org: data.org[0] ? data.org[0].value : 0,
        status: data.status[1] ? data.status[1].value : data.status[0].value,
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
    const dataAPI = APIs.getRecordsSimple;
    const deliveryCode = action.values.deliveryOrg
      ? action.values.deliveryOrg.value
      : null;
    const receiverCode = action.values.receiveOrg
      ? action.values.receiveOrg.value
      : null;

    // Mapping keys to match server params
    const queryParams = {
      doCode: action.values.deliveryRecordNo,
      orgCode: action.values.org && action.values.org.value,
      orgRole: action.values.orgRole,
      deliveryCode,
      receiverCode,
      plannedArrivalDateFrom: action.values.expectedArrivalDateFrom
        ? action.values.expectedArrivalDateFrom.toISOString()
        : '',
      plannedArrivalDateTo: action.values.expectedArrivalDateTo
        ? action.values.expectedArrivalDateTo.toISOString()
        : '',
      status: action.values.status,
      pageSize: -1,
      pageIndex: null,
      ids: null,
      doType: action.values.doType || '',
      productionOrder: action.values.productionOrder,
      filterProduct: action.values.filterProduct,
      drivingPlate: action.values.drivingPlate,
      filterDocument: action.values.filterDocument,
    };

    // Serialize params to query string
    const queryStr = Object.keys(queryParams)
      .filter(
        key =>
          typeof queryParams[key] !== 'undefined' &&
          queryParams[key] !== null &&
          queryParams[key] !== '',
      )
      .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    const response = yield call(
      request,
      `${dataAPI}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(actions.formSubmitted(action.values, response.data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

// Input selectedRows, callback
export function* printSelectedSaga(action) {
  try {
    yield put(setLoading());
    if (action.selectedRows.length <= 0) {
      throw Object({ message: 'Chưa có biên bản nào được chọn' });
    }

    const idsString = action.selectedRows.map(record => record.doId).join(',');
    const response = yield call(
      request,
      `${APIs.print}?ids=${idsString}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );

    if (!response.data) {
      throw Object({
        message: response.message || 'Không có thông tin in BBGH',
      });
    }

    action.callback(response.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* deleteRecordSaga(action) {
  try {
    yield put(setLoading());

    if (typeof action.id === 'undefined') {
      throw Object({ message: 'Chưa lấy được ID để xóa' });
    }

    const response = yield call(
      request,
      `${APIs.deleteRecord}${action.id}`,
      optionReq({
        method: 'DELETE',
        authReq: true,
      }),
    );

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

// Input formSubmittedValues, callback
export function* exportExcelSaga(action) {
  try {
    yield put(setLoading());
    const { formSubmittedValues, filterColumn } = action;
    // Mapping keys to match server params
    const queryParams = {
      doCode: formSubmittedValues.deliveryRecordNo,
      orgCode: formSubmittedValues.org && formSubmittedValues.org.value,
      orgRole: formSubmittedValues.orgRole,
      deliveryCode: formSubmittedValues.deliveryOrg,
      receiverCode: formSubmittedValues.receiveOrg,
      plannedArrivalDateFrom:
        formSubmittedValues.expectedArrivalDateFrom instanceof Date
          ? formSubmittedValues.expectedArrivalDateFrom.toISOString()
          : '',
      plannedArrivalDateTo:
        formSubmittedValues.expectedArrivalDateTo instanceof Date
          ? formSubmittedValues.expectedArrivalDateTo.toISOString()
          : '',
      status: formSubmittedValues.status,
      pageSize: null,
      pageIndex: null,
      ids: null,
      sortKey: filterColumn.sortKey,
      sortType: filterColumn.sortType,
      doType: formSubmittedValues.doType || '',
      productionOrder: formSubmittedValues.productionOrder,
      filterProduct:
        formSubmittedValues.filterProduct && formSubmittedValues.filterProduct,
      drivingPlate: formSubmittedValues.drivingPlate,
      filterDocument:
        formSubmittedValues.filterDocument &&
        formSubmittedValues.filterDocument,
    };
    const queryStr = serializeQueryParams(queryParams);
    yield call(
      request,
      `${APIs.export}?${queryStr}`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
      makeSaveFileFunc(),
    );

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* requestAutoCreateSaga(action) {
  try {
    yield put(setLoading());
    const { id } = action;
    const response = yield call(
      request,
      `${APIs.requestAutoCreate}`,
      optionReq({
        method: 'POST',
        authReq: true,
        body: {
          deliveryOrderId: id,
        },
      }),
    );

    if (response.statusCode !== 200 || !response.data) {
      throw Object({ message: response.message || 'Có lỗi xảy ra khi Cân' });
    }

    const queryParams = {
      documentId: response.data.documentId,
      plantCode: response.data.plantCode,
    };
    const queryStr = serializeQueryParams(queryParams);

    yield put(setLoading(false));
    yield put(push(`${linksTo.weighingPage}?${queryStr}`));
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

function* onCreateNewImportBasketSaga(action) {
  try {
    const { data, callback } = action.payload;
    yield put(setLoading());
    const POSTOption = optionReq({
      method: 'POST',
      body: data,
      authReq: true,
    });
    const res = yield call(
      request,
      `${APIs.createNewImportBasket}`,
      POSTOption,
    );
    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Không lấy được thông tin',
      });
    }
    yield put(showSuccess(res.message));
    if (typeof callback === 'function') {
      yield callback(res.data);
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_DELIVERY_ORG, fetchDeliveryOrgSaga);
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.DELETE_RECORD, deleteRecordSaga);
  yield takeLeading(constants.PRINT_SELECTED, printSelectedSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcelSaga);
  yield takeLatest(constants.REQUEST_AUTO_CREATE, requestAutoCreateSaga);
  yield takeLeading(
    constants.CREATE_NEW_IMPORT_BASKET_DOCUMENT,
    onCreateNewImportBasketSaga,
  );
}
