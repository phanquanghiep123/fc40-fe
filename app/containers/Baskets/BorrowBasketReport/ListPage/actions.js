import * as constants from './constants';

export function submitForm(formValues, formData) {
  return {
    type: constants.SUBMIT_FORM,
    formValues,
    formData,
  };
}

export function submitFormSuccess(submittedValues, tableData, totalRow) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
    totalRow,
  };
}

export function fetchFormData(formValues) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
  };
}

export function fetchFormDataSuccess(formData) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    formData,
  };
}

export function getFormDataSuccess(formData) {
  return {
    type: constants.GET_FORM_DATA_SUCCESS,
    formData,
  };
}

export function fetchVendorCode(inputValue, vendorType, callback) {
  return {
    type: constants.FETCH_VENDOR_CODE,
    inputValue,
    vendorType,
    callback,
  };
}

export function fetchVendorCodeSuccess(fieldData) {
  return {
    type: constants.FETCH_VENDOR_CODE_SUCCESS,
    fieldData,
  };
}

export function printSelected(formValues, formData, callback) {
  return {
    type: constants.PRINT_SELECTED,
    formValues,
    formData,
    callback,
  };
}

export function exportExcel(formValues, formData) {
  return {
    type: constants.EXPORT_EXCEL,
    formValues,
    formData,
  };
}
