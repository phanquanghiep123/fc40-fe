/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  CLOSE_SNACK_BAR,
  CLOSE_DIALOG,
  OPEN_DIALOG,
  LOADING_ERROR,
  GET_MENU,
  SAVE_MENU,
  ALERT_INVALID,
  SET_LOADING,
  CONNEC_DEVICE,
  RECIVE_DATA,
} from './constants';
import MESSAGE from './messageGlobal';

/**
 * @action for global state
 *
 * ui, system action
 */

export function closeSnackBar() {
  return {
    type: CLOSE_SNACK_BAR,
  };
}

export function closeDialog() {
  return {
    type: CLOSE_DIALOG,
  };
}

export function openDialog() {
  return {
    type: OPEN_DIALOG,
  };
}

export function showSuccess(message) {
  return {
    type: LOADING_ERROR,
    status: { type: 'success', message },
  };
}

export function showInfomation(message) {
  return {
    type: LOADING_ERROR,
    status: { type: 'info', message },
  };
}

export function showWarning(message) {
  return {
    type: LOADING_ERROR,
    status: { type: 'warning', message },
  };
}

export function loadingError(message) {
  let mesLocalize = message;
  if (message === 'Failed to fetch') {
    mesLocalize = MESSAGE.NOT_CONNECT_NETWORK;
  }
  return {
    type: LOADING_ERROR,
    status: { type: 'error', message: mesLocalize },
  };
}

export function getMenu() {
  return {
    type: GET_MENU,
  };
}

export function saveMenu(menu) {
  return {
    type: SAVE_MENU,
    menu,
  };
}

export function alertInvalidWhenSubmit(message) {
  return {
    type: ALERT_INVALID,
    message,
  };
}

/**
 * @param{isLoading: bool} state loading UI
 *
 * @description
 * set state loading
 * @true loading
 * @false not loading
 */
export function setLoading(isLoading = true) {
  return {
    type: SET_LOADING,
    isLoading,
  };
}

/**
 *
 * @param {*} status bool // state of connect
 * true: connect
 * false: disconnect
 */
export function connectDevice(status) {
  return {
    type: CONNEC_DEVICE,
    status,
  };
}

export function reciveData(data) {
  return {
    type: RECIVE_DATA,
    data,
  };
}
