import * as Yup from 'yup';

export const userSchema = Yup.object().shape({
  userName: Yup.string().required('Trường không được bỏ trống'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Trường không được bỏ trống'),
  lastName: Yup.string().required('Trường không được bỏ trống'),
  firstName: Yup.string().required('Trường không được bỏ trống'),
});

export const userInitialSchema = {
  userId: null,
  userName: '',
  email: '',
  lastName: '',
  firstName: '',
  phoneNumber: '',
  isLdap: false,
  isActive: true,
  locked: false,
  dateExpried: null,
};
