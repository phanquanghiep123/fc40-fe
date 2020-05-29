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

export function getFormDataSuccess(formData) {
  return { type: constants.GET_FORM_DATA_SUCCESS, formData };
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
export function deleteRecord(formValues, recordId) {
  return {
    type: constants.DELETE_RECORD,
    formValues,
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

/**
 * @param {object} formSubmittedValues
 */
export function exportPdf(formSubmittedValues) {
  return {
    type: constants.EXPORT_PDF,
    formSubmittedValues,
  };
}
/**
 * Fetch DeliveryOrg
 *
 * @param {string} inputValue
 * @param {function} callback
 * @return {{inputValue: *, type: string}}
 */
export function fetchApprove(inputValue, callback) {
  return {
    type: constants.GET_APPROVER_DATA,
    inputValue,
    callback,
  };
}

/**
 * @param {array} fieldData
 * @return {{fieldData: *, type: string}}
 */
export function fetchApproveSuccess(fieldData) {
  return {
    type: constants.GET_APPROVER_DATA_SUCCESS,
    fieldData,
  };
}
export function pagingInit(submittedValues) {
  return {
    type: constants.PAGING_INIT,
    submittedValues,
  };
}
export function pagingSuccess(tableData) {
  return {
    type: constants.PAGING_SUCCESS,
    tableData,
  };
}
export function onApprovel(item, submittedValues) {
  return {
    type: constants.APPROVEL_ITEM,
    item,
    submittedValues,
  };
}

export function updateRowApprovel(submittedValues) {
  return {
    type: constants.APPROVEL_SUCCESS,
    submittedValues,
  };
}

export function onChangeOrder(submittedValues) {
  return {
    type: constants.CHANGE_ORDER,
    submittedValues,
  };
}
