import * as constants from './constants';

/**
 * @param {object} formValues
 * @param {boolean} fetchNew - call api to fetch new form data
 * @returns {{formValues: *, type: *}}
 */
export function fetchFormData(formValues, fetchNew = true) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
    fetchNew,
  };
}

/**
 * @param {object} formData
 * @returns {{formData: *, type: *}}
 */
export function fetchFormDataSuccess(formData) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    formData,
  };
}

/**
 * Update table data
 * @param formValues
 * @return {{tableData: *, type: *}}
 */
export function fetchTableData(formValues) {
  return {
    type: constants.FETCH_TABLE_DATA,
    formValues,
  };
}

/**
 * Complete weighing
 * @param {object} submittedValues
 * @param {object} tableData
 * @return {{org: *, rowData: *, type: string}}
 */
export function fetchTableDataSuccess(submittedValues, tableData) {
  return {
    type: constants.FETCH_TABLE_DATA_SUCCESS,
    submittedValues,
    tableData,
  };
}

/**
 * Proceed Production Report
 * @param formValues
 * @returns {{formValues: *, type: *}}
 */
export function proceedReport(formValues) {
  return {
    type: constants.PROCEED_REPORT,
    formValues,
  };
}
