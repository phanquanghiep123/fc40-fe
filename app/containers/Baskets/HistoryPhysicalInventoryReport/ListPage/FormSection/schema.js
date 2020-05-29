import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  date: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
});
