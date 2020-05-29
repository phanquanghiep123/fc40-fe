import * as Yup from 'yup';

/**
 * Validation Schema form Update Quantity Form
 * @type {ObjectSchema<Shape<object, object>>}
 */
export const updateQuantitySchema = Yup.object().shape({
  quantity: Yup.number()
    .min(0, 'Phải là số dương')
    .typeError('Phải là số dương')
    .required('Trường bắt buộc'),
});
