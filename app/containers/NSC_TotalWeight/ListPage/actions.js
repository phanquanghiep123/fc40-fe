import * as constants from './constants';

/**
 * Initially Fetch Organization List
 * @param formValues
 * @param fetchNew
 * @returns {{formValues: *, type: string}}
 */
export function fetchOrgList(formValues, fetchNew = true) {
  return {
    type: constants.FETCH_ORG_LIST,
    formValues,
    fetchNew,
  };
}

/**
 * Update store after fetching org list
 * @param orgList
 * @returns {{formValues: *, orgList: *, type: string}}
 */
export function fetchOrgListSuccess(orgList) {
  return {
    type: constants.FETCH_ORG_LIST_SUCCESS,
    orgList,
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
 * @param formData
 * @param tableData
 * @param formValues
 * @returns {{formValues: *, formData: *, tableData: *, type: string}}
 */
export function fetchTableDataSuccess(formData, tableData, formValues) {
  return {
    type: constants.FETCH_TABLE_DATA_SUCCESS,
    formData,
    tableData,
    formValues,
  };
}

/**
 * Complete weighing
 * @param org
 * @param date
 * @param rowData
 * @param callback
 * @returns {{date: *, org: *, rowData: *, callback: *, type: string}}
 */
export function completeWeighing(org, date, rowData, callback) {
  return {
    type: constants.COMPLETE_WEIGHING,
    org,
    date,
    rowData,
    callback,
  };
}

/**
 * Hoàn thành phiếu cân
 * @param org
 * @param date
 * @returns {{date: *, org: *, type: string}}
 */
export function completeAll(org, date) {
  return {
    type: constants.COMPLETE_ALL,
    org,
    date,
  };
}

/**
 * Tải xuống
 * @param {object} formSubmittedValues
 * @returns {{type: string, formSubmittedValues: *}}
 */
export function exportExcel(formSubmittedValues) {
  return {
    type: constants.EXPORT_EXCEL,
    formSubmittedValues,
  };
}

/**
 * Update table data
 * @param tableData
 * @param formValues
 * @returns {{formValues: *, tableData: *, type: string}}
 */
export function updateTableData(tableData, formValues = undefined) {
  return {
    type: constants.UPDATE_TABLE_DATA,
    tableData,
    formValues,
  };
}

export function updateLocators(locators) {
  return {
    type: constants.UPDATE_LOCATORS,
    locators,
  };
}

/**
 * Update form data
 * @param {object} formData - data to render form options
 * @returns {{formData: *, type: string}}
 */
export function updateFormData(formData) {
  return {
    type: constants.UPDATE_FORM_DATA,
    formData,
  };
}

/**
 * Open weight popup
 * @param {object} weightData
 */
export function openWeightPopup(weightData) {
  return {
    type: constants.OPEN_WEIGHT_POPUP,
    weightData,
  };
}

/**
 * Set init weight data
 * @param {object} weightData
 */
export function setInitWeightData(weightData) {
  return {
    type: constants.SET_INIT_WEIGHT_DATA,
    weightData,
  };
}

/**
 * Delete Row Data
 * @param rowData
 * @param callback
 * @returns {{rowData: *, callback: *, type: string}}
 */
export function deleteRowData(rowData, callback) {
  return {
    type: constants.DELETE_ROW_DATA,
    rowData,
    callback,
  };
}
