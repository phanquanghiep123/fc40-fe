import * as Yup from 'yup';

export default Yup.object().shape({
  // Tên tập tin
  name: Yup.string()
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

  // Thông tin tập tin
  uploadingFile: Yup.object().nullable(),
});
