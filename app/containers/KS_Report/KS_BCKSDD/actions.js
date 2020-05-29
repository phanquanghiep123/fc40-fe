import * as constants from './constants';

export function fetchFormData(formValues, fetchNew = true) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
    fetchNew,
  };
}

export function fetchFormDataSuccess(data) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    payload: data,
  };
}

export function fetchReportData(formData) {
  return {
    type: constants.FETCH_REPORT_DATA,
    payload: formData,
  };
}

export function fetchReportDataSuccess(data) {
  return {
    type: constants.FETCH_REPORT_DATA_SUCCESS,
    payload: data,
  };
}

export function exportReport(formData) {
  return {
    type: constants.EXPORT_REPORT,
    payload: formData,
  };
}

export function printReport(formData, callback) {
  return {
    type: constants.PRINT_REPORT,
    payload: formData,
    callback,
  };
}

export function orderChange(formData, sort) {
  return {
    type: constants.ORDER_CHANGE,
    payload: { formData, sort },
  };
}

export function syncReport(values) {
  return {
    type: constants.SYNC_DATA,
    payload: { values },
  };
}

export function signalIrProcessing(requestId, response, submittedValues) {
  return {
    type: constants.SIGNALIR_PROCESSING,
    requestId,
    response,
    submittedValues,
  };
}
