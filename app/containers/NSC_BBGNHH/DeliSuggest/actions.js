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
 * @param {string} deliverCode Mã bên giao hàng
 * @param {string} deliverName Tên bên giao hàng
 * @param {string} deliveryDate Ngày giao hàng
 * @param {string} deliveryReceiptStocks Danh sách hàng hóa
 */
export function openPopup(
  deliverCode,
  deliverName,
  deliveryDate,
  deliveryReceiptStocks,
) {
  return {
    type: constants.OPEN_POPUP,
    deliverCode,
    deliverName,
    deliveryDate,
    deliveryReceiptStocks,
  };
}

/**
 * @param {array} selectedRecords
 * @returns {{callback: *, type: string, selectedRecords: *}}
 */
export function submitStoreRecords(selectedRecords, formValues) {
  return {
    type: constants.SUBMIT_STORE,
    selectedRecords,
    formValues,
  };
}

/**
 * Complete weighing
 * @param {object} submittedValues
 * @param {object} tableData
 * @return {{org: *, rowData: *, type: string}}
 */
export function submitStoreSuccess(submittedValues, tableData) {
  return {
    type: constants.SUBMIT_STORE_SUCCESS,
    submittedValues,
    tableData,
  };
}

/**
 * Fetch Route
 *
 * @param {string} inputValue
 * @param {function} callback
 * @return {{inputValue: *, type: string}}
 */
export function fetchRoute(inputValue, callback) {
  return {
    type: constants.FETCH_ROUTE,
    inputValue,
    callback,
  };
}
