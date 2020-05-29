import * as Yup from 'yup';
import { startOfDay } from 'date-fns';

export const validSchema = Yup.object().shape({
  supplierType: Yup.string()
    .transform(value => (value === '0' ? undefined : value))
    .required(`Trường không được bỏ trống`),
  regionCode: Yup.string()
    .transform(value => (value === '0' ? undefined : value))
    .required(`Trường không được bỏ trống`),
  name1: Yup.string()
    .required('Trường không được bỏ trống')
    .max(40, 'Trường không được nhiều hơn 40 kí tự'),
  name2: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  name3: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  name4: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  vatRegistrationNo: Yup.string()
    .max(20, 'Trường không được nhiều hơn 20 kí tự')
    .required('Trường không được bỏ trống'),
  taxNumber4: Yup.string()
    .max(18, 'Trường không được nhiều hơn 18 kí tự')
    .required('Trường không được bỏ trống'),
  email: Yup.string()
    .nullable()
    .default(null)
    .email('Trường email không đúng định dạng!')
    .max(241, 'Trường không được nhiều hơn 241 kí tự'),
  contractCode: Yup.number()
    .required('Trường không được bỏ trống')
    .required(`Trường không được bỏ trống`)
    .test(
      'len',
      'Trường không được nhiều hơn 9 kí tự',
      val => val && val.toString().length <= 9,
    ),
  contractType: Yup.number()
    .required(`Trường không được bỏ trống`)
    .required(`Trường không được bỏ trống`)
    .test(
      'len',
      'Trường không được nhiều hơn 9 kí tự',
      val => val && val.toString().length <= 9,
    ),
  stockServiceType: Yup.number()
    .required(`Trường không được bỏ trống`)
    .test(
      'len',
      'Trường không được nhiều hơn 2 kí tự',
      val => val && val.toString().length <= 2,
    ),
  blockFunction: Yup.string().max(2, 'Trường cho phép nhập tối đa 2 ký tự'),
  phone: Yup.string().max(30, 'Trường không được nhiều hơn 30 kí tự'),
  street: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  street4: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  street5: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  district: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  city: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  country: Yup.string().max(40, 'Trường không được nhiều hơn 40 kí tự'),
  provinceCode: Yup.string().max(3, 'Trường không được nhiều hơn 3 kí tự'),
  representativeName: Yup.string().max(
    40,
    'Trường không được nhiều hơn 40 kí tự',
  ),
  contractSigningDate: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
  contractEffectiveDate: Yup.date()
    .required('Trường không được bỏ trống')
    .when('contractSigningDate', (newDate, newSchema) => {
      if (newDate) {
        return newSchema.test(
          'contractSigningDate',
          'Ngày có hiệu lực không thể nhỏ hơn ngày ký hợp đồng',
          value => startOfDay(value).getTime() >= startOfDay(newDate).getTime(),
        );
      }
      return newSchema;
    })
    .nullable(),
});
const initTodayAtMidnight = new Date();
export const initialSchema = {
  id: 0,
  supplierCode: 1, // Mã NCC
  supplierName: 1, // Tên NCC
  supplierType: '', // Loại NCC
  taxNumber4: '', // Mã số thuế
  vatRegistrationNo: '', // Mã số VAT
  name1: '', // Tên NCC 1
  name2: '', // Tên NCC 2
  name3: '', // Tên NCC 3
  name4: '', // Tên NCC 4
  street: '', // Tên đường
  street4: '', // Tên đường 4
  street5: '', // Tên đường 5
  email: '', // Email
  phone: '', // Điện thoại
  district: '', // Huyện
  provinceCode: '', // Mã tỉnh
  regionCode: '', // Mã vùng
  city: '', // Quốc gia
  country: '', // Quốc gia
  contractCode: '', // Mã hơp đồng
  contractType: '', // Loại hợp đồng
  representativeName: '', // Người đại diện
  legalEntityName: '', // Tên pháp nhân
  contractSigningDate: initTodayAtMidnight, // Ngày ký hợp đồng
  contractEffectiveDate: initTodayAtMidnight, // Ngày có hiệu lực
  stockServiceType: '', // Loại dịch vụ
  termsOfPayment: '', // Điều khoản thanh toán
  postingBlock: '', // Posting Block
  purchBlock: '', // Purch Block
  blockFunction: '', // Block Function
  notes: '', // Mô tả
  createFromSource: '', // Mô tả
};
