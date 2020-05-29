import * as constants from './constants';

/**
 * @param formValues
 * @param fetchNew
 * @returns {{formValues: *, type: string}}
 */
export function fetchFormData(formValues, fetchNew = true) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
    fetchNew,
  };
}

/**
 * @param data
 * @returns {{data: *, type: string}}
 */
export function fetchFormDataSuccess(data) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    data,
  };
}

/**
 * @param formValues
 * @returns {{formValues: *, type: string}}
 */
export function submitForm(formValues) {
  return {
    type: constants.SUBMIT_FORM,
    formValues,
  };
}

export function purchaseStopping(ids, callback) {
  return {
    type: constants.PURCHASE_STOPPING,
    ids,
    callback,
  };
}

export function checkWarning(form) {
  return {
    type: constants.CHECK_WARNING,
    form,
  };
}

export function sendEmail(date) {
  return {
    type: constants.SEND_EMAIL,
    date,
  };
}

export function downloadWarningFile(date) {
  return {
    type: constants.DOWNLOAD_WARNING_FILE,
    date,
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
 * @param submittedValues
 * @param tableData
 * @returns {{tableData: *, type: string, submittedValues: *}}
 */
export function submitFormSuccess(submittedValues, tableData) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
  };
}

/**
 * @param formSubmittedValues
 * @param filterColumn
 * @returns {{formSubmittedValues: *, filterColumn: *, type: string}}
 */
export function exportExcel(formSubmittedValues, filterColumn) {
  return {
    type: constants.EXPORT_EXCEL,
    formSubmittedValues,
    filterColumn,
  };
}

/**
 * @param form
 * @param callback
 * @returns {{form: *, callback: *, type: string}}
 */
export function submitFile(form, callback) {
  return { type: constants.SUBMIT_FILE, form, callback };
}

export function submitFileSignalr(res, processingDate, callback) {
  return { type: constants.SUBMIT_FILE_SIGNALR, res, processingDate, callback };
}

export function signalRProcessing(res) {
  return { type: constants.SIGNALR_PROCESSING, res };
}
