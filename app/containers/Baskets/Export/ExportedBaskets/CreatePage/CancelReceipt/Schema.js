import * as Yup from 'yup';
import { generalSectionFields } from './constants';

export const makeCancelReceiptSchema = () => {
  const f = generalSectionFields;

  return Yup.object().shape({
    [f.cancelRequest]: Yup.object()
      .nullable()
      .required('Trường bắt buộc'),
    [f.deliver]: Yup.object()
      .nullable()
      .required('Trường bắt buộc'),
    [f.user]: Yup.object()
      .nullable()
      .required('Trường bắt buộc'),
  });
};
