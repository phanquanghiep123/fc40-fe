import * as Yup from 'yup';

export const validSchema = Yup.object().shape({
  palletBasketCode: Yup.string().required(`Trường không được bỏ trống`),
  shortName: Yup.string().required(`Trường không được bỏ trống`),
  fullName: Yup.string().required(`Trường không được bỏ trống`),
  uoM: Yup.string()
    .required(`Trường không được bỏ trống`)
    .nullable(),
  netWeight: Yup.string().required(`Trường không được bỏ trống`),
  weightUnit: Yup.string()
    .required(`Trường không được bỏ trống`)
    .nullable(),
  size: Yup.string().required(`Trường không được bỏ trống`),
  width: Yup.string().required(`Trường không được bỏ trống`),
  height: Yup.string().required(`Trường không được bỏ trống`),
  length: Yup.string().required(`Trường không được bỏ trống`),
});
