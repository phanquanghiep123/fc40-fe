import { ALERT_INVALID } from 'containers/App/constants';
import {
  SUBMIT_FORM,
  GET_DELIVERY_ORDER_CODE,
  GET_DELIVERY_CODE,
  GET_USER_ID,
  GET_ORGANIZATIONS,
  SET_ORGANIZATIONS,
  SET_IMPORT_SUBTYPE,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  UPDATE_SCHEMA,
} from './constants';

export function alertInvalid(message) {
  return {
    type: ALERT_INVALID,
    message,
  };
}

export function submitForm(path, form, callback) {
  return {
    type: SUBMIT_FORM,
    path,
    form,
    callback,
  };
}

export function getDeliveryOrderCode(
  inputText,
  callback,
  receiverCode,
  deliverCode,
  subType,
) {
  return {
    type: GET_DELIVERY_ORDER_CODE,
    inputText,
    callback,
    receiverCode,
    deliverCode,
    subType,
  };
}

export function getDeliveryCode(inputText, receiverCode, callback) {
  return { type: GET_DELIVERY_CODE, inputText, receiverCode, callback };
}

export function getUserId(inputText, callback) {
  return { type: GET_USER_ID, inputText, callback };
}

export function getOrganizations(itemId, userId) {
  return { type: GET_ORGANIZATIONS, itemId, userId };
}

export function setOrganizations(itemId, data) {
  return { type: SET_ORGANIZATIONS, itemId, data };
}

export function setImportSubType(receiverCode, callback) {
  return { type: SET_IMPORT_SUBTYPE, receiverCode, callback };
}

/**
 * @param importStockId
 * @returns {{importStockId: *, type: string}}
 */
export function openDialogImportStock(importStockId) {
  return {
    type: OPEN_DIALOG,
    importStockId,
  };
}

export function closeDialog() {
  return { type: CLOSE_DIALOG };
}

export function updateSchema(importStockId, schema) {
  return { type: UPDATE_SCHEMA, importStockId, schema };
}
