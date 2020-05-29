import * as constants from './constants';

/**
 * Fetch Organization List - Danh sách đơn vị
 * @return {{type: string}}
 */
export function fetchOrgList() {
  return {
    type: constants.FETCH_ORG_LIST,
  };
}

/**
 * Update store after fetching org list
 * @param formData
 * @return {{orgData: *, type: string}}
 */
export function fetchOrgListSuccess(formData) {
  return {
    type: constants.FETCH_ORG_LIST_SUCCESS,
    formData,
  };
}

/**
 * Fetch Table Data
 * @param {object} formValues
 * @return {{values: *, type: string}}
 */
export function fetchTableData(formValues) {
  return {
    type: constants.FETCH_TABLE_DATA,
    formValues,
  };
}

/**
 * Update store after fetching table data
 * @param tableData
 * @param formValues
 * @returns {{formValues: *, tableData: *, type: string}}
 */
export function fetchTableDataSuccess(tableData, formValues) {
  return {
    type: constants.FETCH_TABLE_DATA_SUCCESS,
    tableData,
    formValues,
  };
}

/**
 * Submit table data after editing
 * @param tableData
 * @param formValues
 * @returns {{formValues: *, tableData: *, type: string}}
 */
export function submitTableData(tableData, formValues) {
  return {
    type: constants.SUBMIT_TABLE_DATA,
    tableData,
    formValues,
  };
}

/**
 * Xuất file excel theo điều kiện lọc
 * @param formSubmittedValues
 * @returns {{type: *, formSubmittedValues: *}
 */
export function exportExcel(formSubmittedValues) {
  return {
    type: constants.EXPORT_EXCEL,
    formSubmittedValues,
  };
}

/**
 * After submitting
 * @param response
 * @return {{response: *, type: string}}
 */
export function submitTableDataSuccess(response) {
  return {
    type: constants.SUBMIT_TABLE_DATA,
    response,
  };
}

/**
 * Update table data
 * @param tableData
 * @return {{tableData: *, type: string}}
 */
export function updateTableData(tableData) {
  return {
    type: constants.UPDATE_TABLE_DATA,
    tableData,
  };
}
