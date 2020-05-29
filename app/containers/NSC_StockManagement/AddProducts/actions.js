import * as constants from './constants';

export function getInitMaster(callback) {
  return {
    type: constants.INIT_MASTER,
    callback,
  };
}
export function getInitMasterSucces(payload) {
  return {
    type: constants.INIT_MASTER_SUCCESS,
    payload,
  };
}
export function getWarehouses(payload) {
  return {
    type: constants.GET_WAREHOUSES,
    payload,
  };
}

export function getWarehousesSucess(res) {
  return {
    type: constants.GET_WAREHOUSES_SUCCESS,
    res,
  };
}
export function getOriginAuto(inputText, callback) {
  return {
    type: constants.GET_ORIGIN_AUTO,
    inputText,
    callback,
  };
}
export function getProductAuto(inputText, callback, plantCode, locatorId) {
  return {
    type: constants.GET_PRODUCT_AUTO,
    inputText,
    callback,
    plantCode,
    locatorId,
  };
}

export function getInventory(payload) {
  return {
    type: constants.GET_INVENTORY,
    payload,
  };
}

export function getInventorySuccess(payload) {
  return {
    type: constants.GET_INVENTORY_SUCCESS,
    payload,
  };
}

export function inventoryStock(actionType, data, callback) {
  return {
    type: constants.INVENTORY_STOCK,
    actionType,
    data,
    callback,
  };
}

export function inventoryStockSuccess(payload) {
  return {
    type: constants.INVENTORY_STOCK_SUCCESS,
    payload,
  };
}
