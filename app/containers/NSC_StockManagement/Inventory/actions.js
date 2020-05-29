import * as constants from './constants';

export function fetchFormData(callback) {
  return {
    type: constants.FETCH_FORM_DATA,
    callback,
  };
}

export function fetchFormDataSuccess(response) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    response,
  };
}

export function getListProduct(locatorId, plantId, callback) {
  return {
    type: constants.GET_LIST_PRODUCT,
    locatorId,
    plantId,
    callback,
  };
}

export function getListProductSuccess(response) {
  return {
    type: constants.GET_LIST_PRODUCT_SUCCESS,
    response,
  };
}

export function getWarehouses(plantId, callback) {
  return {
    type: constants.GET_WAREHOUSES,
    plantId,
    callback,
  };
}

export function getWarehousesSuccess(response) {
  return {
    type: constants.GET_WAREHOUSES_SUCCESS,
    response,
  };
}

export function fillProduct(params, callback) {
  return {
    type: constants.FILL_PRODUCT,
    params,
    callback,
  };
}

export function save(values, callback) {
  return {
    type: constants.SAVE,
    values,
    callback,
  };
}

export function complete(values, callback) {
  return {
    type: constants.COMPLETE,
    values,
    callback,
  };
}

export function deleteProductAction(params, callback) {
  return {
    type: constants.DELETE_PRODUCT,
    params,
    callback,
  };
}
