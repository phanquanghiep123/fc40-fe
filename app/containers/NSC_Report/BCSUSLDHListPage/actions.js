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
 * Fetch Deliver
 *
 * @param {string} inputValue
 * @param {string} receiverCode
 * @param {function} callback
 * @return {{inputValue: *, type: string}}
 */
export function fetchDeliver(inputValue, receiverCode, callback) {
  return {
    type: constants.FETCH_DELIVER,
    inputValue,
    receiverCode,
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
export function fetchProduct(inputValue, callback) {
  return {
    type: constants.FETCH_PRODUCT,
    inputValue,
    callback,
  };
}
