import * as constants from './constants';

/**
 * @param formValues
 * @param fetchNew
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
 * @param formData
 * @returns {{formValues: *, formData: *, type: *}}
 */
export function fetchFormDataSuccess(formData) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    formData,
  };
}

/**
 * Fetch Table Data by orgCode
 * @param formValues
 * @returns {{formValues: *, type: string}}
 */
export function fetchTableData(formValues) {
  return {
    type: constants.FETCH_TABLE_DATA,
    formValues,
  };
}

/**
 * Update store after fetching tableData
 * @param formValues
 * @param tableData
 * @returns {{formValues: *, tableData: *, type: *}}
 */
export function fetchTableDataSuccess(formValues, tableData) {
  return {
    type: constants.FETCH_TABLE_DATA_SUCCESS,
    formValues,
    tableData,
  };
}

/**
 * Update table data
 * @param tableData
 * @param formValues
 * @returns {{formValues: *, tableData: *}}
 */
export function updateTableData(tableData, formValues = undefined) {
  return {
    type: constants.UPDATE_TABLE_DATA,
    tableData,
    formValues,
  };
}

/**
 * @param inputValue
 * @param callback
 * @returns {{inputValue: *, callback: *}}
 */
export function fetchCustomerAutocomplete(inputValue, callback) {
  return {
    type: constants.FETCH_CUSTOMER_AUTOCOMPLETE,
    inputValue,
    callback,
  };
}

/**
 * @param inputValue
 * @param callback
 * @returns {{inputValue: *, callback: *}}
 */
export function fetchSoldToVinmartAutocomplete(inputValue, callback) {
  return {
    type: constants.FETCH_SOLDTO_VINMART_AUTOCOMPLETE,
    inputValue,
    callback,
  };
}

/**
 * Gọi API Tạo phiếu xuất bán
 * @param formValues
 * @returns {{formValues: *, type: *}}
 */
export function submitCreateExportReceipt(formValues) {
  return {
    type: constants.SUBMIT_CREATE_EXPORT_RECEIPT,
    formValues,
  };
}

export function exportExcel() {
  return {
    type: constants.EXPORT_EXCEL,
  };
}
