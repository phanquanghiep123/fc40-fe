import { SEND_STATUS } from './constants';

/**
 * Kiểm tra trạng thái Đã gửi của tất cả các NCC
 */
export const getIsSent = datas => {
  if (datas && datas.length > 0) {
    // Kiểm tra có NCC chưa được gửi mail
    const foundUnsent = datas.find(
      item => item && item.status === SEND_STATUS.UNSENT,
    );

    if (foundUnsent) {
      return false;
    }
  }
  return true;
};

/**
 * Lấy danh sách Id
 */
export const getListIds = datas => {
  if (datas && datas.length > 0) {
    const results = [];

    for (let i = 0; i < datas.length; i += 1) {
      const data = datas[i];

      if (data && data.id > 0) {
        results.push(data.id);
      }
    }

    return results;
  }
  return [];
};
