import { string, number, object, array, date } from 'yup';

import {
  REQUIRED_FIELD,
  MUST_BE_POSITIVE_NUMBER,
  MUST_HAVE_10_CHAR,
  // NOT_EXISTED_REGION,
} from './messages';

const nullableString = string()
  .nullable()
  .default('');
// const regionNameSchema = string()
//   .when('regionCode', {
//     is: code => typeof code === 'string' && code.length > 0,
//     then: string().min(0, NOT_EXISTED_REGION),
//     otherwise: string().nullable(),
//   })
//   .typeError(NOT_EXISTED_REGION)
//   .default('');
const tenCharString = string()
  .matches(/^[A-Za-z0-9]{10,10}$/, {
    message: MUST_HAVE_10_CHAR,
    excludeEmptyString: true,
  })
  .nullable();

const nullableNumber = number().nullable();
const largerThanZeroNumber = number()
  .required(REQUIRED_FIELD)
  .moreThan(0, MUST_BE_POSITIVE_NUMBER)
  .typeError(REQUIRED_FIELD);

const requiredDate = date().required(REQUIRED_FIELD);
// const requiredString = string().required(REQUIRED_FIELD);
const requiredStringWithDefault = string()
  .required(REQUIRED_FIELD)
  .typeError(REQUIRED_FIELD)
  .default('');

export const ProductSchema = object().shape({
  productCode: requiredStringWithDefault,
  productName: nullableString,

  regionCode: nullableString,
  regionName: nullableString,

  slotCode: tenCharString,
  uom: nullableString,
  note: nullableString,

  unitPrice: largerThanZeroNumber,
  exportedQuantity: largerThanZeroNumber,
});

export const productCast = ProductSchema.cast();

export const RequestIssueSchema = object().shape({
  status: nullableNumber,
  level: nullableNumber,

  businessObject: nullableNumber,
  date: requiredDate,
  retailRequestCreateDate: requiredDate,
  deliverCode: requiredStringWithDefault,

  customerCode: requiredStringWithDefault,
  customerName: requiredStringWithDefault,

  retailCustomerId: nullableNumber,
  retailCustomerPhoneNumber: nullableString,
  retailCustomerName: nullableString,
  retailCustomerAddress: nullableString,

  userId: requiredStringWithDefault,
  // userName: requiredStringWithDefault,

  approverLevel1: requiredStringWithDefault,
  approverLevelName1: requiredStringWithDefault,
  approverLevel2: nullableString,
  note: nullableString,

  paymentType: nullableNumber,

  detailsCommands: array(ProductSchema)
    .default([ProductSchema.cast({})])
    .nullable(),
});
