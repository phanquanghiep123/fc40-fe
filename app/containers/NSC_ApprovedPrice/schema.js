import * as Yup from 'yup';

export default Yup.object().shape({
  // Đơn vị
  plantCode: Yup.string().required(`Trường không được bỏ trống`),

  // Tên File
  nameFile: Yup.string()
    .required('Bạn chưa chọn tài liệu tải lên')
    .default('')
    .test(
      'is-validate',
      'Không đúng định dạng, chỉ cho phép *.xlsx, *.xls, *.csv',
      value => {
        const parts = value.split('.');
        if (
          parts &&
          parts[parts.length - 1] &&
          ['xls', 'xlsx', 'csv'].includes(parts[parts.length - 1])
        ) {
          return true;
        }
        return false;
      },
    ),

  // File giá đã phê duyệt
  uploadingFile: Yup.object().nullable(),
});
