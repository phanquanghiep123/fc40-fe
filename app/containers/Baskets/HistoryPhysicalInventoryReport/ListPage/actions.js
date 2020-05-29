import * as constants from './constants';

export function submitForm(formValues, formData) {
  return {
    type: constants.SUBMIT_FORM,
    formValues,
    formData,
  };
}

export function submitFormSuccess(submittedValues, tableData) {
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

export function onChangeOrder(submittedValues, formData) {
  return {
    type: constants.CHANGE_ORDER,
    submittedValues,
    formData,
  };
}

export function proceedReport(formValues, formData, callback) {
  return {
    type: constants.PROCEED_REPORT,
    formValues,
    formData,
    callback,
  };
}
