import * as constants from './constants';

/**
 * Update table data
 * @param tableData
 * @return {{tableData: *, type: *}}
 */
export function updateTableData(tableData) {
  return {
    type: constants.UPDATE_TABLE_DATA,
    tableData,
  };
}

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
 * @param id
 * @return {{org: *, rowData: *, type: string}}
 */
export function deleteRecord(id) {
  return {
    type: constants.DELETE_RECORD,
    id,
  };
}

/**
 * Complete weighing
 * @param id
 * @param response
 * @return {{org: *, rowData: *, type: string}}
 */
export function recordDeleted(id, response) {
  return {
    type: constants.DELETE_RECORD_SUCCESS,
    id,
    response,
  };
}

/**
 * @param {object} formValues
 * @param {boolean} fetchNew
 * @returns {{formValues: *, fetchNew: *, type: *}}
 */
export function fetchFormData(formValues, fetchNew = true) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
    fetchNew,
  };
}

export function formDataFetched(data) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    data,
  };
}

/**
 * @param {array} selectedRecords
 * @param {function} callback
 * @returns {{callback: *, type: string, selectedRecords: *}}
 */
export function printSelectedRecords(selectedRecords, callback) {
  return {
    type: constants.PRINT_SELECTED,
    selectedRecords,
    callback,
  };
}
/**
 * Update selectedRows
 *
 * @param data
 * @returns {{data: array, type: string}}
 */
export function changeSelection(data) {
  return {
    type: constants.CHANGE_SELECTION,
    data,
  };
}

/**
 * @param {object} values
 */
export function exportExcel(values) {
  return {
    type: constants.EXPORT_EXCEL,
    values,
  };
}

/**
 * @param {object} selectedRecords
 */
export function exportExcelLog(selectedRecords) {
  return {
    type: constants.EXPORT_EXCEL_LOG,
    selectedRecords,
  };
}
/**
 * @param {object} selectedRecords
 */
export function exportExcelIcd(selectedRecords) {
  return {
    type: constants.EXPORT_EXCEL_ICD,
    selectedRecords,
  };
}
/**
 * Fetch Customer
 *
 * @param {string} inputValue
 * @param {function} callback
 * @return {{inputValue: *, type: string}}
 */
export function fetchCustomer(inputValue, callback) {
  return {
    type: constants.FETCH_CUSTOMER,
    inputValue,
    callback,
  };
}
/**
 * Fetch Creator
 *
 * @param {string} inputValue
 * @param {function} callback
 * @return {{inputValue: *, type: string}}
 */
export function fetchCreator(inputValue, callback) {
  return {
    type: constants.FETCH_CREACTOR,
    inputValue,
    callback,
  };
}
