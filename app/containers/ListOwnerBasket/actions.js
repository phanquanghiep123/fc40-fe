/*
 *
 * ListOwnerBasket actions
 *
 */

import * as constants from './constants';

export function fetchFormData(callback) {
  return {
    type: constants.FETCH_FORM_DATA,
    callback,
  };
}
export function fetchFormSuccess(response) {
  return {
    type: constants.FETCH_FORM_SUCCESS,
    response,
  };
}
export function exportExcel() {
  return {
    type: constants.EXPORT_EXCEL,
  };
}
export function searchBasket(params) {
  return {
    type: constants.SEARCH_BASKET,
    params,
  };
}
export function searchBasketSuccess(response) {
  return {
    type: constants.SEARCH_BASKET_SUCCESS,
    response,
  };
}

export function getHistory(params) {
  return {
    type: constants.GET_HISTORY,
    params,
  };
}
export function getHistorySuccess(response) {
  return {
    type: constants.GET_HISTORY_SUCCESS,
    response,
  };
}
