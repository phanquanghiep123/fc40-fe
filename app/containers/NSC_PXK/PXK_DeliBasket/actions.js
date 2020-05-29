import * as constants from './constants';

/**
 * @param formValues
 * @param fetchNew
 * @returns {{formValues: *, type: string}}
 */
export function fetchFieldsData(formValues, fetchNew = true) {
  return {
    type: constants.FETCH_FIELDS_DATA,
    formValues,
    fetchNew,
  };
}

/**
 * @param fieldsData
 * @returns {{formData: *, type: string}}
 */
export function fetchFieldsDataSuccess(fieldsData) {
  return {
    type: constants.FETCH_FIELDS_DATA_SUCCESS,
    fieldsData,
  };
}

/**
 * @param {object} formValues
 * @param {array} currentTableData
 * @returns {{formValues: *, type: string}}
 */
export function fetchTableData(formValues, currentTableData = []) {
  return {
    type: constants.FETCH_TABLE_DATA,
    formValues,
    currentTableData,
  };
}

/**
 * @param formValues
 * @param tableData
 * @returns {{formValues: *, type: string}}
 */
export function fetchTableDataSuccess(formValues, tableData) {
  return {
    type: constants.FETCH_TABLE_DATA_SUCCESS,
    formValues,
    tableData,
  };
}

/**
 * @param inputText
 * @param callback
 * @returns {{inputText: *, callback: *, type: *}}
 */
export function fetchRouteAutocomplete(inputText, callback) {
  return {
    type: constants.FETCH_ROUTE_AUTOCOMPLETE,
    inputText,
    callback,
  };
}

/**
 * @param inputText
 * @param callback
 * @returns {{inputText: *, callback: *, type: *}}
 */
export function fetchBasketAutocomplete(inputText, callback) {
  return {
    type: constants.FETCH_BASKET_AUTOCOMPLETE,
    inputText,
    callback,
  };
}

/**
 * @param inputText
 * @param submittedValues
 * @param callback
 * @returns {{inputText: *, callback: *, type: *, submittedValues: *}}
 */
export function fetchCustomerAutocomplete(
  inputText,
  submittedValues,
  callback,
) {
  return {
    type: constants.FETCH_CUSTOMER_AUTOCOMPLETE,
    inputText,
    submittedValues,
    callback,
  };
}

/**
 * @param formValues
 * @param submittedValues - form submitted values
 * @returns {{formValues: *, type: *}}
 */
export function submitData(formValues, submittedValues) {
  return {
    type: constants.SUBMIT_DATA,
    formValues,
    submittedValues,
  };
}

/**
 * @param formValues
 * @param callback
 * @returns {{formValues: *, callback: *, type: *}}
 */
export function printData(formValues, callback) {
  return {
    type: constants.PRINT_DATA,
    formValues,
    callback,
  };
}

/**
 * @param tableData
 * @param formValues
 * @returns {{formValues: *, callback: *, type: *}}
 */
export function updateTableData(tableData, formValues = undefined) {
  return {
    type: constants.UPDATE_TABLE_DATA,
    tableData,
    formValues,
  };
}
