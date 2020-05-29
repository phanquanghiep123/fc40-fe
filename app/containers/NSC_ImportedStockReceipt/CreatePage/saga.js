import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import request, {
  METHOD_REQUEST,
  optionReq,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import { showSuccess, loadingError, setLoading } from 'containers/App/actions';
import {
  SUBMIT_FORM,
  GET_DELIVERY_ORDER_CODE,
  GET_DELIVERY_CODE,
  GET_USER_ID,
  GET_ORGANIZATIONS,
  OPEN_DIALOG,
} from './constants';
import { setOrganizations, updateSchema, closeDialog } from './actions';

function mappingOrgAndSubType(data) {
  return data.map(item => {
    const obj = Object.assign({}, item.organization);
    obj.importSubType = item.importSubType;
    obj.label = obj.name;
    return obj;
  });
}

function* submitForm(action) {
  try {
    yield put(setLoading());
    const body = action.form;
    body.date = new Date(body.date);
    if (action.path === 'create') {
      body.receiverName = body.receiverCode.label;
      body.receiverCode = body.receiverCode.value;
    }
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/importedstockreceipts/${
        action.path
      }`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    yield put(closeDialog());
    yield put(setLoading(false));
    if (action.path === 'create') {
      if (res.statusCode && res.statusCode === responseCode.ok) {
        yield put(showSuccess(res.message));
      }
      action.callback(res.data);
    } else {
      yield put(showSuccess(res.message));
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getDeliveryOrderCodeAutocomplete(action) {
  try {
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/deliveryorders/delivery-order-codes?${
        action.subType ? `subType=${action.subType}` : ''
      }${action.receiverCode ? `&receiverCode=${action.receiverCode}` : ''}${
        action.deliverCode ? `&deliveryCode=${action.deliverCode}` : ''
      }${action.inputText ? `&doCodeFilter=${action.inputText}` : ''}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    if (res.message) throw Object({ message: res.message });
    if (res.data && res.data.length !== 0) {
      // call callback of react-select
      action.callback(
        res.data.map(item => ({
          label: item.deliveryOrderCode,
          value: item.deliveryOrderCode,
          vehicleNumberings: item.vehicleNumberings,
          deliverName: item.deliveryName,
          deliverCode: item.deliverCode,
        })),
      );
    } else {
      action.callback([
        {
          label: '',
          value: '',
        },
      ]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}
// mã bên giao
function* getDeliveryCodeAutocomplete(action) {
  try {
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/deliveryorders/deliver-wait-for-reception${
        action.receiverCode ? `?receiverCode=${action.receiverCode}` : ''
      }${action.inputText ? `&deliveryNameFilter=${action.inputText}` : ''}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    if (res.data && res.data.length !== 0) {
      // call callback of react-select
      action.callback(
        res.data.map(item => ({
          label: item.deliveryName,
          value: item.deliverCode,
        })),
      );
    } else {
      action.callback([
        {
          label: '',
          value: '',
        },
      ]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getUserIdAutocomplete(action) {
  try {
    const res = yield call(
      request,
      `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1&filterName=${
        action.inputText
      }`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
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
            email: item.email,
            id: item.id,
          },
        })),
      );
    } else {
      action.callback([
        {
          label: '',
          value: { id: null, name: null, phone: null, email: null },
        },
      ]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getOrganizations(action) {
  try {
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.BFF_SPA_API
      }/importedstockreceipts/get-org-by-user?userId=${action.userId}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    if (res.statusCode && res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    const result = yield mappingOrgAndSubType(res.data);
    yield put(setOrganizations(action.itemId, result));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

function* getImportStock(action) {
  if (action.importStockId !== null) {
    try {
      const res = yield call(
        request,
        `${PATH_GATEWAY.BFF_SPA_API}/importedstockreceipts/${
          action.importStockId
        }`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      );
      if (res.statusCode && res.statusCode !== responseCode.ok) {
        throw Object({ message: res.message });
      }
      yield put(updateSchema(action.importStockId, res.data));
    } catch (err) {
      yield put(loadingError(err.message));
    }
  }
}

export default function* ImportedStockReceiptWatcher() {
  yield takeLeading(OPEN_DIALOG, getImportStock);
  yield takeLeading(GET_ORGANIZATIONS, getOrganizations); // đơn vị và loại nhập kho
  yield takeLatest(GET_DELIVERY_ORDER_CODE, getDeliveryOrderCodeAutocomplete); // mã biên bản giao hàng
  yield takeLatest(GET_DELIVERY_CODE, getDeliveryCodeAutocomplete); // mã bên giao
  yield takeLatest(GET_USER_ID, getUserIdAutocomplete); // người cân hàng, người giám sát
  yield takeLeading(SUBMIT_FORM, submitForm); // tạo / chỉnh sửa
}
