import {
  GET_ROUTE_AUTO,
  GET_SHIPPER_AUTO,
  GET_CUSTOMER_AUTO,
  CHANGE_TYPE_BBGNHH,
  GET_EXPORT_RECEIPT_AUTO,
  GET_DELIVERY_PERSON_AUTO,
} from './constants';

/**
 * Thay đổi Loại BBGNHH
 */
export function changeTypeBBGNHH(typeBBGNHH) {
  return {
    type: CHANGE_TYPE_BBGNHH,
    typeBBGNHH,
  };
}

/**
 * Auto complete cho Tuyến đường
 */
export function getRouteAuto(inputText, callback) {
  return {
    type: GET_ROUTE_AUTO,
    inputText,
    callback,
  };
}

/**
 * Auto complete cho Lái xe
 */
export function getShipperAuto(inputText, callback) {
  return {
    type: GET_SHIPPER_AUTO,
    inputText,
    callback,
  };
}

/**
 * Auto complete cho Khách hàng
 */
export function getCustomerAuto(inputText, callback) {
  return {
    type: GET_CUSTOMER_AUTO,
    inputText,
    callback,
  };
}

/**
 * Auto complete cho Phiếu xuất kho
 */
export function getExportReceiptAuto(
  deliverCode,
  deliveryDate,
  inputText,
  callback,
) {
  return {
    type: GET_EXPORT_RECEIPT_AUTO,
    deliverCode,
    deliveryDate,
    inputText,
    callback,
  };
}

/**
 * Auto complete cho Đại diện giao hàng
 */
export function getDeliveryPersonAuto(plantCode, inputText, callback) {
  return {
    type: GET_DELIVERY_PERSON_AUTO,
    plantCode,
    inputText,
    callback,
  };
}
