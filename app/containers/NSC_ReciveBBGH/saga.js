import { resetCurrentTime } from 'utils/datetimeUtils';
import { call, put, all, takeLatest, takeLeading } from 'redux-saga/effects';
import request, {
  METHOD_REQUEST,
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import { loadingError, setLoading, showSuccess } from '../App/actions';
import {
  setInitReceivingDO,
  updateReceivingDeliveryOrderSuccess,
  backToPreviousPage,
} from './actions';
import {
  GET_INIT_RECEIVING_DELIVERY_ORDER,
  SUBMIT_FORM,
  GET_RECEIVING_PERSON_AUTOCOMPLETE,
  SAVE_CREATE_IMPORT,
} from './constants';
import { mappingDeliveryOder } from './Utils';
import { DELIVERY_ORDER_FARM_TO_PLANT_2 } from '../App/constants';

function* getInitReceivingDeliveryOrder(action) {
  try {
    const [deliveryOrder, masterCode, vehicleRoute, checkDocument] = yield all([
      call(
        request,
        `${
          PATH_GATEWAY.BFF_SPA_API
        }/deliveryorders/update-screen?deliveryOrderId=${
          action.id
        }&includeImages=true`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${PATH_GATEWAY.RESOURCEPLANNING_API}/master-code`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/deliveryorders/vehicle-route`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/deliveryorders/check-save-and-create-import-basket-document?id=${
          action.id
        }`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
    ]);
    if (deliveryOrder.message) {
      throw Object({ message: deliveryOrder.message });
    }
    if (deliveryOrder.deliveryOrder.doType === DELIVERY_ORDER_FARM_TO_PLANT_2) {
      throw Object({ message: 'Biên bản giao hàng không cần tiếp nhận' });
    }
    const leadTime = yield call(
      request,
      `${
        PATH_GATEWAY.RESOURCEPLANNING_API
      }/regulated-shipping-leadtime?deliveryCode=${
        deliveryOrder.deliveryOrder.deliverCode
      }&receiveCode=${deliveryOrder.deliveryOrder.receiverCode}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    yield put(
      setInitReceivingDO(
        mappingDeliveryOder(
          deliveryOrder.deliveryOrder,
          action.shipperId,
          leadTime.data,
        ),
        masterCode,
        leadTime.data,
        vehicleRoute.data,
        checkDocument,
      ),
    );
  } catch (err) {
    yield put(loadingError(err.message));
    yield put(backToPreviousPage());
  }
}

function* submitForm(action) {
  const formData = new FormData();
  const timeSubmit = new Date();
  Object.keys(action.form).forEach(key => {
    if (key === 'deleteIds' || key === 'imageFiles') {
      action.form[key].forEach(item => {
        formData.append(key, item);
      });
      return;
    }
    if (key === 'deliveryDateTime' || key === 'stockReceivingDateTime') {
      formData.append(
        key,
        resetCurrentTime(action.form[key], timeSubmit).toISOString(),
      );
      return;
    }
    if (key !== 'deliveryOrderTransportViolationList') {
      formData.append(key, action.form[key]);
    }
  });
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/deliveryorders/${
        action.id
      }/${action.path}/receive`,

      optionReq({
        method: METHOD_REQUEST.PUT,
        body: formData,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    action.callback();
    yield put(updateReceivingDeliveryOrderSuccess(res));
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getReceivingPerson(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/user/get-by-org?orgId=${
        action.orgId
      }&filterName=${action.inputText}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (res && res.message) {
      throw Object({ message: res.message });
    }

    if (res && res.length !== 0) {
      // call callback of react-select
      action.callback(
        res.data.map(item => ({
          label: `${item.lastName} ${item.firstName}`,
          value: {
            name: `${item.lastName} ${item.firstName}`,
            phone: item.phoneNumber,
            id: item.Id,
          },
        })),
      );
    } else {
      action.callback([{ label: '', value: '' }]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* saveCreateImportSaga(action) {
  try {
    const response = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/deliveryorders/save-and-create-import-basket-document`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.form,
        authReq: true,
      }),
    );
    if (response.statusCode !== responseCode.ok) {
      throw Object({ message: response.message });
    }
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback(response.data);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
export default function* ReceivingDeliveryOrderWatcher() {
  yield takeLeading(
    GET_INIT_RECEIVING_DELIVERY_ORDER,
    getInitReceivingDeliveryOrder,
  );
  yield takeLeading(SUBMIT_FORM, submitForm);
  yield takeLatest(GET_RECEIVING_PERSON_AUTOCOMPLETE, getReceivingPerson);
  yield takeLeading(SAVE_CREATE_IMPORT, saveCreateImportSaga);
}
