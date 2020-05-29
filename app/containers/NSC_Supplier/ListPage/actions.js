import * as constants from './constants';

/**
 * Fetch data => set to reducer => make default values
 * => dispatch a submit form action with default values
 * @param {object} formValues
 * @returns {{type: string}}
 */
export function fetchFormData(formValues) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
  };
}

/**
 * @param {object} formData
 * @returns {{formData: *, type: string}}
 */
export function fetchFormDataSuccess(formData) {
  return { type: constants.FETCH_FORM_DATA_SUCCESS, formData };
}

/**
 * @param {object} formValues
 * @returns {{formValues: *, type: string}}
 */
export function submitForm(formValues) {
  return {
    type: constants.SUBMIT_FORM,
    formValues,
  };
}

/**
 * @param {object} submittedValues
 * @param {array} tableData
 * @returns {{tableData: *, type: string, submittedValues: *}}
 */
export function submitFormSuccess(submittedValues, tableData) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
  };
}

/**
 * @param {string|integer} recordId
 * @returns {{recordId: *, type: string}}
 */
export function deleteRecord(recordId) {
  return {
    type: constants.DELETE_RECORD,
    recordId,
  };
}

/**
 * @param {string|integer} recordId
 * @returns {{recordId: *, type: string}}
 */
export function deleteRecordSuccess(recordId) {
  return {
    type: constants.DELETE_RECORD_SUCCESS,
    recordId,
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
 * @param {array} tableData
 * @returns {{tableData: *, type: string}}
 */
export function updateTableData(tableData) {
  return {
    type: constants.UPDATE_TABLE_DATA,
    tableData,
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
 * Fetch DeliveryOrg
 *
 * @param {string} inputValue
 * @param {function} callback
 * @return {{inputValue: *, type: string}}
 */
export function fetchDeliveryOrg(inputValue, callback) {
  return {
    type: constants.FETCH_DELIVERY_ORG,
    inputValue,
    callback,
  };
}

/**
 * @param {array} fieldData
 * @return {{fieldData: *, type: string}}
 */
export function fetchDeliveryOrgSuccess(fieldData) {
  return {
    type: constants.FETCH_DELIVERY_ORG_SUCCESS,
    fieldData,
  };
}

/**
 * @param {object} formSubmittedValues
 */
export function exportExcel(formSubmittedValues) {
  return {
    type: constants.EXPORT_EXCEL,
    formSubmittedValues,
  };
}
