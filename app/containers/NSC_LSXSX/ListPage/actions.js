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

export function onChangeOrder(submittedValues) {
  return {
    type: constants.CHANGE_ORDER,
    submittedValues,
  };
}

export function submitRunForm(submittedValues, callback) {
  return {
    type: constants.RUN_REPORT,
    submittedValues,
    callback,
  };
}

export function dataSynchronization(values) {
  return { type: constants.DATA_SYNCHRONIZATION, values };
}

export function signalRProcessing(res) {
  return { type: constants.SIGNALR_PROCESSING, res };
}
