/* eslint-disable indent */
// Individual exports for testing
import { call, put, takeLeading, all, takeLatest } from 'redux-saga/effects';
import find from 'lodash/find';
import moment from 'moment';
import request, {
  METHOD_REQUEST,
  responseCode,
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  checkStatus,
} from '../../../../../utils/request';
import { localstoreUtilites } from '../../../../../utils/persistenceData';
import { loadingError, setLoading, showSuccess } from '../../../../App/actions';
import * as constants from './constants';
import * as actions from './actions';
import {
  ASSETS_TABLE,
  ASSETS_TABLE_PINNED,
  assetsTableFields,
  BASKETS_TABLE,
  BASKETS_TABLE_PINNED,
  basketsTableFields,
  generalSectionFields,
} from './CancelReceipt/constants';
import {
  getNested,
  getSAVWithDefault,
  getSAVWithoutJoin,
  serializeQueryParams,
} from '../../../../App/utils';
import { formatToCurrency } from '../../../../../utils/numberUtils';
export const MASTER_URL = PATH_GATEWAY.MASTERDATA_API;
export const CAPACITYCONTROL_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;

export const formatBasketDetail = data => {
  const nextData = {
    ...data,
    basketDocumentDetails: data.basketDocumentDetails.filter(
      item => item && item.basketCode,
      // item && item.quantity > 0 && item.basketCode && item.basketQuantity > 0,
    ),
  };
  return nextData;
};

const auth = localstoreUtilites.getAuthFromLocalStorage();
const APIs = {
  getOrg: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`, // ?userId={id}
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getType: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/export-type-create`,
  getBaskets: `${MASTER_URL}/pallet-baskets?pageSize=-1&sortDirection=asc`,
  getBasketsAuto: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/get-data-pallet-basket`,
  getSellDocumentAuto: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/auto-complete-document`,
  getBasketsVendor: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/get-data-pallet-basket-by-vendor`,
  getDeliverOrder: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/auto-complete-delivery-order`,
  getBasketsId: `${PATH_GATEWAY.BFF_SPA_API}/exportstockreceiptsbaskets`,
  deleteRow: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/delete-basket-document-detail`,
  getPlants: `${PATH_GATEWAY.RESOURCEPLANNING_API}/plants?pageSize=-1`,
  getCustomer: `${
    PATH_GATEWAY.RESOURCEPLANNING_API
  }/customer/autocomplete-distinct`,
  getNVC: `${PATH_GATEWAY.RESOURCEPLANNING_API}/customer/autocomplete-distinct`,
  getsuppliers: `${PATH_GATEWAY.RESOURCEPLANNING_API}/suppliers?pageSize=100`,
  exportPdf: `${PATH_GATEWAY.BFF_SPA_API}/exportstockreceiptsbaskets/print`,
  getBasketLocators: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/get-basket-locator`,
  getLoanBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/loan-baskets`,
  getCancelRequestsAC: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/cancellation-request-receipt-codes`, // lấy danh sách phiếu yêu cầu huỷ autocomplete
  getCancelReceiptByRequestId: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exportstockreceiptsbaskets/export-cancellation`, // /{receiptId} - id của phiếu yêu cầu huỷ
  getCancelReceiptById: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exportstockreceiptsbaskets`, // /{id} - id của phiếu yêu cầu huỷ
  getExportReceiptById: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exportstockreceiptsbaskets`, // /{id} - id của phiếu xuất huỷ khay sọt
  getBigImageBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/image-basket-detail`, // /{id} - lấy ảnh lớn khay sọt để hiển thị popup
  submitSaveCancelReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts/exported-basket-cancellation`, // tạo/update phiếu xuất huỷ khay sọt
  submitCompleteCancelReceipt: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/complete-export-cancellation`, // hoàn thành phiếu xuất huỷ khay sọt
  printCancelReceipt: `${
    PATH_GATEWAY.BFF_SPA_API
  }/exportstockreceiptsbaskets/print`, // in/xem trước phiếu xuất huỷ ks
};

export function* getValueForm(action) {
  const { form, callback } = action.payload;
  try {
    yield put(setLoading());
    const GETOption = optionReq();
    const [typeRes, orgRes, usersRes, basketsRes] = yield all([
      call(request, APIs.getType, GETOption),
      call(request, `${APIs.getOrg}?userId=${auth.meta.userId}`, GETOption),
      call(request, APIs.getUsers, GETOption),
      call(request, APIs.getBaskets, GETOption),
    ]);

    const getSubType = typeRes.data.map(item => ({
      value: item.id,
      label: item.name,
    }));
    // List đơn vị
    if (
      orgRes.statusCode !== responseCode.ok ||
      !orgRes.data ||
      orgRes.data.length < 1
    ) {
      throw Object({
        message: orgRes.message || 'Không lấy được danh sách đơn vị',
      });
    }

    const org = orgRes.data.map(item => ({
      type: 1,
      value: item.value,
      label: item.name,
    }));

    const user = usersRes.data.map(item => ({
      value: item.id,
      phoneNumber: item.phoneNumber,
      email: item.email,
      label: `${item.lastName} ${item.firstName}`,
    }));

    const basket = basketsRes.data.map(item => ({
      palletbasketCode: item.palletbasketCode,
      palletBasketName: item.shortName,
      basketWeight: item.netWeight,
    }));

    yield put(
      actions.getValueFormSuccess({
        data: getSubType,
        orgs: org,
        users: user,
        baskets: basket,
      }),
    );
    if (form === constants.TYPE_FORM.CREATE) {
      yield initForm(getSubType, org, form, user);
    } else {
      yield getBasketById(action.payload, getSubType, user, form);
    }
    if (callback) yield callback();
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* initForm(commonData, org, form) {
  const initValues = {};
  [, initValues.subType] = commonData;
  [initValues.deliver] = org;
  initValues.user = {
    value: auth.meta.userId,
    label: auth.meta.fullName,
  };
  initValues.phone = auth.meta.phoneNumber;
  initValues.email = auth.meta.email;
  initValues.receiver = null;
  initValues.deliveryOrderCode = null;
  initValues.documentCode = null;
  initValues.note = null;
  initValues.date = new Date();
  initValues.guarantor = null;
  initValues.supervisor = null;
  initValues.id = 0;
  initValues.isDirect = true;
  initValues.typeForm = form;
  initValues.deliverType = initValues.deliver.type;
  initValues.basketDocumentDetails = [];
  initValues.doBasketDetailView = [];
  initValues.dataSections2 = [];
  if (constants.TYPE_PXKS.PXKS_DIEU_CHUYEN === initValues.subType.value) {
    const response = yield call(
      requestAuth,
      `${APIs.getBasketLocators}?plantCode=${
        initValues.deliver.value
      }&subType=${initValues.subType.value}`,
    );
    yield put({
      type: constants.GET_BASKET_LOCATORS_SUCCESS,
      payload: {
        data: response.data,
      },
    });
    const primaryLocator = find(response.data, { locatorType: 1 });
    if (primaryLocator !== undefined) {
      for (let i = 0; i < 5; i += 1) {
        initValues.basketDocumentDetails.push({
          basketCode: null,
          locatorDeliver: primaryLocator.basketLocatorId,
          locatorDeliverName: primaryLocator.basketLocatorName,
          deliveryQuantity: null,
        });
      }
    }
  }
  yield put(actions.initValue(initValues));
}

function* getBasketById(payload, getSubType, user) {
  const { id, form } = payload;
  const GETOption = optionReq({
    method: 'GET',
    authReq: true,
  });
  try {
    const res = yield call(
      request,
      `${APIs.getBasketsId}/${id}` /* id */,
      GETOption,
    );
    checkStatus(res);
    const initValues = res.data;
    const dataDeliveryOrderCode = {
      value: initValues.deliveryOrderCode,
      label: initValues.deliveryOrderCode,
      deliverCode: initValues.deliverCode,
      deliveryName: initValues.deliveryName,
      receiverCode: initValues.receiverCode,
      receiverName: initValues.receiverName,
      doBasketDetailView: [],
    };
    if (!find(getSubType, { value: initValues.subType })) {
      initValues.subType = {
        value: initValues.subType,
        label: initValues.subTypeName,
      };
    } else initValues.subType = find(getSubType, { value: initValues.subType });
    initValues.isAutoComplete =
      initValues.isAutoComplete && initValues.isAutoComplete;
    initValues.typeForm = form;
    initValues.deliver = initValues.deliverCode
      ? { value: initValues.deliverCode, label: initValues.deliverName }
      : null;
    initValues.user = find(user, { value: initValues.userId });
    initValues.receiver = initValues.receiverCode
      ? { value: initValues.receiverCode, label: initValues.receiverName }
      : null;
    initValues.deliveryOrderCode = initValues.deliveryOrderCode
      ? dataDeliveryOrderCode
      : null;
    initValues.guarantor = initValues.guarantorId
      ? { value: initValues.guarantorId, label: initValues.guarantorName }
      : null;
    initValues.date = new Date(initValues.date);
    initValues.dateApproved = initValues.dateApproved
      ? new Date(initValues.dateApproved)
      : null;
    initValues.supervisor = initValues.supervisorId
      ? { value: initValues.supervisorId, label: initValues.supervisorName }
      : null;
    initValues.phone = initValues.user.phoneNumber;
    initValues.email = initValues.user.email;
    initValues.isDirect = initValues.isDirect;
    initValues.statusName = initValues.statusName;
    initValues.dataSections2 = [];
    initValues.pxbCode = initValues.documentCode
      ? { value: initValues.documentCode, label: initValues.documentCode }
      : null;
    // if ([constants.TYPE_PXKS.PXKS_MUON].includes(initValues.subType.value)) {
    //
    // }
    if (form === constants.TYPE_FORM.CONFIRM) {
      initValues.isConfirm = true;
      if ([constants.TYPE_PXKS.PXKS_TRA].includes(initValues.subType.value)) {
        let quantity = 0;

        const basketDetails = initValues.basketDocumentDetails.map(item => {
          initValues.doExportStockReceiptBasket.doBasketDetails.forEach(
            basket => {
              if (item.basketCode === basket.basketCode) {
                quantity = basket.deliveryQuantity;
              }
            },
          );
          return {
            ...item,
            loanQuantity: quantity,
          };
        });
        initValues.basketDocumentDetails = basketDetails;
      }
    }
    if (
      initValues.doExportStockReceiptBasket &&
      initValues.doExportStockReceiptBasket.doBasketDetails
    ) {
      initValues.doBasketDetails = [];
      initValues.doExportStockReceiptBasket.doBasketDetails.forEach(item =>
        initValues.doBasketDetails.push({
          basketCode: item.basketCode,
          basketName: item.basketName,
          uoM: item.uoM,
          doQuantity: item.deliveryQuantity,
          deliveryQuantity: 0,
          locatorId: item.locatorId,
          netOff: item.netOff,
        }),
      );
      delete initValues.doExportStockReceiptBasket;
    }

    yield put(actions.initValue(initValues));
    if (
      [
        constants.TYPE_PXKS.PXKS_DIEU_CHUYEN,
        constants.TYPE_PXKS.PXKS_NOI_BO,
        constants.TYPE_PXKS.PXKS_MUON,
        constants.TYPE_PXKS.PXKS_TRA,
      ].includes(initValues.subType.value)
    ) {
      yield getBasketLocators({
        payload: {
          plantCode: initValues.deliver.value,
          subType: initValues.subType.value,
        },
      });
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getDeliveryOrderSaga(action) {
  try {
    const {
      inputValue,
      receiverCode,
      deliveryCode,
      subType,
      callback,
    } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const res = yield call(
      request,
      `${
        APIs.getDeliverOrder
      }?receiverCode=${receiverCode}&deliveryCode=${deliveryCode}&subType=${subType}&filter=${inputValue}`,
      GETOption,
    );
    const now = new Date();
    const hour = moment(now).hour();
    const second = moment(now).second();
    const minute = moment(now).minute();
    const fieldData = [
      ...res.data.map(item => ({
        value: item.doCode,
        label: item.doCode,
        deliverCode: item.deliverCode,
        deliveryName: item.deliveryName,
        receiverCode: item.receiverCode,
        receiverName: item.receiverName,
        date: new Date(
          moment(item.deliveryDateTime)
            .add(hour, 'hour')
            .add(second, 'second')
            .add(minute, 'minute')
            .utc()
            .format(),
        ),
      })),
    ];
    if (callback) {
      yield callback(fieldData);
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function checkData(item) {
  return Number.parseInt(item.deliveryQuantity, 0) === 0;
}

export function* doBasketSaveComplete(action) {
  try {
    const { typeForm, actionType, data, callback } = action || {};
    yield put(setLoading());
    const dataCheck = [];
    data.dataSection2.forEach(item => {
      if (item.doQuantity - item.deliveryQuantity !== 0) {
        dataCheck.push(item.basketCode);
      }
    });
    if (dataCheck.length > 0) {
      if (
        [constants.TYPE_PXKS.PXKS_DIEU_CHUYEN].includes(data.subType.value) &&
        data.referType === 1
      ) {
        throw Object({ message: data.errormsg });
      }
    }
    if (
      actionType === constants.TYPE_ACTION.BASKETS_COMPLETE &&
      data.basketDocumentDetails.every(checkData)
    )
      throw Object({ message: 'Phải có ít nhất 1 dòng có SL xuất > 0' });

    if (
      actionType === constants.TYPE_ACTION.BASKETS_COMPLETE &&
      [constants.TYPE_PXKS.PXKS_TRA].includes(data.subType.value) &&
      data.typeForm !== constants.TYPE_FORM.CONFIRM
    ) {
      let mess = '';
      if (data.dataSection2 && data.doBasketDetails.length > 0) {
        const doBasket = data.dataSection2.map(item => ({
          ...item,
          locatorId: data.doBasketDetails[0].locatorId,
        }));
        doBasket.forEach(item => {
          if (item.deliveryQuantity > item.doQuantity) {
            mess += `Tồn kho không đủ để thực hiện giao dịch. Mã khay sọt ${
              item.basketCode
            }, Mã Kho ${item.locatorId}. \n `;
          }
        });
        if (mess) throw Object({ message: mess });
      }
    }

    const query = {
      id: data.id,
      deliverCode: getSAVWithoutJoin(data.deliver),
      subType: getSAVWithoutJoin(data.subType),
      receiverCode:
        data.subType.value === constants.TYPE_PXKS.PXKS_NOI_BO
          ? getSAVWithoutJoin(data.deliver)
          : getSAVWithoutJoin(data.receiver),
      deliveryOrderCode: getSAVWithDefault(data.deliveryOrderCode, null),
      userId: getSAVWithoutJoin(data.user),
      userName: data.user.label,
      supervisorId: getSAVWithoutJoin(data.supervisor),
      guarantorId: getSAVWithDefault(data.guarantor, null),
      date: data.date,
      email: data.email,
      phoneNumber: data.phone,
      note: data.note,
      referType: data.deliveryOrderCode ? 2 : 3,
      status: data.status,
      isConfirm: data.isConfirm,
      isDirect: data.isDirect,
      basketDocumentDetails: data.basketDocumentDetails,
      basketDocumentType: 2,
      deliverType: data.deliverType,
      receiverType: data.receiverType,
      BasketCancellationRequestReceiptCode: null,
      documentCode: data.documentCode ? data.documentCode.value : null,
    };
    if ([constants.TYPE_PXKS.PXKS_MUON].includes(data.subType.value)) {
      if (typeForm === constants.TYPE_FORM.CREATE) {
        query.receiverType = data.documentCode ? 3 : data.receiverType;
      }
    }
    if (
      [
        constants.TYPE_PXKS.PXKS_DIEU_CHUYEN,
        constants.TYPE_PXKS.PXKS_NOI_BO,
      ].includes(data.subType.value)
    ) {
      if (constants.TYPE_PXKS.PXKS_NOI_BO === data.subType.value) {
        data.receiver = data.deliver;
      }
      query.receiverType = 1;
    }
    if ([constants.TYPE_PXKS.PXKS_TRA].includes(data.subType.value)) {
      query.deliverType = 1;
      const basketDetails = data.basketDocumentDetails.map(item => ({
        ...item,
        locatorReceiver: null,
        locatorReceiverName: null,
      }));
      query.basketDocumentDetails = basketDetails;
    }
    const requestURL = `${CAPACITYCONTROL_URL}/exportedstockreceipts-basket/${
      actionType === constants.TYPE_ACTION.BASKETS_SAVE
        ? 'pallet-basket-save'
        : 'pallet-basket-complete'
    }`;
    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        authReq: true,
        body: formatBasketDetail(query),
      }),
    );

    yield put(setLoading(false));
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (response && response.data) {
      const fieldData = { ...response.data, subType: data.subType.value };
      if (callback) {
        yield callback(fieldData);
      }
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* fetchAutocomplete(action) {
  const { type } = action.payload;
  if (type === 'baskets') {
    yield fetchBasketsAuto(action);
  } else if (type === 'sellDocument') {
    yield fetchSellDocumentAuto(action);
  }
}

export function* fetchBasketsAuto(action) {
  try {
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const {
      inputValue,
      callback,
      orgCode,
      basketLocatorId,
      date,
      receiverCode,
      receiverType,
    } = action.payload;
    let apiUrl = `${
      APIs.getBasketsAuto
    }?deliverCode=${orgCode}&filter=${inputValue}&basketLocatorId=${basketLocatorId}&date=${date.toISOString()}`;
    if (action.payload.receiverCode !== undefined) {
      apiUrl = `${apiUrl}&receiverCode=${receiverCode}`;
    }
    if (action.payload.receiverType !== undefined) {
      apiUrl = `${apiUrl}&receiverType=${receiverType}`;
    }
    const response = yield call(requestAuth, apiUrl, GETOption);
    const fieldData = [
      ...response.data.map(item => ({
        value: item.basketCode,
        name: item.basketName,
        label: `${item.basketCode} - ${item.basketName}`,
        quantity: item.quantity,
        quantityVendor: item.quantityBorrowByVendo,
        uoM: item.uoM,
        netOff: item.netOff,
      })),
    ];
    if (callback) {
      yield callback(fieldData);
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchSellDocumentAuto(action) {
  try {
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const {
      inputValue,
      callback,
      deliveryCode,
      receiverCode,
      date,
    } = action.payload;

    const response = yield call(
      requestAuth,
      `${
        APIs.getSellDocumentAuto
      }?deliveryCode=${deliveryCode}&receiverCode=${receiverCode}&filter=${inputValue}&date=${date.toISOString()}`,
      // }?filter=${inputValue}&date=${date.toISOString()}`,
      // }?filter=${inputValue}&date=${date.toISOString()}`,
      GETOption,
    );
    const now = new Date();
    const hour = moment(now).hour();
    const second = moment(now).second();
    const minute = moment(now).minute();
    const fieldData = [
      ...response.data.map(item => ({
        value: item.documentCode,
        label: item.documentCode,
        name: item.documentCode,
        deliverCode: item.deliverCode,
        deliveryName: item.deliverName,
        receiverCode: item.receiverCode,
        receiverName: item.receiverName,
        date: new Date(
          moment(item.date)
            .add(hour, 'hour')
            .add(second, 'second')
            .add(minute, 'minute')
            .utc()
            .format(),
        ),
        doBasketDetails: item.doBasketDetails.map(basket => ({
          ...basket,
          doQuantity: basket.quantity,
          inventoryQuantity: basket.quantityInventory,
        })),
      })),
    ];
    if (callback) {
      yield callback(fieldData);
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* changeTypeSaga(action) {
  try {
    yield getBasketLocators(action);
    yield put({ type: constants.CHANGE_TYPE, payload: action.payload });
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getBasketLocators(action) {
  const { plantCode, value, subType } = action.payload;
  const res = yield call(
    requestAuth,
    `${APIs.getBasketLocators}?plantCode=${plantCode}&subType=${value ||
      subType}`,
  );
  yield put({
    type: constants.GET_BASKET_LOCATORS_SUCCESS,
    payload: {
      data: res.data,
    },
  });
}

export function* deleteRowSaga(action) {
  try {
    const { id, idRow, rowIndex } = action;
    const GETOption = optionReq({
      method: 'DELETE',
      authReq: true,
    });
    const response = yield call(
      requestAuth,
      `${APIs.deleteRow}?basketdocumentId=${id}&basketDetailId=${idRow}`,
      GETOption,
    );
    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xóa bản ghi này',
      });
    }
    yield put(showSuccess(response.message || 'Đã xóa thành công'));
    yield put(actions.deleteRow(rowIndex));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* getReceiverPlantSaga(action) {
  try {
    const { inputValue, typeExported, callback } = action;
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    if (typeExported === constants.TYPE_PXKS.PXKS_DIEU_CHUYEN) {
      const res = yield call(
        requestAuth,
        `${APIs.getPlants}&search=${inputValue}`,
        GETOption,
      );
      const fieldData = [
        ...res.data.map(item => ({
          value: item.plantCode,
          type: 1,
          label: item.plantName,
        })),
      ];
      yield callback(fieldData);
    } else {
      const [supplierRes, customerRes] = yield all([
        call(request, `${APIs.getsuppliers}&search=${inputValue}`, GETOption),
        call(request, `${APIs.getCustomer}?filter=${inputValue}`, GETOption),
      ]);

      if (!supplierRes.data || !customerRes.data) {
        throw Object({ message: 'Không lấy được thông tin đơn vị giao hàng' });
      }

      const fieldData = [
        ...supplierRes.data.map(item => ({
          value: item.supplierCode,
          type: 2,
          label: `${item.supplierCode} ${item.name1}`,
        })),
        ...customerRes.data.map(item => ({
          value: item.customerCode,
          type: 3,
          label: `${item.customerCode} ${item.customerName}`,
        })),
      ];
      yield callback(fieldData);
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* exportPdfSaga(action) {
  const { formValues } = action;
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const requestApi = `${APIs.exportPdf}?ids=${formValues.id}&isReprint=${
      formValues.onRePrint
    }`;
    const response = yield call(request, requestApi, GETOption);

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
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* printPreviewSaga(action) {
  const { formValues, callback } = action;
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });
    const requestApi = `${APIs.exportPdf}?ids=${formValues.id}&isPreview=true`;
    const response = yield call(request, requestApi, GETOption);

    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }
    if (callback) yield callback(response.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* changeDeliverSaga(action) {
  try {
    if (
      [
        constants.TYPE_PXKS.PXKS_DIEU_CHUYEN,
        constants.TYPE_PXKS.PXKS_NOI_BO,
        constants.TYPE_PXKS.PXKS_MUON,
        constants.TYPE_PXKS.PXKS_TRA,
      ].includes(action.payload.subType.value)
    ) {
      yield getBasketLocators({
        payload: {
          plantCode: action.payload.value && action.payload.value.value,
          subType: action.payload.subType.value,
        },
      });
    }
    yield put({ type: constants.CHANGE_FIELD, payload: action.payload });
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getLoanBasketSaga(action) {
  const { receiverCode, deliverCode, receiverType } = action.payload;
  const GETOption = optionReq({
    method: 'GET',
    authReq: true,
  });
  const res = yield call(
    requestAuth,
    `${
      APIs.getLoanBasket
    }?receiverCode=${receiverCode}&deliverCode=${deliverCode}&receiverType=${receiverType}`,
    GETOption,
  );
  yield put({
    type: constants.GET_LOAN_BASKET_SUCCESS,
    payload: {
      data: res.data,
    },
  });
}

function* fetchCancelRequestsACSaga(action) {
  try {
    const {
      formik: { values },
      inputText,
      callback,
    } = action.payload;
    const f = generalSectionFields;
    const plantCode = getNested(values[f.deliver], 'value');

    if (!plantCode) {
      if (callback) callback([]);
      return;
    }

    const queryParams = {
      plantCode,
      search: inputText,
      // pageSize,
      // pageIndex
    };
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.getCancelRequestsAC}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );
    if (res.statusCode !== 200 || !res.data || !Array.isArray(res.data)) {
      throw Object({
        message:
          res.message || 'Có lỗi xảy ra khi tải danh sách phiếu xuất huỷ',
      });
    }

    const mappedData = res.data.map(item => ({
      value: item.id,
      label: item.basketCancellationRequestReceiptCode,
    }));

    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

/**
 * Lấy thông tin phiếu xuất huỷ khay
 */
function* fetchCancelReceiptByRequestIdSaga(action) {
  try {
    yield put(setLoading());
    const { cancelRequest, callback } = action.payload;
    const receiptId = getNested(cancelRequest, 'value');
    const f = generalSectionFields;
    const t1 = assetsTableFields;
    const t2 = basketsTableFields;

    const res = yield call(
      request,
      `${APIs.getCancelReceiptByRequestId}/${receiptId}`,
      optionReq({ method: 'GET', authReq: true }),
    );
    if (res.statusCode !== 200 || !res.data || typeof res.data !== 'object') {
      throw Object({
        message: res.message || 'Có lỗi xảy ra khi lấy thông tin phiếu xuất',
      });
    }

    const dt = res.data;
    const mappedData = {
      [f.subType]: { value: dt.subType, label: dt.subTypeName },
      [f.deliver]: { value: dt.plantCode, label: dt.plantName }, // đơn vị huỷ
      [f.user]: { value: dt.userId, label: dt.userName }, // nhân viên huỷ
      ...(dt.supervisorId
        ? {
            [f.supervisor]: {
              value: dt.supervisorId,
              label: dt.supervisorName,
            }, // nhân viên giám sát
          }
        : {}),
      [f.date]: dt.exportCancellationDate || null,
      [f.total]: dt.sumCurrentPriceCancellation
        ? formatToCurrency(dt.sumCurrentPriceCancellation)
        : '',
      [f.phone]: dt.userPhone || '',
      [f.email]: dt.userEmail || '',
      [f.reason]: {
        value: dt.reasonCancellationCode,
        label: dt.reasonCancellationName,
      },
      [f.note]: dt.note,
      [f.isAutoReceipt]: dt.isAutoReceipt,
      [f.cancelRequest]: dt.basketCancellationRequestReceiptCode
        ? {
            value: dt.basketCancellationRequestReceiptCode,
            label: dt.basketCancellationRequestReceiptCode,
          }
        : null,
      [f.needConfirmation]: dt.isConfirmMessage,

      // Assets Table
      [ASSETS_TABLE]: Array.isArray(dt.assetDetails)
        ? dt.assetDetails.map(item => ({
            [t1.id]: item.id,
            [t1.assetCode]: item.assetCode,
            [t1.ownerCode]: item.ownerCode,
            [t1.ownerName]: item.ownerName,
            [t1.palletBasketCode]: item.palletBasketCode,
            [t1.palletBasketName]: item.palletBasketName,
            [t1.tempCancelValue]: item.price,
            [t1.cancelValue]: item.currentPrice,
            [t1.cancelQuantity]: item.quantity,
            [t1.uom]: item.uoM || item.uom,
            [t1.causeCode]: item.reasonCode,
            [t1.causeName]: item.reasonName,
            [t1.priorStatus]: item.state,
            [t1.note]: item.note,
          }))
        : [],
      [ASSETS_TABLE_PINNED]: [
        {
          [t1.palletBasketName]: 'Tổng',
          [t1.tempCancelValue]: dt.assetSumPrice,
          [t1.cancelValue]: dt.assetSumCurrentPrice,
          [t1.cancelQuantity]: dt.assetSumQuantity,
        },
      ],

      // Assets Table
      [BASKETS_TABLE]: Array.isArray(dt.basketDetails)
        ? dt.basketDetails.map(item => ({
            [t2.locatorCode]: item.basketLocatorId,
            [t2.locatorName]: item.basketLocatorDescription,
            [t2.palletBasketCode]: item.palletBasketCode,
            [t2.palletBasketName]: item.palletBasketName,
            [t2.maxCancelQuantity]: item.maxCancelQuantity,
            [t2.cancelQuantity]: item.cancelQuantity,
            [t2.difference]: item.compareMaxCancelQuantity,
            [t2.uom]: item.uoM || item.uom,
            [t2.note]: item.note,
            [t2.causeCode]: item.reasonCode,
            [t2.causeName]: item.reasonName,
            [t2.priorStatus]: item.state,
            [t2.images]: Array.isArray(item.images)
              ? item.images.map(img => ({
                  id: img.id,
                  fileName: img.fileName || '',
                  previewData: img.image,
                }))
              : [],
          }))
        : [],
      [BASKETS_TABLE_PINNED]: [
        {
          [t2.palletBasketName]: 'Tổng',
          [t2.maxCancelQuantity]: dt.basketSumMaxCancelQuantity,
          [t2.cancelQuantity]: dt.basketSumCancelQuantity,
          [t2.difference]: dt.basketSumCompareMaxCancelQuantity,
        },
      ],
    };

    if (callback) yield callback(mappedData);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

/**
 * Lấy thông tin phiếu xuất huỷ khay
 */
function* fetchCancelReceiptByIdSaga(action) {
  try {
    yield put(setLoading());
    const { id, callback } = action.payload;
    const f = generalSectionFields;
    const t1 = assetsTableFields;
    const t2 = basketsTableFields;

    const res = yield call(
      request,
      `${APIs.getCancelReceiptById}/${id}`,
      optionReq({ method: 'GET', authReq: true }),
    );
    if (res.statusCode !== 200 || !res.data || typeof res.data !== 'object') {
      throw Object({
        message: res.message || 'Có lỗi xảy ra khi lấy thông tin phiếu xuất',
      });
    }

    const dt = res.data;
    const mappedData = {
      [f.id]: dt.id,
      [f.basketDocumentCode]: dt.basketDocumentCode || '',
      [f.subType]: { value: dt.subType, label: dt.subTypeName },
      [f.status]: dt.status || null, // trạng thái phiếu
      [f.statusName]: dt.statusName || '', // trạng thái phiếu - để hiển thị field trạng thái
      [f.deliver]: { value: dt.plantCode, label: dt.plantName }, // đơn vị huỷ
      [f.user]: { value: dt.userId, label: dt.userName }, // nhân viên huỷ
      ...(dt.supervisorId
        ? {
            [f.supervisor]: {
              value: dt.supervisorId,
              label: dt.supervisorName,
            }, // nhân viên giám sát
          }
        : {}),
      [f.date]: dt.exportCancellationDate || null,
      [f.total]: dt.sumCurrentPriceCancellation
        ? formatToCurrency(dt.sumCurrentPriceCancellation)
        : '',
      [f.phone]: dt.userPhone || '',
      [f.email]: dt.userEmail || '',
      [f.reason]: {
        value: dt.reasonCancellationCode,
        label: dt.reasonCancellationName,
      },
      [f.note]: dt.note,
      [f.isAutoReceipt]: dt.isAutoReceipt,
      [f.cancelRequest]: dt.basketCancellationRequestReceiptCode
        ? {
            value: dt.basketCancellationRequestReceiptCode,
            label: dt.basketCancellationRequestReceiptCode,
          }
        : null,
      [f.needConfirmation]: dt.isConfirmMessage,
      [f.printTimes]: dt.printTimes,

      // Assets Table
      [ASSETS_TABLE]: Array.isArray(dt.assetDetails)
        ? dt.assetDetails.map(item => ({
            [t1.id]: item.id,
            [t1.assetCode]: item.assetCode,
            [t1.ownerCode]: item.ownerCode,
            [t1.ownerName]: item.ownerName,
            [t1.palletBasketCode]: item.palletBasketCode,
            [t1.palletBasketName]: item.palletBasketName,
            [t1.tempCancelValue]: item.price,
            [t1.cancelValue]: item.currentPrice,
            [t1.cancelQuantity]: item.quantity,
            [t1.uom]: item.uoM || item.uom,
            [t1.causeCode]: item.reasonCode,
            [t1.causeName]: item.reasonName,
            [t1.priorStatus]: item.state,
            [t1.note]: item.note,
          }))
        : [],
      [ASSETS_TABLE_PINNED]: [
        {
          [t1.palletBasketName]: 'Tổng',
          [t1.tempCancelValue]: dt.assetSumPrice,
          [t1.cancelValue]: dt.assetSumCurrentPrice,
          [t1.cancelQuantity]: dt.assetSumQuantity,
        },
      ],

      // Baskets Table
      [BASKETS_TABLE]: Array.isArray(dt.basketDetails)
        ? dt.basketDetails.map(item => ({
            [t2.locatorCode]: item.basketLocatorId,
            [t2.locatorName]: item.basketLocatorDescription,
            [t2.palletBasketCode]: item.palletBasketCode,
            [t2.palletBasketName]: item.palletBasketName,
            [t2.maxCancelQuantity]: item.maxCancelQuantity,
            [t2.cancelQuantity]: item.cancelQuantity,
            [t2.difference]: item.compareMaxCancelQuantity,
            [t2.uom]: item.uoM || item.uom,
            [t2.note]: item.note,
            [t2.causeCode]: item.reasonCode,
            [t2.causeName]: item.reasonName,
            [t2.priorStatus]: item.state,
            [t2.images]: Array.isArray(item.images)
              ? item.images.map(img => ({
                  id: img.id,
                  fileName: img.fileName || '',
                  previewData: img.image,
                }))
              : [],
          }))
        : [],
      [BASKETS_TABLE_PINNED]: [
        {
          [t2.palletBasketName]: 'Tổng',
          [t2.maxCancelQuantity]: dt.basketSumMaxCancelQuantity,
          [t2.cancelQuantity]: dt.basketSumCancelQuantity,
          [t2.difference]: dt.basketSumCompareMaxCancelQuantity,
        },
      ],
    };

    if (callback) yield callback(mappedData);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchBigImageBasketSaga(action) {
  try {
    yield put(setLoading());
    const { id, callback } = action;
    const res = yield call(
      request,
      `${APIs.getBigImageBasket}/${id}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Lấy thông tin ảnh thất bại' });
    }

    yield callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitSaveCancelReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { formik, receiptId, callback } = action.payload;
    const { values } = formik;
    const f = generalSectionFields;

    const dateExport = values[f.date]
      ? new Date(values[f.date]).toISOString()
      : null;

    const body = {
      basketDocumentId: receiptId || null, // null => create, else update
      plantCode: getNested(values[f.deliver], 'value') || null,
      exportCancellationDate: dateExport,
      userId: getNested(values[f.user], 'value') || null,
      supervisorId: getNested(values[f.supervisor], 'value') || null,
      basketCancellationRequestReceiptCode:
        getNested(values[f.cancelRequest], 'label') || null,
      note: values[f.note] || '',
    };

    const res = yield call(
      request,
      `${APIs.submitSaveCancelReceipt}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({ message: res.message || 'Có lỗi xảy ra khi lưu phiếu' });
    } else {
      yield put(showSuccess(res.message || 'Lưu phiếu thành công'));
    }

    if (callback) yield callback();
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitCompleteCancelReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { formik, receiptId, callback } = action.payload;
    const { values } = formik;
    const f = generalSectionFields;
    const dateExport = values[f.date]
      ? new Date(values[f.date]).toISOString()
      : null;
    const body = {
      basketDocumentId: receiptId || null, // null => create, else update
      plantCode: getNested(values[f.deliver], 'value') || null,
      exportCancellationDate: dateExport,
      userId: getNested(values[f.user], 'value') || null,
      supervisorId: getNested(values[f.supervisor], 'value') || null,
      basketCancellationRequestReceiptCode:
        getNested(values[f.cancelRequest], 'label') || null,
      note: values[f.note] || '',
    };

    const res = yield call(
      request,
      `${APIs.submitCompleteCancelReceipt}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );

    if (res.statusCode !== 200) {
      throw Object({
        message: res.message || 'Có lỗi xảy ra khi hoàn thành phiếu',
      });
    } else {
      yield put(showSuccess(res.message || 'Hoàn thành phiếu thành công'));
    }

    if (callback) yield callback();
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* printCancelReceiptSaga(action) {
  try {
    yield put(setLoading());
    const { formik, isPreview, isReprint, callback } = action.payload;
    const { values } = formik;
    const f = generalSectionFields;

    const queryParams = {
      ids: getNested(values, f.id),
      isPreView: isPreview,
      isReprint,
    };

    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.printCancelReceipt}?${queryStr}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message:
          res.message ||
          `Có lỗi xảy ra khi ${isPreview ? 'xem trước phiếu in' : 'in phiếu'}`,
      });
    }

    if (callback) yield callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* exportedBasketsSaga() {
  yield takeLeading(constants.GET_VALUE_FORM, getValueForm);
  yield takeLeading(constants.GET_DELIVERY_ORDER, getDeliveryOrderSaga);
  yield takeLeading(constants.GET_RECEIVER, getReceiverPlantSaga);
  yield takeLeading(constants.BASKETS_SAVE_COMPLETE, doBasketSaveComplete);
  yield takeLeading(constants.FETCH_AUTOCOMPLETE, fetchAutocomplete);
  yield takeLeading(constants.DELETE_ROW_SERVER, deleteRowSaga);
  yield takeLatest(constants.EXPORT_PDF, exportPdfSaga);
  yield takeLatest(constants.PRINT_PREVIEW, printPreviewSaga);
  yield takeLatest(constants.CHANGE_TYPE_SAGA, changeTypeSaga);
  yield takeLatest(constants.CHANGE_DELIVER, changeDeliverSaga);
  yield takeLatest(constants.GET_LOAN_BASKET, getLoanBasketSaga);
  yield takeLatest(
    constants.FETCH_CANCEL_REQUESTS_AC,
    fetchCancelRequestsACSaga,
  );
  yield takeLatest(
    constants.FETCH_CANCEL_RECEIPT_BY_REQUEST_ID,
    fetchCancelReceiptByRequestIdSaga,
  );
  yield takeLatest(constants.FETCH_BIG_IMAGE_BASKET, fetchBigImageBasketSaga);
  yield takeLatest(
    constants.SUBMIT_SAVE_CANCEL_RECEIPT,
    submitSaveCancelReceiptSaga,
  );
  yield takeLatest(
    constants.SUBMIT_COMPLETE_CANCEL_RECEIPT,
    submitCompleteCancelReceiptSaga,
  );
  yield takeLatest(
    constants.FETCH_CANCEL_RECEIPT_BY_ID,
    fetchCancelReceiptByIdSaga,
  );
  yield takeLatest(constants.PRINT_CANCEL_RECEIPT, printCancelReceiptSaga);
}
