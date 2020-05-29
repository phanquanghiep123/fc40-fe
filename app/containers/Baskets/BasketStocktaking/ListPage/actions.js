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

export function submitFormBasket(formValuesBasket) {
  return {
    type: constants.SUBMIT_FORM_BASKET,
    formValuesBasket,
  };
}

export function submitFormBasketSuccess(
  submittedValuesBasket,
  tableBasketData,
  totalRowBasketData,
) {
  return {
    type: constants.SUBMIT_FORM_BASKET_SUCCESS,
    submittedValuesBasket,
    tableBasketData,
    totalRowBasketData,
  };
}

export function fetchFormData(formValues, formIsSubmitted = true) {
  return {
    type: constants.FETCH_FORM_DATA,
    formValues,
    formIsSubmitted,
  };
}

export function fetchFormDataSuccess(formData, DateFrom, DateTo) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    formData,
    DateFrom,
    DateTo,
  };
}

export function getFormDataSuccess(formData, formValues) {
  return {
    type: constants.GET_FORM_DATA_SUCCESS,
    formData,
    formValues,
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

export function syncReport(values, submittedValues, submittedValuesBasket) {
  return {
    type: constants.SYNC_DATA,
    payload: { values, submittedValues, submittedValuesBasket },
  };
}
