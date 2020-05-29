import {
  UPDATE_BBGH,
  GET_INIT_BBGH,
  GET_INIT_BBGH_SUCCESS,
  GET_USERS_AUTO,
  GET_SHIPPER_AUTO,
  UPDATE_BBGH_SUCCESS,
} from './constants';

/**
 * @param {idBBGH: number} id of BBGH will show in screen
 *
 * @description
 * this is action get init information on update BBGH screen
 */
export function getInitPage(idBBGH) {
  return {
    type: GET_INIT_BBGH,
    idBBGH,
  };
}

/**
 * @param {idBBGH: number} id of BBGH will show in screen
 *
 * @description
 * this is action get init information on update BBGH screen
 */
export function getInitBBGHSuccess(BBGH) {
  return {
    type: GET_INIT_BBGH_SUCCESS,
    BBGH,
  };
}

/**
 *
 * @param {*} inputText: string
 * @param {*} selectedUnitId : int
 * @param {*} callback : function
 */
export function getUsersAuto(inputText, selectedUnitId, callback) {
  return {
    type: GET_USERS_AUTO,
    inputText,
    selectedUnitId,
    callback,
  };
}

/**
 *
 * @param {inputText: string}
 * @param {callback: function}
 */
export function getShipperAuto(inputText, callback) {
  return {
    type: GET_SHIPPER_AUTO,
    inputText,
    callback,
  };
}

/**
 * @param {BBGH: object}
 * @param {callback: function}
 * @description
 *
 * update BBGH
 */
export function updateBBGH(BBGH, callback) {
  return {
    type: UPDATE_BBGH,
    BBGH,
    callback,
  };
}

/**
 *
 * @param {*} message : string
 */
export function updateBBGHSuccess(res) {
  return {
    type: UPDATE_BBGH_SUCCESS,
    res,
  };
}
