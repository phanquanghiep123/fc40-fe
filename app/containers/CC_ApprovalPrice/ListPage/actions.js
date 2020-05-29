import * as constants from './constants';

/**
 * Fetch data => set to reducer => make default values
 * => dispatch a submit form action with default values
 * @param {object} formValues
 * @returns {{type: string}}
 */
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
/**
 * @param {object} formValues
 * @returns {{formValues: *, type: string}}
 */
export function submitForm(formValues) {
  return {
    type: constants.SUBMIT_FORM,
    formValues,
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

/**
 * Auto complete Mã sản phẩm
 */
export function getProductAuto(inputText, callback) {
  return {
    type: constants.GET_PRODUCT_AUTO,
    inputText,
    callback,
  };
}

export function onSubmitFile(form) {
  return {
    type: constants.ON_SUBMIT_FILE,
    form,
  };
}

export function submitFileSignalr(res, callback) {
  return { type: constants.SUBMIT_FILE_SIGNALR, res, callback };
}

export function signalRProcessing(res) {
  return { type: constants.SIGNALR_PROCESSING, res };
}

export function downloadSampleFile(res) {
  return { type: constants.DOWNLOAD_SAMPLE_FILE, res };
}
