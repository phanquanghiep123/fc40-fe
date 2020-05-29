/*
 *
 * ExportedBaskets actions
 *
 */

import * as constants from './constants';

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}
export function changeSaga(payload) {
  return {
    type: constants.CHANGE_TYPE_SAGA,
    payload,
  };
}

export function changeDeliver(payload) {
  return {
    type: constants.CHANGE_DELIVER,
    payload,
  };
}

export function addRows() {
  return {
    type: constants.ADD_ROWS,
  };
}

export function deleteRow(rowIndex) {
  return {
    type: constants.DELETE_ROW,
    rowIndex,
  };
}

export function deleteRowServer(id, idRow, rowIndex) {
  return {
    type: constants.DELETE_ROW_SERVER,
    id,
    idRow,
    rowIndex,
  };
}

export function updateBasketDocumentDetails(payload) {
  return {
    type: constants.UPDATE_BASKET_DOCUMENT_DETAILS,
    payload,
  };
}
export function changeField(payload) {
  return {
    type: constants.CHANGE_FIELD,
    payload,
  };
}

export function getValueForm(payload) {
  return {
    type: constants.GET_VALUE_FORM,
    payload,
  };
}

export function getValueFormSuccess(payload) {
  return {
    type: constants.GET_VALUE_FORM_SUCCESS,
    payload,
  };
}

export function initValue(payload) {
  return {
    type: constants.INIT_VALUE,
    payload,
  };
}

export function getBaskets(data) {
  return {
    type: constants.GET_BASKETS,
    data,
  };
}

export function changeDelivery(payload) {
  return {
    type: constants.CHANGE_DELIVERY_ORDER,
    payload,
  };
}

export function changeSellDocument(payload) {
  return {
    type: constants.CHANGE_SELL_DOCUMENT,
    payload,
  };
}

export function changeUser(payload) {
  return {
    type: constants.CHANGE_USER,
    payload,
  };
}

export function changeBasketsCode(payload) {
  return {
    type: constants.CHANGE_GET_BASKETS_CODE,
    payload,
  };
}

export function getDelivery(
  inputValue,
  receiverCode,
  deliveryCode,
  subType,
  callback,
) {
  return {
    type: constants.GET_DELIVERY_ORDER,
    inputValue,
    receiverCode,
    deliveryCode,
    subType,
    callback,
  };
}

export function getDeliverySuccess(payload) {
  return {
    type: constants.GET_DELIVERY_ORDER_SUCCESS,
    payload,
  };
}

export function getLoanBasket(payload) {
  return {
    type: constants.GET_LOAN_BASKET,
    payload,
  };
}

export function getLoanBasketSuccess(payload) {
  return {
    type: constants.GET_LOAN_BASKET_SUCCESS,
    payload,
  };
}

export function getReceiverPlant(inputValue, typeExported, callback) {
  return {
    type: constants.GET_RECEIVER,
    inputValue,
    typeExported,
    callback,
  };
}

export function fetchAutocomplete(payload) {
  return {
    type: constants.FETCH_AUTOCOMPLETE,
    payload,
  };
}

export function basketsSaveComplete(typeForm, actionType, data, callback) {
  return {
    type: constants.BASKETS_SAVE_COMPLETE,
    typeForm,
    actionType,
    data,
    callback,
  };
}

export function exportPdf(formValues) {
  return {
    type: constants.EXPORT_PDF,
    formValues,
  };
}

export function printPreview(formValues, callback) {
  return {
    type: constants.PRINT_PREVIEW,
    formValues,
    callback,
  };
}

export function resetBasketsDetail(payload) {
  return {
    type: constants.RESET_BASKETS_DETAIL,
    payload,
  };
}

export function resetDeliveryOrder(formValues) {
  return {
    type: constants.RESET_DELIVERY_ORDER,
    formValues,
  };
}

/**
 * Lấy danh sách phiếu yêu cẩu huỷ autocomplete
 * @param formik
 * @param {string} inputText
 * @param callback
 */
export function fetchCancelRequestsAC(formik, inputText, callback = undefined) {
  return {
    type: constants.FETCH_CANCEL_REQUESTS_AC,
    payload: { formik, inputText, callback },
  };
}

/**
 * Lấy thông tin chi tiết phiếu xuất kho của phiếu yêu cẩu huỷ được chọn
 * @param {Object} cancelRequest - phiếu yêu cầu huỷ được chọn
 * @param callback
 */
export function fetchCancelReceiptByRequestId(
  cancelRequest,
  callback = undefined,
) {
  return {
    type: constants.FETCH_CANCEL_RECEIPT_BY_REQUEST_ID,
    payload: { cancelRequest, callback },
  };
}

/**
 * @param {Object} receiptData
 * @param callback
 */
export function fetchCancelReceiptByRequestIdSuccess(
  receiptData,
  callback = undefined,
) {
  return {
    type: constants.FETCH_CANCEL_RECEIPT_BY_REQUEST_ID_SUCCESS,
    payload: { receiptData, callback },
  };
}

/**
 * Fetch detail data of cancel receipt
 * @param id - id của phiếu huỷ
 * @param callback
 * @return {{payload: {callback: undefined, id: *}, type: string}}
 */
export function fetchCancelReceiptById(id, callback = undefined) {
  return {
    type: constants.FETCH_CANCEL_RECEIPT_BY_ID,
    payload: { id, callback },
  };
}

/**
 * Lưu phiếu
 * @param formik
 * @param receiptId - id của phiếu huỷ (nếu không có id => tạo mới)
 * @param callback
 * @return {{payload: {formik: *, receiptId: *}, type: string}}
 */
export function submitSaveCancelReceipt(
  formik,
  receiptId = null,
  callback = undefined,
) {
  return {
    type: constants.SUBMIT_SAVE_CANCEL_RECEIPT,
    payload: { formik, receiptId, callback },
  };
}

/**
 * Hoàn thành phiếu
 * @param formik
 * @param receiptId - id của phiếu huỷ (nếu không có id => tạo mới)
 * @param callback
 * @return {{payload: {formik: *, receiptId: *}, type: string}}
 */
export function submitCompleteCancelReceipt(
  formik,
  receiptId = null,
  callback = undefined,
) {
  return {
    type: constants.SUBMIT_COMPLETE_CANCEL_RECEIPT,
    payload: { formik, receiptId, callback },
  };
}

/**
 * Lấy ảnh lớn để hiển thị popup
 * @param id
 * @param callback
 * @return {{callback: *, id: *, type: string}}
 */
export function fetchBigImageBasket(id, callback) {
  return {
    type: constants.FETCH_BIG_IMAGE_BASKET,
    id,
    callback,
  };
}

/**
 * In/Xem trước phiếu yêu cầu huỷ khay sọt
 * @param formik
 * @param isPreview - true => xem trước, false => in
 * @param isReprint - in lại
 * @param callback
 * @returns {{type: string, payload: {receiptCode: *, cancelRequestCode: *, isPreview: *, callback: *}}}
 */
export function printCancelReceipt(formik, isPreview, isReprint, callback) {
  return {
    type: constants.PRINT_CANCEL_RECEIPT,
    payload: { formik, isPreview, isReprint, callback },
  };
}

export function resetDocumentSell(formValues) {
  return {
    type: constants.RESET_DOCUMENT_SELL,
    formValues,
  };
}
