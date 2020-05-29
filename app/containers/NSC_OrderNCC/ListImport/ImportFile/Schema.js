import * as Yup from 'yup';

import { TYPE_ORDER } from '../constants';

export default Yup.object().shape({
  // Vùng sản xuất
  productionRegion: Yup.string(),

  // Loại đặt hàng
  fileType: Yup.number().default(TYPE_ORDER.BY_WEEK),

  // Tên File
  nameFile: Yup.string()
    .required('Bạn chưa chọn tài liệu tải lên')
    .default('')
    .test(
      'is-validate',
      'Không đúng định dạng, chỉ cho phép *.xlsx, *.xls',
      value => {
        const parts = value.split('.');
        if (
          parts &&
          parts[parts.length - 1] &&
          ['xls', 'xlsx'].includes(parts[parts.length - 1])
        ) {
          return true;
        }
        return false;
      },
    ),

  // File đặt hàng
  uploadingFile: Yup.object().nullable(),
});
