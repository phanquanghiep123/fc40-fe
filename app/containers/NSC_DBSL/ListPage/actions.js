import * as constants from './constants';

/**
 * Fetch data => set to reducer => make default values
 * => dispatch a submit form action with default values
 * @param {object} submittedValues
 * @returns {{type: string}}
 */
export function fetchFormData(submittedValues) {
  return {
    type: constants.FETCH_FORM_DATA,
    submittedValues,
  };
}

/**
 * @param {object} submittedValues
 * @returns {{submittedValues: *, type: string}}
 */
export function submitForm(submittedValues) {
  return {
    type: constants.SUBMIT_FORM,
    submittedValues,
  };
}

/**
 * @param {object} submittedValues
 * @param {array} tableData
 * @returns {{tableData: *, type: string, submittedValues: *}}
 */
export function submitFormSuccess(submittedValues, tableData) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
  };
}
export function getFormDataSuccess(formData) {
  return { type: constants.GET_FORM_DATA_SUCCESS, formData };
}
export function pagingInit(submittedValues) {
  return {
    type: constants.PAGING_INIT,
    submittedValues,
  };
}
export function pagingSuccess(tableData) {
  return {
    type: constants.PAGING_SUCCESS,
    tableData,
  };
}

export function onChangeOrder(submittedValues) {
  return {
    type: constants.CHANGE_ORDER,
    submittedValues,
  };
}
export function getViewItem(item, callback) {
  return {
    type: constants.GET_ITEM,
    item,
    callback,
  };
}

export function getViewItemSuccess(item) {
  return {
    type: constants.GET_ITEM_SUCCESS,
    item,
  };
}

export function exportExcel(submittedValues) {
  return {
    type: constants.EXPORT_EXCEL,
    submittedValues,
  };
}
export function exportHistoryExcel(submittedValues) {
  return {
    type: constants.EXPORT_HISTORY_EXCEL,
    submittedValues,
  };
}

export function getProductAuto(inputText, callback) {
  return {
    type: constants.GET_PRODUCT_AUTO,
    inputText,
    callback,
  };
}

export function getLSXAuto(inputText, Farms, farmIdFrom, farmIdTo, callback) {
  return {
    type: constants.GET_LSX_AUTO,
    inputText,
    Farms,
    farmIdFrom,
    farmIdTo,
    callback,
  };
}

export function changeBeforeDate(date) {
  return {
    type: constants.SET_DATE_BEFORE,
    date,
  };
}

export function changeFromToFarm(farmIdFrom, farmIdTo) {
  return {
    type: constants.CHANGE_FROM_TO_FARM,
    farmIdFrom,
    farmIdTo,
  };
}
