import { all, call, put, takeLeading } from 'redux-saga/effects';
import { localstoreUtilites } from '../../../utils/persistenceData';
import request, {
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from '../../../utils/request';
import { setLoading, loadingError } from '../../App/actions';
import * as actions from './actions';
import * as constants from './constants';
import { makeSaveFileFunc, serializeQueryParams } from '../../App/utils';

const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getCustomerAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/customer/autocomplete`,
  getProductAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/products/auto-complete`,
  getFarmAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants`,
  getsuppliersAuto: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers`,
  getFileDeliveryList: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deliverynote/get-page-data-full`,
  exportExcel: `${PATH_GATEWAY.BFF_SPA_API}/deliverynote/export-delivery-note`,
};
const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* fetchFormDataSaga(action) {
  try {
    yield put(setLoading());
    const { formValues, fetchNew } = action;
    let updatedFormValues = null;

    if (fetchNew) {
      const GETOption = optionReq({ method: 'GET', authReq: true });
      const [orgRes] = yield all([
        call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      ]);

      if (orgRes.data.length < 1) {
        throw Object({
          message: 'Không lấy được danh sách đơn vị',
        });
      }
      if (orgRes.data.length < 1) {
        throw Object({
          message: 'Không lấy được danh sách đơn vị',
        });
      }
      if (orgRes.data.length > 1) {
        const allItem = [{ value: 0, name: 'Tất cả' }];
        orgRes.data = allItem.concat(orgRes.data);
      }

      const formData = {
        plantCode: orgRes.data.map(item => ({
          value: item.value,
          label: item.name,
          type: item.organizationType,
        })),
      };

      yield put(actions.formDataFetched(formData));

      updatedFormValues = {
        ...formValues,
        plantCode:
          formData.plantCode.length > 1
            ? formData.plantCode[1].value
            : formData.plantCode[0].value,
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
    const queryParams = {
      plantCode: !action.values.plantCode ? null : action.values.plantCode,
      vendorCode: !action.values.farmNCC ? null : action.values.farmNCC.value,
      customerCode: !action.values.customer
        ? null
        : action.values.customer.value,
      processDate: !action.values.processDate
        ? null
        : action.values.processDate.toISOString(),
      productName: action.values.productName ? action.values.productName : null,
      productCode: action.values.productCode
        ? action.values.productCode.value
        : null,
    };

    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getFileDeliveryList}?${queryStr}&pageSize=-1`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    if (response.statusCode !== responseCode.ok || !response.data) {
      throw Object({
        message: response.message || 'Không lấy được danh sách File Delivery.',
      });
    }
    yield put(actions.formSubmitSuccess(action.values, response.data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
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

export function* fetchProductSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const productRes = yield call(
      request,
      `${APIs.getProductAuto}?search=${inputValue}`,
      GETOption,
    );
    const fieldData = [
      ...productRes.map(item => ({
        value: item.productCode,
        label: `${item.productCode} ${item.productDescription}`,
      })),
    ];

    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchFarmNCCSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const farmRes = yield call(
      request,
      `${APIs.getFarmAuto}?pageSize=100&search=${inputValue}`,
      GETOption,
    );
    const supRes = yield call(
      request,
      `${APIs.getsuppliersAuto}?pageSize=100&search=${inputValue}`,
      GETOption,
    );
    const fieldData = [
      ...farmRes.data.map(item => ({
        value: item.plantCode,
        label: item.plantName,
      })),
      ...supRes.data.map(data => ({
        label: data.name1,
        value: data.supplierCode,
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
      plantCode: action.values.org ? action.values.org : null,
      vendorCode: !action.values.farmNCC ? null : action.values.farmNCC.value,
      productName: action.values.productName ? action.values.productName : null,
      productCode: action.values.productCode
        ? action.values.productCode.value
        : null,
      customerCode: !action.values.customer
        ? null
        : action.values.customer.value,
      processDate: !action.values.processDate
        ? null
        : action.values.processDate.toISOString(),
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

export default function* sagaWatcher() {
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_CUSTOMER, fetchCustomerSaga);
  yield takeLeading(constants.FETCH_PRODUCT, fetchProductSaga);
  yield takeLeading(constants.FETCH_FARM_NCC, fetchFarmNCCSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
}
