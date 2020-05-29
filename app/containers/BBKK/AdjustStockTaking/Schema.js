import * as Yup from 'yup';
import { MAX_INT } from './constants';
import { formatToCurrency } from '../../../utils/numberUtils';
export const adjustSchema = Yup.object().shape({
  adjustmentUserId: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  adjustmentDate: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),
  cancelBaskets: Yup.array()
    .of(
      Yup.object().shape({
        reasonName: Yup.string()
          .required('Trường không được bỏ trống')
          .nullable(),
        // state: Yup.string()
        //   .required('Trường không được bỏ trống')
        //   .nullable(),
      }),
    )
    // eslint-disable-next-line consistent-return
    .test('cancelBaskets', '', function(values) {
      const errors = [];
      if (values && values.length > 0) {
        for (let i = 0, len = values.length; i < len; i += 1) {
          if (values[i].isAdjusted) {
            if (!values[i].state) {
              errors.push(
                this.createError({
                  path: `${this.path}[${i}].state`,
                  message: 'Trường Không Được Bỏ Trống',
                }),
              );
            }
          }
          if (values[i].note && values[i].note.length > 500) {
            errors.push(
              this.createError({
                path: `${this.path}[${i}].note`,
                message: 'Ghi Chú không được vượt quá 500 kí tự',
              }),
            );
          }
          if (values[i].state && values[i].state.length > 500) {
            errors.push(
              this.createError({
                path: `${this.path}[${i}].state`,
                message:
                  'Tình Trạng Trước Khi Hủy không được vượt quá 500 kí tự',
              }),
            );
          }
        }
      }
      if (errors.length > 0) {
        return new Yup.ValidationError(errors);
      }
    }),

  waitingCancelBaskets: Yup.array()
    .of(Yup.object().shape({}))
    // eslint-disable-next-line consistent-return
    .test('waitingCancelBaskets', '', function(values) {
      const errors = [];
      if (values && values.length > 0) {
        for (let i = 0, len = values.length; i < len; i += 1) {
          if (values[i].note && values[i].note.length > 500) {
            errors.push(
              this.createError({
                path: `${this.path}[${i}].note`,
                message: 'Ghi Chú không được vượt quá 500 kí tự',
              }),
            );
          }
        }
      }
      if (errors.length > 0) {
        return new Yup.ValidationError(errors);
      }
    }),

  assetCancels: Yup.array()
    .of(Yup.object().shape({}))
    // eslint-disable-next-line consistent-return
    .test('assetCancels', '', function(values) {
      const errors = [];
      if (values && values.length > 0) {
        for (let i = 0, len = values.length; i < len; i += 1) {
          if (values[i].note && values[i].note.length > 500) {
            errors.push(
              this.createError({
                path: `${this.path}[${i}].note`,
                message: 'Ghi Chú không được vượt quá 500 kí tự',
              }),
            );
          }
        }
      }
      if (errors.length > 0) {
        return new Yup.ValidationError(errors);
      }
    }),

  newBaskets: Yup.array()
    .of(Yup.object().shape({}))
    // eslint-disable-next-line consistent-return
    .test('newBaskets', '', function(values) {
      const errors = [];
      if (values && values.length > 0) {
        for (let i = 0, len = values.length; i < len; i += 1) {
          if (values[i].note && values[i].note.length > 500) {
            errors.push(
              this.createError({
                path: `${this.path}[${i}].note`,
                message: 'Ghi Chú không được vượt quá 500 kí tự',
              }),
            );
          }
          if (values[i].reason && values[i].reason.length > 500) {
            errors.push(
              this.createError({
                path: `${this.path}[${i}].reason`,
                message: 'Ghi Chú không được vượt quá 500 kí tự',
              }),
            );
          }
        }
      }
      if (errors.length > 0) {
        return new Yup.ValidationError(errors);
      }
    }),
});
export const popupSelectBasketsFormikSchema = Yup.object().shape({
  assetInfo: Yup.array().when('isSubmit', {
    is: val => !!val,
    then: Yup.array().of(
      Yup.object().shape({
        stt: Yup.string(),
        assetCode: Yup.string()
          .nullable()
          .default(undefined),
        ownQuantity: Yup.number(),
        cancelQuantity: Yup.number()
          .nullable()
          .typeError('Phải là số nguyên lớn hơn hoặc bằng 0')
          .test(
            'Check Integer',
            'Phải là số nguyên lớn hơn hoặc bằng 0',
            val => !val || val % 1 === 0,
          )
          .min(0, 'Phải là số nguyên lớn hơn hoặc bằng 0')
          .max(Yup.ref('ownQuantity'), 'Phải bé hơn hoặc bằng SL sở hữu')
          .max(MAX_INT, `Không vượt quá ${formatToCurrency(MAX_INT)}`),
      }),
    ),
  }),

  selectBaskets_pinned: Yup.array().when('isSubmit', {
    is: val => !!val,
    then: Yup.array().of(
      Yup.object().shape({
        expectedCancelQuantity: Yup.number().nullable(),
        cancelQuantity: Yup.number()
          .nullable()
          .typeError('Phải là số nguyên lớn hơn 0')
          // .integer('Phải là số nguyên lớn hơn 0')
          .test(
            'Check Integer',
            'Phải là số nguyên lớn hơn 0',
            val => !val || val % 1 === 0,
          )
          .positive('Phải là số nguyên lớn hơn 0'),
        // .max(
        //   Yup.ref('expectedCancelQuantity'),
        //   'Phải bé hơn hoặc bằng SL thanh lý/huỷ',
        // ),
      }),
    ),
  }),
});
