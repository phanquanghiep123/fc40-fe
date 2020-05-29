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
export function print(callback) {
  return {
    type: constants.PRINT,
    callback,
  };
}

export function onSync() {
  return {
    type: constants.SYNC,
  };
}
