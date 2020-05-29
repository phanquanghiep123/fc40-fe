import * as Yup from 'yup';

export default Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Mật khẩu phải lớn hơn 6 kí tự')
    .required('Mật khẩu không được bỏ trống'),
  retypePassword: Yup.string()
    .min(6, 'Mật khẩu phải lớn hơn 6 kí tự')
    .when('newPassword', (newPassword, schema) =>
      schema.test(
        'retype',
        'Mật khẩu không khớp',
        value =>
          // debugger;
          value === newPassword,
      ),
    )
    .required('Mật khẩu không được bỏ trống'),
});
