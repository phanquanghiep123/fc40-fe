import {
  OPEN_POPUP,
  CHECK_BLOCK,
  MODIFY_AUTO,
  GET_PRODUCT_AUTO,
  SIGNALR_PROCESSING,
  GET_FARM_SUPPLIER_AUTO,
  GET_DELI_DATA,
} from './constants';

/**
 * Popup Phiếu điều chỉnh
 */
export function openPopup(params) {
  return {
    type: OPEN_POPUP,
    params,
  };
}

/**
 * Thực hiện Check giá bán, Block khách hàng
 */
export function checkBlock(params) {
  return {
    type: CHECK_BLOCK,
    params,
  };
}

/**
 * Thực hiện điều chỉnh chênh lệch tự động
 */
export function modifyAuto(params, callback) {
  return {
    type: MODIFY_AUTO,
    params,
    callback,
  };
}

/**
 * Auto complete Mã sản phẩm
 */
export function getProductAuto(inputText, callback) {
  return {
    type: GET_PRODUCT_AUTO,
    inputText,
    callback,
  };
}

/**
 * Trigger response nhận được từ signalR
 */
export function signalRProcessing(requestId, response) {
  return {
    type: SIGNALR_PROCESSING,
    requestId,
    response,
  };
}

/**
 * Auto complete Farm/NCC
 *
 * @param {string} inputText  Từ khóa tìm kiếm
 * @param {function} callback
 */
export function getFarmSupplierAuto(inputText, callback) {
  return {
    type: GET_FARM_SUPPLIER_AUTO,
    inputText,
    callback,
  };
}

/**
 * Lấy dữ liệu deli
 *
 * @param {object} formValues - giá trị form tìm kiếm
 * @returns {{formValues: *, type: *}}
 */
export function getDeliData(formValues) {
  return {
    type: GET_DELI_DATA,
    formValues,
  };
}
