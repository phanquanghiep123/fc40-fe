import * as Yup from 'yup';
export const validSchema = Yup.object().shape({
  fileName: Yup.string()
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
});
export const initialSchema = {
  UploadingFile: '',
  RequestId: '',
  fileName: '',
};
