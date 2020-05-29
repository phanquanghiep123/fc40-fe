/*
 *
 * MasterBaskets actions
 *
 */

import * as constants from './constants';

export function searchMaster(data, callback) {
  return {
    type: constants.SEARCH_MASTER,
    data,
    callback,
  };
}
export function getSize() {
  return {
    type: constants.GET_SIZE,
  };
}
export function getSizeSuccess(res) {
  return {
    type: constants.GET_SIZE_SUCCESS,
    res,
  };
}
export function getUomsAuto() {
  return {
    type: constants.GET_UOMS,
  };
}
export function getUomsSuccess(res) {
  return {
    type: constants.GET_UOMS_SUCCESS,
    res,
  };
}
export function searchMasterSuccess(res, paramSearch) {
  return {
    type: constants.SEARCH_MASTER_SUCCESS,
    res,
    paramSearch,
  };
}
export function save(data, callback) {
  return {
    type: constants.SAVE,
    data,
    callback,
  };
}
export function saveSuccess(res) {
  return {
    type: constants.SAVE_SUCCESS,
    res,
  };
}
export function formDetail(data) {
  return {
    type: constants.FORM_DETAIL,
    data,
  };
}
export function exportExcel() {
  return {
    type: constants.EXPORT_EXCEL,
  };
}
export function deleteBasket(idRowData, idTable) {
  return {
    type: constants.DELETE_BASKET,
    idRowData,
    idTable,
  };
}
export function deleteBasketSuccess(idTable) {
  return {
    type: constants.DELETE_BASKET_SUCCESS,
    idTable,
  };
}
