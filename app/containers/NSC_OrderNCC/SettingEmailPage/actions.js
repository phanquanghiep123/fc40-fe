import * as constants from './constants';

/**
 * Update table data
 * @param values
 * @return {{tableData: *, type: *}}
 */
export function submitForm(values) {
  return {
    type: constants.SUBMIT_FORM,
    values,
  };
}

/**
 * Update table data
 * @param values
 * @return {{tableData: *, type: *}}
 */
export function filterEmail(values) {
  return {
    type: constants.INPUT_FORM,
    values,
  };
}

/**
 * Complete weighing
 * @param {object} submittedValues
 * @param {object} tableData
 * @return {{org: *, rowData: *, type: string}}
 */
export function formSubmitSuccess(submittedValues, tableData) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
  };
}

/**
 * Complete weighing
 * @param {object} formValues
 * @return {{org: *, rowData: *, type: string}}
 */
export function fetchFormData(formValues) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
  };
}

export function formDataFetched(data) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    data,
  };
}

export function inputFormSuccess(data) {
  return {
    type: constants.INPUT_FORM_SUCCESS,
    data,
  };
}

/**
 * Get auto complete ccEmail
 *
 * @param {string} data  Từ khóa tìm kiếm
 * @param {function} callback
 */
export function getEmailAuto(data, callback) {
  return {
    type: constants.GET_EMAIL_AUTO,
    data,
    callback,
  };
}
