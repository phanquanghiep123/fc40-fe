/*
 *
 * AdjustStockTaking actions
 *
 */

import * as constants from './constants';

export function getValueForm(payload) {
  return {
    type: constants.GET_VALUE_FORM,
    payload,
  };
}

export function getValueFormSuccess(payload) {
  return {
    type: constants.GET_VALUE_FORM_SUCCESS,
    payload,
  };
}
export function fetchPopupTableData(filters, assetsTable, callback) {
  return {
    type: constants.FETCH_POPUP_TABLE_DATA,
    payload: { filters, assetsTable, callback },
  };
}
export function fetchPopupTableDataSuccess(filters, assetsTable) {
  return {
    type: constants.FETCH_POPUP_TABLE_DATA_SUCCESS,
    payload: { filters, assetsTable },
  };
}
export function initValue(payload) {
  return {
    type: constants.INIT_VALUE,
    payload,
  };
}

export function changeValueAsset(payload) {
  return {
    type: constants.CHANGE_VALUE_ASSET,
    payload,
  };
}

export function updateBasketCancelDetails(payload) {
  return {
    type: constants.UPDATE_BASKET_CANCEL_DETAIL,
    payload,
  };
}

export function fetchPopupBasket(
  formik,
  basketLocatorCode,
  isEdit,
  data,
  callback = undefined,
) {
  return {
    type: constants.FETCH_POPUP_BASKET,
    payload: { formik, basketLocatorCode, isEdit, data, callback },
  };
}

export function fetchPopupBasketSuccess(data) {
  return {
    type: constants.FETCH_POPUP_BASKET_SUCCESS,
    payload: { data },
  };
}

export function fetchBigImageBasket(id, callback) {
  return {
    type: constants.FETCH_BIG_IMAGE_BASKET,
    id,
    callback,
  };
}

export function saveAdjustSubmit(actionType, data, callback) {
  return {
    type: constants.SAVE_ADJUST_BASKET_STOCKTAKING,
    actionType,
    data,
    callback,
  };
}

export function saveAdjustSubmitSuccess(typeForm, data, callback) {
  return {
    type: constants.SAVE_ADJUST_BASKET_STOCKTAKING_SUCCESS,
    typeForm,
    data,
    callback,
  };
}

export function changeField(payload) {
  return {
    type: constants.CHANGE_FIELD,
    payload,
  };
}

export function mergeAssetTable(payload) {
  return {
    type: constants.MERGE_ASSET_TABLE,
    payload,
  };
}

export function changeImages(payload) {
  return {
    type: constants.CHANGE_IMAGES_TABLE,
    payload,
  };
}
export function changeReasonAsset(payload) {
  return {
    type: constants.CHANGE_REASON_ASSET,
    payload,
  };
}
