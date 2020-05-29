import * as constants from './constants';

/**
 * Initially Fetch Organization List
 */
export function fetchOrgList() {
  return {
    type: constants.FETCH_ORG_LIST,
  };
}

/**
 * Update store after fetching org list
 * @param {array} orgList - danh sách đơn vị
 * @param defaultOrg
 * @return {{orgList: *, type: string}}
 */
export function fetchOrgListSuccess(orgList, defaultOrg) {
  return {
    type: constants.FETCH_ORG_LIST_SUCCESS,
    orgList,
    defaultOrg,
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

export function fetchFormData(formValues) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
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
 * Fetch Goods
 *
 * @param {string} inputValue
 * @param {function} callback
 * @return {{inputValue: *, type: string}}
 */
export function fetchGoods(inputValue, callback) {
  return {
    type: constants.FETCH_GOODS,
    inputValue,
    callback,
  };
}
