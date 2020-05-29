import * as constants from './constants';

export function submitForm(formValues, formData) {
  return {
    type: constants.SUBMIT_FORM,
    formValues,
    formData,
  };
}

export function submitFormSuccess(
  submittedValues,
  tableData,
  columns,
  totalRowData,
) {
  return {
    type: constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
    columns,
    totalRowData,
  };
}

export function fetchFormData(formValues, fetchNew = true) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
    fetchNew,
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
