import { OPEN_POPUP, GET_DELIVER_AUTO } from './constants';

export function openPopup(documentId) {
  return {
    type: OPEN_POPUP,
    documentId,
  };
}

/**
 * Get auto complete của Đơn vị giao hàng
 *
 * @param {string} inputText  Từ khóa tìm kiếm
 * @param {function} callback
 */
export function getDeliverAuto(inputText, callback) {
  return {
    type: GET_DELIVER_AUTO,
    inputText,
    callback,
  };
}
