import { SEND_MAIL, DOWNLOAD_FILE, SEND_MAIL_SUCCESS } from './constants';

/**
 * Gửi mail
 */
export function sendMail(datas, callback) {
  return {
    type: SEND_MAIL,
    datas,
    callback,
  };
}

/**
 * Tải file kết quả
 */
export function downloadFile(downloadId) {
  return {
    type: DOWNLOAD_FILE,
    downloadId,
  };
}

/**
 * Gửi mail thành công
 */
export function sendMailSuccess(payload) {
  return {
    type: SEND_MAIL_SUCCESS,
    payload,
  };
}
