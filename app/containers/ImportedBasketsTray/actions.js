/*
 *
 * ImportedBasketsTray actions
 *
 */

import * as constants from './constants';

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}

export function changeSelection(data) {
  return {
    type: constants.CHANGE_SELECTION,
    data,
  };
}

export function submitForm(formValues) {
  return {
    type: constants.SUBMIT_FORM,
    formValues,
  };
}

export function submitFormSuccess(submittedValues, tableData, totalQuantity) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
    totalQuantity,
  };
}

export function exportPdf(formValues) {
  return {
    type: constants.EXPORT_PDF,
    formValues,
  };
}

export function deleteRecord(id) {
  return {
    type: constants.DELETE_RECORD,
    id,
  };
}

export function deleteRecordSuccess(id) {
  return {
    type: constants.DELETE_RECORD_SUCCESS,
    id,
  };
}

export function fetchDeliveryOrg(inputValue, callback) {
  return {
    type: constants.FETCH_DELIVERY_ORG,
    inputValue,
    callback,
  };
}

/**
 * @param {array} fieldData
 * @return {{fieldData: *, type: string}}
 */
export function fetchDeliveryOrgSuccess(fieldData) {
  return {
    type: constants.FETCH_DELIVERY_ORG_SUCCESS,
    fieldData,
  };
}

export function fetchFormData(formValues) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
  };
}

/**
 * @param {object} formData
 * @returns {{formData: *, type: string}}
 */
export function fetchFormDataSuccess(formData) {
  return { type: constants.FETCH_FORM_DATA_SUCCESS, formData };
}

export function getFormDataSuccess(formData) {
  return { type: constants.GET_FORM_DATA_SUCCESS, formData };
}

export function exportExcel(formValues) {
  return {
    type: constants.EXPORT_EXCEL,
    formValues,
  };
}

export function onChangeOrder(formValues, sort) {
  return {
    type: constants.CHANGE_ORDER,
    formValues,
    sort,
  };
}
