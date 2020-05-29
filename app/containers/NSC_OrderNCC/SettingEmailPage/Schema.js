import * as Yup from 'yup';

export default Yup.object().shape({
  body: Yup.string()
    .nullable()
    .required('Nội Dung không được bỏ trống.'),
  emails: Yup.number(),
});

export const formDataSchema = {
  regionList: [],
  email: '',
  ccListEmail: [],
  subject: '',
  header: '',
  body: '',
  signature: '',
  isActivate: null,
};
