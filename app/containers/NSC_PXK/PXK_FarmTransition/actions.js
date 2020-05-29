import * as constants from './constants';

export function getProducts(text, callback, locatorId, detailsCommands) {
  return {
    type: constants.GET_PRODUCTS,
    text,
    callback,
    locatorId,
    detailsCommands,
  };
}

export function fetchProcessingTypeSuccess(processingType) {
  return {
    type: constants.SET_PROCESSING_TYPE,
    processingType,
  };
}

export function getOrganizationsSuccess(organizations) {
  return {
    type: constants.SET_ORGANIZATIONS,
    organizations,
  };
}

export function fetchInfoInitProductScreen() {
  return {
    type: constants.FETCH_INFO_INIT_PRODUCT_EXPORT,
  };
}

export function getSuggest(
  deliverCode,
  receiverCode,
  productName,
  slotCode,
  detailsCommands,
) {
  return {
    type: constants.GET_SUGGEST,
    deliverCode,
    receiverCode,
    productName,
    slotCode,
    detailsCommands,
  };
}

export function saveInventories(inventories) {
  return {
    type: constants.SAVE_INVENTORIES,
    inventories,
  };
}

/**
 * @returns {{type: *}}
 */
export function getDeliFormData() {
  return {
    type: constants.GET_DELI_FORM_DATA,
  };
}

/**
 * @param formData
 * @param formDefaultValues
 * @returns {{formDefaultValues: *, formData: *, type: *}}
 */
export function getDeliFormDataSuccess(formData, formDefaultValues) {
  return {
    type: constants.GET_DELI_FORM_DATA_SUCCESS,
    formData,
    formDefaultValues,
  };
}

/**
 * Get table data for deli suggestion popup
 * @param {object} formValues - formik values from PXK
 * @returns {{formValues: *, type: *}}
 */
export function getDeliTableData(formValues) {
  return {
    type: constants.GET_DELI_TABLE_DATA,
    formValues,
  };
}

/**
 * Save deli data to redux store
 * @param tableData
 * @returns {{tableData: *, type: *}}
 */
export function getDeliTableDataSuccess(tableData) {
  return {
    type: constants.GET_DELI_TABLE_DATA_SUCCESS,
    tableData,
  };
}

/**
 * @param inputValue
 * @param callback
 * @returns {{inputValue: *, callback: *, type: *}}
 */
export function getDeliProductCodeAutocomplete(inputValue, callback) {
  return {
    type: constants.GET_DELI_PRODUCT_CODE_AUTOCOMPLETE,
    inputValue,
    callback,
  };
}

/**
 * Update selectedRows
 *
 * @param selectedRows
 * @returns {{data: array, type: string}}
 */
export function deliChangeSelection(selectedRows) {
  return {
    type: constants.DELI_CHANGE_SELECTION,
    selectedRows,
  };
}

/**
 * Get data from selected products
 * @param {array}    selectedRows
 * @param {function} callback
 */
export function getDeliSelectProducts(deliverCode, selectedRows, callback) {
  return {
    type: constants.GET_DELI_SELECT_PRODUCTS,
    deliverCode,
    selectedRows,
    callback,
  };
}

export function getBatchAuto(params, inputText, callback) {
  return {
    type: constants.GET_BATCH_AUTO,
    params,
    inputText,
    callback,
  };
}
