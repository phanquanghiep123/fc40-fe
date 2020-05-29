import * as constants from './constants';

export function fetchForm(payload) {
  return {
    type: constants.FETCH_FORM,
    payload,
  };
}
export function fetchFormSuccess(payload) {
  return {
    type: constants.FETCH_FORM_SUCCESS,
    payload,
  };
}

export function getReceiver(inputValue, callback) {
  return {
    type: constants.GET_RECEIVER,
    inputValue,
    callback,
  };
}

export function search(data) {
  return {
    type: constants.SEARCH,
    data,
  };
}
export function searchSuccess(res, paramsSearch) {
  return {
    type: constants.SEARCH_SUCCESS,
    res,
    paramsSearch,
  };
}
export function exportExcel() {
  return {
    type: constants.EXPORT_EXCEL,
  };
}
export function print(ids, callback) {
  return {
    type: constants.PRINT,
    ids,
    callback,
  };
}
export function deleteExportBasket(ids) {
  return {
    type: constants.DELETE_EXPORT_BASKET,
    ids,
  };
}
export function deleteExportBasketSuccess(res) {
  return {
    type: constants.DELETE_EXPORT_BASKET_SUCCESS,
    res,
  };
}
export function orderChange() {
  return {
    type: constants.ORDER_CHANGE,
  };
}

export function getLocatorSuccess(data) {
  return {
    type: constants.GET_LOCATOR_SUCCESS,
    data,
  };
}
