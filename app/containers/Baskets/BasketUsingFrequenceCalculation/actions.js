/*
 *
 * BasketUsingFrequenceCalculation actions
 *
 */

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
export function onSearchPopup(data) {
  return {
    type: constants.SEARCH_POPUP,
    data,
  };
}

export function searchPopupSuccess(res, paramsSearchPopup) {
  return {
    type: constants.SEARCH_POPUP_SUCCESS,
    res,
    paramsSearchPopup,
  };
}
export function runReport(data, callback) {
  return {
    type: constants.RUN_REPORT,
    data,
    callback,
  };
}

export function confirmRunReport(data, callback) {
  return {
    type: constants.CONFIRM_REPORT,
    data,
    callback,
  };
}
