import * as Yup from 'yup';

export default Yup.object().shape({
  username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải lớn hơn 6 kí tự')
    .required('Mật khẩu không được bỏ trống'),
});
