import { addDays } from 'date-fns';
import * as Yup from 'yup';

export const initialSchema = {
  date: addDays(new Date(), 1),
  plantCode: '',
  planningCode: null,
  planningName: '',
  productionOrderCode: null,
  pageSize: 5,
  totalItem: 0,
  pageIndex: 0,
};

export const validationSchema = Yup.object().shape({
  date: Yup.date()
    .required('Trường không được bỏ trống')
    .nullable(),
});
