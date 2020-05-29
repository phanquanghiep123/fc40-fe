import {
  GET_IMPORTED_STOCK_BY_ID,
  UPDATE_DETAIL,
  PRINT_IMPORTED_STOCK,
  SUBMIT_FORM,
  COMPLETE_SUCCESS,
} from './constants';

export function getImportedStockById(id) {
  return {
    type: GET_IMPORTED_STOCK_BY_ID,
    id,
  };
}

export function updateDetail(schema, data) {
  return {
    type: UPDATE_DETAIL,
    schema,
    data,
  };
}

export function printImportedStock(id, callback) {
  return {
    type: PRINT_IMPORTED_STOCK,
    id,
    callback,
  };
}

export function submitForm(completeInfo, callback) {
  return {
    type: SUBMIT_FORM,
    completeInfo,
    callback,
  };
}

export function completeSuccess() {
  return {
    type: COMPLETE_SUCCESS,
  };
}
