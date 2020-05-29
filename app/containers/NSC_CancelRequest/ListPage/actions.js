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
 * @param isBasket
 * @return {Object}
 */
export function deleteRecord(id, isBasket) {
  return {
    type: constants.DELETE_RECORD,
    id,
    isBasket,
  };
}

/**
 * Update table after deleting a record
 * @param id
 * @param isBasket
 * @return {Object}
 */
export function recordDeleted(id, isBasket) {
  return {
    type: constants.DELETE_RECORD_SUCCESS,
    id,
    isBasket,
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
 * Get khay sọt autocomplete
 * @param inputText
 * @param callback
 * @returns {{payload: {inputText: *, callback: *}, type: *}}
 */
export function fetchBasketAC(inputText, callback) {
  return {
    type: constants.FETCH_BASKET_AC,
    payload: { inputText, callback },
  };
}

/**
 * Get người tạo phiếu autocomplete
 * @param inputText
 * @param callback
 * @returns {{payload: {inputText: *, callback: *}, type: *}}
 */
export function fetchRequesterAC(inputText, callback) {
  return {
    type: constants.FETCH_REQUESTER_AC,
    payload: { inputText, callback },
  };
}

/**
 * Get người xuất huỷ autocomplete
 * @param inputText
 * @param callback
 * @returns {{payload: {inputText: *, callback: *}, type: *}}
 */
export function fetchExecutorAC(inputText, callback) {
  return {
    type: constants.FETCH_EXECUTOR_AC,
    payload: { inputText, callback },
  };
}

/**
 * Get người phê duyệt autocomplete
 * @param inputText
 * @param callback
 * @return {{payload: {inputText: *, callback: *}, type: string}}
 */
export function fetchApproverAC(inputText, callback) {
  return {
    type: constants.FETCH_APPROVER_AC,
    payload: { inputText, callback },
  };
}

/**
 * Xuất excel
 * @param filters - current filters
 * @returns {{payload: {records: *}, type: *}}
 */
export function exportExcel(filters) {
  return {
    type: constants.EXPORT_EXCEL,
    payload: { filters },
  };
}
