import { UPLOAD_FILE, OPEN_IMPORT_FILE } from './constants';

/**
 * Tải file đặt hàng NCC
 */
export function uploadFile(data, callback) {
  return {
    type: UPLOAD_FILE,
    data,
    callback,
  };
}

/**
 * Mở popup Import file
 */
export function openImportFile() {
  return {
    type: OPEN_IMPORT_FILE,
  };
}
