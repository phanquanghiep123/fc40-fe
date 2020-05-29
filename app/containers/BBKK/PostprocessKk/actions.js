/*
 *
 * PostprocessKk actions
 *
 */

import * as constants from './constants';

export function getInitFormData(data) {
  return {
    type: constants.GET_INIT_FORM_DATA,
    data,
  };
}

export function submitAdjust(data, callback) {
  return {
    type: constants.SUBMIT_ADJUST,
    data,
    callback,
  };
}

export function getDeliveryOrder(data, callback) {
  return {
    type: constants.GET_DELIVERY_ORDER,
    data,
    callback,
  };
}

export function getBasketDetail(data) {
  return {
    type: constants.GET_BASKET_DETAIL,
    data,
  };
}

export function getBasketDetailSuccess(data) {
  return {
    type: constants.GET_BASKET_DETAIL_SUCCESS,
    data,
  };
}

export function getInitFormDataSuccess(formOption, initData) {
  return {
    type: constants.GET_INIT_FORM_DATA_SUCCESS,
    formOption,
    initData,
  };
}

export function changeData(data) {
  return {
    type: constants.CHANGE_DATA,
    data,
  };
}

export function updateDetailCommand(data, field) {
  return {
    type: constants.UPDATE_DETAILS_COMMAND,
    data,
    field,
  };
}

export function getDeliveryOrderSuccess(data) {
  return {
    type: constants.GET_DELIVERY_ORDER_SUCCESS,
    data,
  };
}
export function handleQuantity(data) {
  return {
    type: constants.HANDLE_QUANTITY,
    data,
  };
}
