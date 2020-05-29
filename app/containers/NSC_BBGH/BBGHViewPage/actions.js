import {
  GET_INIT_BBGH,
  GET_INIT_BBGH_SUCCESS,
  PRINT_BBGH,
  DELETE_IMAGE,
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
 * @param {*} id : number id of BBGH
 * @param {*} callback : function is called when response is return
 */
export function printBBGH(id, callback) {
  return {
    type: PRINT_BBGH,
    id,
    callback,
  };
}

/**
 *
 * @param {idImage: number} id of image is deleted
 * @param {callback: function} method is called when response is successful
 */
export function deleteImage(idBBGH, idImage, callback) {
  return {
    type: DELETE_IMAGE,
    idBBGH,
    idImage,
    callback,
  };
}
