import * as constants from './constants';

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

export function deleteRecord(id) {
  return {
    type: constants.DELETE_RECORD,
    id,
  };
}

export function recordDeleted(id, response) {
  return {
    type: constants.DELETE_RECORD_SUCCESS,
    id,
    response,
  };
}

// FORM ACTIONS

/**
 * @param formValues
 * @param fetchNew
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

export function submitForm(values) {
  return {
    type: constants.SUBMIT_FORM,
    values,
  };
}

// when success
export function formSubmitted(submittedValues, tableData) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
  };
}

export function updateTableData(tableData) {
  return {
    type: constants.UPDATE_TABLE_DATA,
    tableData,
  };
}

export function printSelected(selectedRows, callback) {
  return { type: constants.PRINT_SELECTED, selectedRows, callback };
}

export function exportExcel(formSubmittedValues, filterColumn) {
  return {
    type: constants.EXPORT_EXCEL,
    formSubmittedValues,
    filterColumn,
  };
}

/**
 * @param {string|number} id
 * @return {{documentId: *, type: string}}
 */
export function requestAutoCreate(id) {
  return {
    type: constants.REQUEST_AUTO_CREATE,
    id,
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
