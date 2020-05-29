import * as Yup from 'yup';
export const schema = Yup.object().shape({
  warningType: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  purposeStorage: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  note: Yup.string()
    .max(50, 'Ghi chú không được nhiều hơn 50 kí tự')
    .nullable(),
});
