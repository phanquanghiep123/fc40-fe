import { ALERT_INVALID } from 'containers/App/constants';
import * as Constants from './constants';

/**
 * @param {id}: number} id of Supplier will show in screen
 *
 * @description
 * this is action get init information on update Supplier screen
 */
export function getInitPage(itemId) {
  return {
    type: Constants.GET_INIT_DATA,
    itemId,
  };
}

/**
 * @param {id}: number} id of Supplier will show in screen
 *
 * @description
 * this is action get init information on update Supplier screen
 */
export function getInitPageSuccess(item) {
  return {
    type: Constants.GET_INIT_DATA_SUCCESS,
    item,
  };
}

export function submitForm(path, form, callback) {
  return {
    type: Constants.SUBMIT_FORM,
    path,
    form,
    callback,
  };
}

export function submitFormSuccess(submittedValues, tableData) {
  return {
    type: Constants.SUBMIT_FORM_SUCCESS,
    submittedValues,
    tableData,
  };
}

export function alertInvalid(message) {
  return {
    type: ALERT_INVALID,
    message,
  };
}
