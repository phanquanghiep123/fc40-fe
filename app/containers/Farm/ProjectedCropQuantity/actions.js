import * as constants from './constants';

/**
 * @param formValues - form values to submit
 * @param fetchNew - if true => call api to fetch new form data
 * @returns {{formValues: *, fetchNew: *, type: *}}
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
 * @returns {{formValues: *, tableData: *, type: *}}
 */
export function fetchFormDataSuccess(formData) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    formData,
  };
}

/**
 * @param {object} formValues - submitted form values
 * @returns {{submittedValues: *, type: string}}
 */
export function fetchTableData(formValues) {
  return {
    type: constants.FETCH_TABLE_DATA,
    formValues,
  };
}

/**
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
 * @param submittedValues - submitted form values
 * @returns {{submittedValues: *, type: *}}
 */
export function exportExcel(submittedValues) {
  return {
    type: constants.EXPORT_EXCEL,
    submittedValues,
  };
}

/**
 * @param formValues - form values of the import popup
 * @param searchFormValues - form values of the search box
 * @returns {{formValues: *, type: *}}
 */
export function importCSV(formValues, searchFormValues) {
  return {
    type: constants.IMPORT_CSV,
    formValues,
    searchFormValues,
  };
}

/**
 * @param inputValue
 * @param callback
 * @returns {{inputValue: *, callback: *, type: *}}
 */
export function fetchProductsAutocomplete(inputValue, callback) {
  return {
    type: constants.FETCH_PRODUCTS_AC,
    inputValue,
    callback,
  };
}

/**
 * @param inputValue
 * @param plantArray
 * @param callback
 * @returns {{inputValue: *, callback: *, type: *}}
 */
export function fetchLSXAutocomplete(inputValue, plantArray, callback) {
  return {
    type: constants.FETCH_LSX_AC,
    inputValue,
    plantArray,
    callback,
  };
}

/**
 * Update Projected Crop Quantity - Cập nhật kế hoạch sản lượng
 * @param updateValues - form values of the update quantity form
 * @param submittedSearchValues - submitted form values of the search form
 * @returns {{submittedSearchValues: *, type: *, updateValues: *}}
 */
export function updateQuantity(updateValues, submittedSearchValues) {
  return {
    type: constants.UPDATE_QUANTITY,
    updateValues,
    submittedSearchValues,
  };
}
