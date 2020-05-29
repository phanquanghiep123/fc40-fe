/* eslint-disable indent */
import { call, put, takeLeading } from 'redux-saga/effects';
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
  getDeliverAuto: `${
    PATH_GATEWAY.BFF_SPA_API
  }/reportorderquantity/get-autocomplete-deliver`,
  getProductAuto: `${
    PATH_GATEWAY.BFF_SPA_API
  }/deli-export-transfer/get-autocomplete-product-deli`,
  getBCDUSLDHList: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/reportorderquantity/get-page-data`,
  exportExcel: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/reportorderquantity/export-data`,
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
      const orgRes = yield call(
        request,
        `${APIs.getOrg}?userId=${auth.meta.userId}`,
        GETOption,
      );

      if (orgRes.statusCode !== 200 || !orgRes.data || !orgRes.data.length) {
        throw Object({
          message: 'Không lấy được danh sách đơn vị',
        });
      }

      const formData = {
        org: [
          ...(orgRes.data.length > 1
            ? [
                {
                  value: orgRes.data.map(item => item.value).join(','),
                  label: 'Tất cả',
                },
              ]
            : []),
          ...orgRes.data.map(item => ({
            value: item.value,
            label: item.name,
            type: item.organizationType,
          })),
        ],
      };
      yield put(actions.formDataFetched(formData));

      updatedFormValues = {
        ...formValues,
        org: formData.org.length ? formData.org[0].value : '',
      };
    }
    yield put(actions.submitForm(updatedFormValues || formValues));
    // yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* submitFormSaga(action) {
  try {
    yield put(setLoading());
    const { values } = action;

    const queryParams = {
      receiverCode: values.org ? values.org : null,
      deliverCodes: values.deliverCodes
        ? values.deliverCodes.map(item => item.value).join(',')
        : '',
      importedDateFrom: values.importedDateFrom
        ? values.importedDateFrom.toISOString()
        : null,
      importedDateTo: values.importedDateTo
        ? values.importedDateTo.toISOString()
        : null,
      deliverName: values.deliverName ? values.deliverName : null,
      productName: values.productName ? values.productName : null,
      productCode: values.productCode ? values.productCode.value : null,
    };
    const queryStr = serializeQueryParams(queryParams);
    const response = yield call(
      request,
      `${APIs.getBCDUSLDHList}?${queryStr}&pageSize=-1`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
    );
    if (response.statusCode !== responseCode.ok || !response.data) {
      throw Object({
        message:
          response.message ||
          'Không lấy được danh sách Báo Cáo Đáp Ứng Sản Lượng Đặt Hàng.',
      });
    }
    yield put(actions.formSubmitSuccess(action.values, response.data));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* fetchDeliverSaga(action) {
  try {
    const { inputValue, receiverCode, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const queryParams = {
      deliverFilter: inputValue,
      receiverCode,
    };
    const queryStr = serializeQueryParams(queryParams);
    const deliverRes = yield call(
      request,
      `${APIs.getDeliverAuto}?${queryStr}`,
      GETOption,
    );
    const fieldData = [
      ...deliverRes.data.map(item => ({
        value: item.supplierCode,
        label: `${item.name1} - ${item.supplierCode}`,
      })),
    ];
    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportExcel(action) {
  try {
    yield put(setLoading());
    const { values } = action;

    const queryParams = {
      receiverCode: values.org ? values.org : null,
      deliverCodes: values.deliverCodes
        ? values.deliverCodes.map(item => item.value).join(',')
        : '',
      importedDateFrom: values.importedDateFrom
        ? values.importedDateFrom.toISOString()
        : null,
      importedDateTo: values.importedDateTo
        ? values.importedDateTo.toISOString()
        : null,
      deliverName: values.deliverName ? values.deliverName : null,
      productName: values.productName ? values.productName : null,
      productCode: values.productCode ? values.productCode.value : null,
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

export function* fetchProductSaga(action) {
  try {
    const { inputValue, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const creatorRes = yield call(
      request,
      `${APIs.getProductAuto}?search=${inputValue}&pageSize=-1`,
      GETOption,
    );
    const fieldData = [
      ...creatorRes.data.map(item => ({
        value: item.productCode,
        label: `${item.productCode} - ${item.productName}`,
      })),
    ];
    yield callback(fieldData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* sagaWatcher() {
  yield takeLeading(constants.SUBMIT_FORM, submitFormSaga);
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.FETCH_DELIVER, fetchDeliverSaga);
  yield takeLeading(constants.FETCH_PRODUCT, fetchProductSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
}
