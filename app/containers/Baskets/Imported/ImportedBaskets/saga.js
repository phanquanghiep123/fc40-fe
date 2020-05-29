import { call, all, put, takeLeading } from 'redux-saga/effects';
import request, {
  optionReq,
  PATH_GATEWAY,
  requestAuth,
  METHOD_REQUEST,
  checkStatus,
} from 'utils/request';
import { localstoreUtilites } from 'utils/persistenceData';
import { showSuccess, loadingError, setLoading } from 'containers/App/actions';
import dateFns from 'date-fns';
import { formatToNumber } from 'utils/numberUtils';
import {
  GET_DELIVERY_ORDER,
  GET_INIT_FORM_DATA,
  GET_INIT_FORM_DATA_SUCCESS,
  INIT_VALUE,
  CREATE,
  UPDATE,
  COMPLETE,
  GET_LOCATOR_TO,
  GET_LOCATOR_TO_SUCCESS,
  TYPE_FORM,
  GET_DO_BASKET_DETAIL,
  GET_DO_BASKET_DETAIL_SUCCESS,
  TYPE_PNKS,
  DELETE_ROW,
  DELETE_ROW_SUCCESS,
  GET_DELIVER,
  PRINT,
  GET_TO_IMPORT_RECEIPT,
  CHANGE_DELIVERY_ORDER_SUCCESS,
  GET_TO_IMPORT_RECEIPT_SUCCESS,
  PRINT_PREVIEW,
  PATH,
} from './constants';
import { serializeQueryParams } from '../../../App/utils';

const APIs = {
  getReceiver: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getDeliverTransition: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants`,
  create: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/create`,
  update: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/edit`,
  complete: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/complete`,
  getTypeBaskets: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/import-type-create`,
  getBasket: `${PATH_GATEWAY.RESOURCEPLANNING_API}/pallet-baskets`,
  getBasketLocatorTo: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/get-basket-locator`,
  getDeliveryOrder: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/auto-complete-delivery-order`,
  getSuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers`,
  getCustomer: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-distinct`,
  getDoBaskets: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/loan-baskets`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/import-stock-receipts-basket/print`,
  printAsset: `${PATH_GATEWAY.BFF_SPA_API}/asset-document/print`,
  getDetail: `${
    PATH_GATEWAY.BFF_SPA_API
  }/import-stock-receipts-basket/get-basket-document`,
  getDetailNewImport: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/asset-document`,
  deleteBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/delete-basket-document-detail`,
  getToImportReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/importedstockreceipts-basket/get-import-stock-quantity`,
};

const auth = localstoreUtilites.getAuthFromLocalStorage();
function* create(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.create}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.payload,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* update(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.update}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.payload,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* complete(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.complete}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.payload,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getInitFormData(action) {
  const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
  try {
    yield put(setLoading());
    const { form, pathname } = action.payload;
    const [importType, receivers, users, baskets] = yield all([
      call(requestAuth, APIs.getTypeBaskets),
      call(requestAuth, `${APIs.getReceiver}?userId=${userId}`),
      call(requestAuth, APIs.getUsers),
      call(requestAuth, APIs.getBasket),
    ]);
    const subTypeList = importType.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    yield put({
      type: GET_INIT_FORM_DATA_SUCCESS,
      data: subTypeList,
      receivers: receivers.data.map(item => ({
        value: item.value,
        label: item.name,
      })),
      users: users.data.map(item => ({
        value: item.id,
        phoneNumber: item.phoneNumber ? item.phoneNumber : '',
        email: item.email ? item.email : '',
        label: `${item.lastName} ${item.firstName}`,
      })),
      baskets: baskets.data.map(item => ({
        basketCode: item.palletBasketCode,
        basketName: item.shortName,
        weight: item.netWeight,
        uoM: item.uoM,
      })),
    });

    if (form === TYPE_FORM.CREATE) {
      yield initForm(subTypeList, receivers.data, pathname);
      if (action.callback) {
        yield action.callback({
          deliverCode: null,
          receiverCode: receivers.data[0].value,
          subType: TYPE_PNKS.PNKS_DIEU_CHUYEN,
        });
      }
    } else {
      yield getBasketById(action.payload, action.callback, users);
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* initForm(subTypeList, receivers, pathname) {
  const items = [];
  for (let i = 0; i < 5; i += 1) {
    items.push({ stt: i + 1 });
  }
  const initValues = {};
  // eslint-disable-next-line prefer-destructuring
  if (pathname === PATH.DSXNKSSH) {
    const [subtype] = subTypeList;
    initValues.importSubType = subtype;
    initValues.section3 = [{}, {}, {}, {}, {}];
  } else {
    const [subtype] = subTypeList.filter(
      item => item.value === TYPE_PNKS.PNKS_DIEU_CHUYEN,
    );
    initValues.importSubType = subtype;
    initValues.section3 = [];
  }
  initValues.importor = {
    value: auth.meta.userId,
    label: auth.meta.fullName,
  };
  initValues.phoneNumber = auth.meta.phoneNumber ? auth.meta.phoneNumber : '';
  initValues.email = auth.meta.email ? auth.meta.email : '';
  initValues.deliver = null;
  initValues.receiver = {
    value: receivers[0].value,
    label: receivers[0].name,
  };
  initValues.supervisor = null;
  initValues.deliveryOrder = null;
  initValues.date = new Date();
  initValues.section2 = [];
  initValues.section4 = [];
  initValues.fakeBasketDetail = [];
  initValues.fakeDoBasketDetail = [];
  initValues.isChecked = false;
  yield put({ type: INIT_VALUE, initValues });
}

function* getBasketById(payload, callback, users) {
  const { id, typeNewImport, form } = payload;
  let response = {};
  if (typeNewImport) {
    response = yield call(
      request,
      `${APIs.getDetailNewImport}/${id}`,
      optionReq(),
    );
    checkStatus(response);
    const res = response.data;
    const user = users.data.find(item => item.id === res.userId);
    let phoneNumber = '';
    let userName = '';
    let email = '';
    if (user) {
      userName = user.lastName ? `${user.lastName} ${user.firstName}` : '';
      phoneNumber = user.phoneNumber ? user.phoneNumber : '';
      email = user.email ? user.email : '';
    }
    const initValues = {
      assetDocumentCode: res.assetDocumentCode && res.assetDocumentCode,
      basketDocumentCode: res.basketDocumentCode && res.basketDocumentCode,
      basketCancellReceiptCode:
        res.basketCancellReceiptCode && res.basketCancellReceiptCode,
      importSubType: {
        label: res.assetDocumentName,
        value: 11,
      },
      importType: res.importSubType,
      assetType: res.assetType && res.assetType,
      deliver: {
        label: res.deliverName,
        value: res.deliverCode,
        deliverType: res.deliverType,
      },
      receiver: {
        label: res.plantName,
        value: res.plantCode,
      },
      deliveryOrder: {
        label: res.deliveryOrderCode,
        value: res.deliveryOrderCode,
      },
      date: new Date(res.date),
      userId: {
        label: userName,
        value: res.userId,
      },
      importor: {
        label: userName,
        value: res.userId,
      },
      supervisor: {
        label: res.supervisorName,
        value: res.supervisorId,
      },
      printTimes: res.printTimes,
      note: res.note,
      phoneNumber,
      email,
      registerPlace: res.registerPlace && res.registerPlace,
      assetDetails: mappingAsset(res),
      documentCode: res.documentCode && res.documentCode,
      documentStatus: res.documentStatus && res.documentStatus,
      isChecked: false,
      statusName: res.statusName,
      section4: mappingSection4(res),
      stockTakingCode: res.stockTakingCode,
    };
    // eslint-disable-next-line prefer-destructuring
    yield put({ type: INIT_VALUE, initValues });
  } else {
    response = yield call(
      request,
      `${APIs.getDetail}?id=${id}&form=${formatToNumber(form)}`,
      optionReq(),
    );
    checkStatus(response);
    const res = response.data;
    const user = users.data.find(item => item.id === res.userId);
    const checkEdit = () => {
      if (res.basketDetails) {
        return res.basketDetails.length === 0;
      }
      return false;
    };
    let email = '';
    let phoneNumber = '';
    let userName = '';
    if (user) {
      email = user.email ? user.email : '';
      phoneNumber = user.phoneNumber ? user.phoneNumber : '';
      userName = user.lastName ? `${user.lastName} ${user.firstName}` : '';
    }
    const initValues = {
      basketDocumentCode: res.basketDocumentCode && res.basketDocumentCode,
      assetDocumentCode: res.assetDocumentCode && res.assetDocumentCode,
      importSubType: {
        label: res.importSubTypeName,
        value: res.importSubType,
      },
      assetType: res.assetType && res.assetType,
      deliver: {
        label: res.deliverName,
        value: res.deliverCode,
        deliverType: res.deliverType,
      },
      receiver: {
        label: res.receiverName,
        value: res.receiverCode,
      },
      deliveryOrder: {
        label: res.deliveryOrderCode,
        value: res.deliveryOrderCode,
      },
      date: new Date(res.date),
      userId: {
        label: userName,
        value: res.userId,
      },
      importor: {
        label: userName,
        value: res.userId,
      },
      supervisor: {
        label: res.supervisorName,
        value: res.supervisorId,
      },
      printTimes: res.printTimes,
      note: res.note,
      email,
      phoneNumber,
      registerPlace: res.registerPlace && res.registerPlace,
      section2: mappingDoBasket(res),
      section3: mappingBasket(res),
      assetDetails: mappingAsset(res),
      fakeBasketDetail: [],
      fakeDoBasketDetail: [],
      status: res.status,
      checkEdit: checkEdit(),
      originAdjustCode: res.originAdjustCode && res.originAdjustCode,
      originAdjust: res.originAdjustName && res.originAdjustName,
      referType: res.referType && res.referType,
      // isForBasket = true: loai danh cho khay sot
      isForBasket: res.isForBasket && res.isForBasket,
      createFrom: res.createFrom && res.createFrom,
      documentCode: res.documentCode && res.documentCode,
      // documentStatus: trang thai phieu nhap kho
      documentStatus: res.documentStatus && res.documentStatus,
      statusName: res.statusName,
      section4: [],
    };
    const baskets = {
      basketDetails: res.basketDetails ? res.basketDetails : [],
      loanBasketDetails: res.loanBasketDetails ? res.loanBasketDetails : [],
      doBasketDetails: res.doBasketDetails ? res.doBasketDetails : [],
    };
    if (callback) {
      if (
        res.importSubType === TYPE_PNKS.PNKS_DIEU_CHUYEN ||
        res.importSubType === TYPE_PNKS.PNKS_TRA ||
        res.importSubType === TYPE_PNKS.PNKS_MOI ||
        res.importSubType === TYPE_PNKS.PNKS_MUON
      ) {
        yield callback(
          {
            deliverCode: res.deliverCode && res.deliverCode,
            receiverCode: res.receiverCode && res.receiverCode,
            subType: res.importSubType || res.subType,
          },
          baskets,
        );
      }
    }
    // eslint-disable-next-line prefer-destructuring
    yield put({ type: INIT_VALUE, initValues });
  }
}

function mappingDoBasket(data) {
  const result = [];
  if (data.importSubType === TYPE_PNKS.PNKS_TRA) {
    if (data.loanBasketDetails) {
      data.loanBasketDetails.forEach(item => {
        result.push({
          ...item,
        });
      });
    }
  } else if (data.doBasketDetails) {
    data.doBasketDetails.forEach(item => {
      result.push({
        ...item,
      });
    });
  }
  return result;
}

function mappingBasket(data) {
  const result = [];
  if (data.basketDetails) {
    data.basketDetails.forEach(item => {
      result.push({
        ...item,
        // kho dich
        locatorReceiverId: item.locatorReceiverId,
        locatorReceiverName: item.locatorReceiverName,
        locatorReceiver: item.locatorReceiverId,
        // kho nguon
        locatorDeliverId: item.locatorDeliverId,
        locatorDeliver: item.locatorDeliverName,
      });
    });
  }
  return result;
}

function mappingAsset(data) {
  const result = [];
  if (data.assetDetails && data.assetType && data.assetType !== 4) {
    data.assetDetails.forEach(item => {
      result.push({
        ...item,
        depreciationStartDate: dateFns.format(
          new Date(item.depreciationStartDate),
          'dd/MM/yyyy',
        ),
      });
    });
  }
  if (data.assetType && data.assetType === 4) {
    data.assetCancellDetails.forEach(item => {
      result.push({
        ...item,
      });
    });
  }
  return result;
}

function mappingSection4(data) {
  const result = [];
  if (data.assetBasketDetails) {
    if (data.assetType && data.assetType === 4) {
      data.assetBasketDetails.forEach(item => {
        result.push({
          ...item,
        });
      });
    }
  }
  return result;
}

function* getDeliveryOrder(action) {
  try {
    const queryStr = serializeQueryParams(action.payload);
    const res = yield call(
      request,
      `${APIs.getDeliveryOrder}?${queryStr}`,
      optionReq(),
    );
    checkStatus(res);
    if (res.data.length === 1) {
      yield getLocatorToSaga({ payload: res.data[0].receiverCode });
    }
    yield put({
      type: CHANGE_DELIVERY_ORDER_SUCCESS,
      data: res.data.map(item => ({
        ...item,
        value: item.deliveryOrderCode,
        label: item.deliveryOrderCode,
        deliverType: 1,
        doBasketDetails: mappingDoBasket(item),
        basketDetails: mappingDoBasket(item),
        isForBasket: item.isForBasket,
      })),
      typeForm: action.typeForm,
    });
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getLocatorToSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.getBasketLocatorTo}?plantCode=${action.payload}`,
      optionReq(),
    );
    yield put({
      type: GET_LOCATOR_TO_SUCCESS,
      data: response.data,
    });
    if (action.callback) {
      yield action.callback(response.data);
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getDoBasketDetailSaga(action) {
  const { payload, data } = action;
  const queryStr = serializeQueryParams(payload);

  if (
    payload.importSubType === TYPE_PNKS.PNKS_TRA &&
    payload.deliverCode &&
    payload.receiverCode
  ) {
    try {
      const res = yield call(
        request,
        `${APIs.getDoBaskets}?${queryStr}`,
        optionReq(),
      );

      const response = {
        data: res.data.map(item => ({
          ...item,
          diffrentLoanReturn: item.loanQuantity - 0,
        })),
      };
      yield put({ type: GET_DO_BASKET_DETAIL_SUCCESS, data, response });
    } catch (e) {
      yield put(loadingError(e.message));
    }
  } else {
    yield put({ type: GET_DO_BASKET_DETAIL_SUCCESS, data });
  }
}

function* deleteSaga(action) {
  const queryStr = serializeQueryParams(action.id);
  try {
    if (action.id.basketDetailId) {
      const response = yield call(
        request,
        `${APIs.deleteBasket}?${queryStr}`,
        optionReq({
          method: METHOD_REQUEST.DELETE,
          authReq: true,
        }),
      );
      checkStatus(response);
      yield put(showSuccess(response.message));
    }
    yield put({ type: DELETE_ROW_SUCCESS, rowIndex: action.rowIndex });
    if (action.callback) {
      yield action.callback();
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getDeliverSaga(action) {
  const { params, callback } = action.payload;
  try {
    if (params.importSubType === TYPE_PNKS.PNKS_DIEU_CHUYEN) {
      const res = yield call(
        request,
        `${APIs.getDeliverTransition}?search=${params.filter}&pageSize=100`,
        optionReq(),
      );
      const fieldData = [
        ...res.data.map(item => ({
          value: item.plantCode,
          deliverType: 1,
          label: `${item.plantCode} ${item.plantName}`,
        })),
      ];

      if (callback) {
        yield callback(fieldData);
      }
    } else {
      const [supplierRes, customerRes] = yield all([
        call(
          request,
          `${APIs.getSuppliers}?search=${params.filter}&pageSize=100`,
          optionReq(),
        ),
        call(
          request,
          `${APIs.getCustomer}?filter=${params.filter}&pageSize=100`,
          optionReq(),
        ),
      ]);

      const fieldData = [
        ...supplierRes.data.map(item => ({
          value: item.supplierCode,
          deliverType: 2,
          label: `${item.supplierCode} ${item.name1}`,
        })),
        ...customerRes.data.map(item => ({
          value: item.customerCode,
          deliverType: 3,
          label: `${item.customerCode} ${item.customerName}`,
        })),
      ];
      if (callback) {
        yield callback(fieldData);
      }
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* printSaga(action) {
  try {
    const { id, onRePrint, typeNewImport } = action.payload;
    yield put(setLoading());
    let response = {};
    if (typeNewImport) {
      response = yield call(
        request,
        `${APIs.printAsset}?ids=${id}&isRePrint=${onRePrint}`,
        optionReq(),
      );
    } else {
      response = yield call(
        request,
        `${APIs.print}?ids=${id}&isRePrint=${onRePrint}`,
        optionReq(),
      );
    }
    checkStatus(response);
    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }
    const wnd = window.open('', '', '_blank');
    if (wnd === null)
      throw Object({
        message:
          'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
      });
    wnd.document.write(response.data);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* printPreviewSaga(action) {
  try {
    const { id, callback, typeNewImport } = action.payload;
    yield put(setLoading());
    let response = {};
    if (typeNewImport) {
      response = yield call(
        request,
        `${APIs.printAsset}?ids=${id}&isPreview=true`,
        optionReq(),
      );
    } else {
      response = yield call(
        request,
        `${APIs.print}?ids=${id}&isPreview=true`,
        optionReq(),
      );
    }
    checkStatus(response);
    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }
    if (callback) yield callback(response.data);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getToImportReceiptSaga(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.getToImportReceipt}?basketDocumentCode=${action.payload}`,
      optionReq(),
    );
    checkStatus(response);
    yield put({ type: GET_TO_IMPORT_RECEIPT_SUCCESS, data: response.data });
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export default function* importedBasketsSaga() {
  yield takeLeading(GET_INIT_FORM_DATA, getInitFormData);
  yield takeLeading(GET_DELIVERY_ORDER, getDeliveryOrder);
  yield takeLeading(CREATE, create);
  yield takeLeading(UPDATE, update);
  yield takeLeading(COMPLETE, complete);
  yield takeLeading(GET_LOCATOR_TO, getLocatorToSaga);
  yield takeLeading(GET_DO_BASKET_DETAIL, getDoBasketDetailSaga);
  yield takeLeading(DELETE_ROW, deleteSaga);
  yield takeLeading(GET_DELIVER, getDeliverSaga);
  yield takeLeading(PRINT, printSaga);
  yield takeLeading(PRINT_PREVIEW, printPreviewSaga);
  yield takeLeading(GET_TO_IMPORT_RECEIPT, getToImportReceiptSaga);
}
