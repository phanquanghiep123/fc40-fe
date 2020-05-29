import * as Yup from 'yup';

export default Yup.object().shape({
  // Tên File
  fileName: Yup.string(),

  // Tổng số NCC
  totalSupplier: Yup.number(),

  // Xử lý
  totalProcessed: Yup.number(),

  // Đã gửi
  send: Yup.number(),

  // Chưa gửi
  unSend: Yup.number(),

  // Link tải kết quả
  downloadId: Yup.number(),
});
