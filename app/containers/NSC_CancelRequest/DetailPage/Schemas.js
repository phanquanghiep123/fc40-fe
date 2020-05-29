/* eslint-disable indent */
import * as Yup from 'yup';
import {
  ASSET_TABLE,
  // BASKET_INFO_TABLE,
  BASKET_INUSE_TABLE,
  PRODUCT_TABLE,
  SELECT_BASKET_TABLE,
  SELECT_BASKET_TABLE_PINNED,
  MAX_INT,
} from './constants';
import { basketsInfoFields, basketsInUseFields } from './tableFields';
import { formatToCurrency } from '../../../utils/numberUtils';

/**
 * Schema for a row/product table
 * @param pageType
 * @returns
 */
export const makeProductsRowSchema = pageType =>
  Yup.object().shape({
    stt: Yup.string(),
    productName: Yup.string(),
    batch: Yup.string(),
    sloc: Yup.string(),
    estValue: Yup.string(),

    ...(pageType.create
      ? {
          productCode: Yup.string()
            .nullable()
            .default(undefined),
          quantity: Yup.number()
            .nullable()
            .when('productCode', {
              is: val => !!val,
              then: Yup.number()
                .typeError('Nhập số')
                .required('Trường bắt buộc'),
            }),
        }
      : {}),

    ...(pageType.create || pageType.edit
      ? {
          unitPrice: Yup.number()
            .nullable()
            .when('productCode', {
              is: val => !!val,
              then: Yup.number()
                .typeError('Nhập số')
                .required('Trường bắt buộc'),
            }),
          cause: Yup.string()
            .nullable()
            .when('productCode', {
              is: val => !!val,
              then: Yup.string().required('Trường bắt buộc'),
            }),
          productStatus: Yup.string()
            .nullable()
            .when('productCode', {
              is: val => !!val,
              then: Yup.string().required('Trường bắt buộc'),
            }),
          priorAction: Yup.string()
            .nullable()
            .when('productCode', {
              is: val => !!val,
              then: Yup.string().required('Trường bắt buộc'),
            }),
          images: Yup.array().when('productCode', {
            is: val => !!val,
            then: Yup.array().of(Yup.object()),
          }),
          notes: Yup.string(),
        }
      : {}),
  });

/**
 * Schema for assets table
 * @param pageType
 * @param isDraftSelected
 * @returns {Object}
 */
export const makeAssetsRowSchema = (pageType, isDraftSelected) =>
  Yup.object().shape({
    stt: Yup.string(),

    ...(pageType.create || pageType.edit
      ? {
          assetCode: Yup.string()
            .nullable()
            .default(undefined),
          cancelQuantity: Yup.number().when('assetCode', {
            is: val => !!val,
            then: isDraftSelected
              ? Yup.number()
                  .nullable()
                  .typeError('Phải là số nguyên lớn hơn hoặc bằng 0')
                  // .integer('Phải là số nguyên lớn hơn hoặc bằng 0')
                  .test(
                    'Check Integer',
                    'Phải là số nguyên lớn hơn hoặc bằng 0',
                    val => !val || val % 1 === 0,
                  )
                  .min(0, 'Phải là số nguyên lớn hơn hoặc bằng 0')
                  .max(MAX_INT, `Không vượt quá ${formatToCurrency(MAX_INT)}`)
              : Yup.number()
                  .nullable()
                  .typeError('Phải là số nguyên lớn hơn hoặc bằng 0')
                  // .integer('Phải là số nguyên lớn hơn hoặc bằng 0')
                  .test(
                    'Check Integer',
                    'Phải là số nguyên lớn hơn hoặc bằng 0',
                    val => !val || val % 1 === 0,
                  )
                  .min(0, 'Phải là số nguyên lớn hơn hoặc bằng 0')
                  .max(MAX_INT, `Không vượt quá ${formatToCurrency(MAX_INT)}`)
                  .required('Trường bắt buộc'),
          }),
          cause: Yup.string().when('assetCode', {
            is: val => !!val,
            then: isDraftSelected
              ? Yup.string()
              : Yup.string().required('Trường bắt buộc'),
          }),
          // assetStatus: Yup.string().when('assetCode', {
          //   is: val => !!val,
          //   then: isDraftSelected
          //     ? Yup.string()
          //     : Yup.string().required('Trường bắt buộc'),
          // }),
          note: Yup.string().nullable(),
        }
      : {}),
  });

/**
 * Validation Schema for Baskets In Use Table
 * @param pageType
 * @param isAutoReceipt
 * @param isDraftSelected
 * @returns {Object}
 */
export const makeBasketsInUseRowSchema = (
  pageType,
  isAutoReceipt,
  isDraftSelected,
) => {
  const t = basketsInUseFields;
  return Yup.object().shape({
    stt: Yup.string(),

    ...(pageType.create || pageType.edit
      ? {
          [t.basketLocatorCode]: Yup.string()
            .nullable()
            .default(undefined),
          [t.palletBasketCode]: Yup.string().when(t.basketLocatorCode, {
            is: val => !!val,
            then: Yup.string()
              .nullable()
              .required('Bắt buộc nhập khi đã nhập kho nguồn'),
            otherwise: Yup.string().nullable(),
          }),
          [t.cancelQuantity]: Yup.number().when(
            [t.basketLocatorCode, t.palletBasketCode],
            {
              is: (a, b) => !!a && !!b,
              then: isDraftSelected
                ? Yup.number()
                    .nullable()
                    .typeError('Phải là số nguyên lớn hơn hoặc bằng 0')
                    // .integer('Phải là số nguyên lớn hơn hoặc bằng 0')
                    .test(
                      'Check Integer',
                      'Phải là số nguyên lớn hơn hoặc bằng 0',
                      val => !val || val % 1 === 0,
                    )
                    .min(0, 'Phải là số nguyên lớn hơn hoặc bằng 0')
                    .max(MAX_INT, `Không vượt quá ${formatToCurrency(MAX_INT)}`)
                : Yup.number()
                    .nullable()
                    .typeError('Phải là số nguyên lớn hơn hoặc bằng 0')
                    // .integer('Phải là số nguyên lớn hơn hoặc bằng 0')
                    .test(
                      'Check Integer',
                      'Phải là số nguyên lớn hơn hoặc bằng 0',
                      val => !val || val % 1 === 0,
                    )
                    .min(0, 'Phải là số nguyên lớn hơn hoặc bằng 0')
                    .max(MAX_INT, `Không vượt quá ${formatToCurrency(MAX_INT)}`)
                    .required('Trường bắt buộc'),
            },
          ),
          ...(isAutoReceipt
            ? {
                [t.maxCancelQuantityDiff]: Yup.number()
                  .nullable()
                  .min(0, 'Chênh lệch phải lớn hơn hoặc bằng 0'),
              }
            : {
                [t.inStockQuantityDiff]: Yup.number()
                  .nullable()
                  .min(0, 'Chênh lệch phải lớn hơn hoặc bằng 0'),
              }),

          images: Yup.array().when([t.basketLocatorCode, t.palletBasketCode], {
            is: (a, b) => !!a && !!b,
            then: Yup.array().nullable(),
          }),
          note: Yup.string().nullable(),
          cause: Yup.string().when(t.basketLocatorCode, {
            is: val => !!val,
            then: isDraftSelected
              ? Yup.string()
              : Yup.string().required('Trường bắt buộc'),
          }),
          assetStatus: Yup.string().when(t.basketLocatorCode, {
            is: val => !!val,
            then: isDraftSelected
              ? Yup.string()
              : Yup.string().required('Trường bắt buộc'),
          }),
        }
      : {}),
  });
};

/**
 * Validation Schema for Baskets Info Table
 */
export const basketsInfoTableRowSchema = isDraftSelected =>
  Yup.object().shape({
    [basketsInfoFields.inUseInStockDiff]: isDraftSelected
      ? Yup.number().nullable()
      : Yup.number()
          .nullable()
          .oneOf([0, '0'], 'Giá trị chênh lệch phải bằng 0'),
  });

/**
 * General Schema for Formik, this includes all other partial schemas
 * @param pageType
 * @param isBasket
 * @param isAutoReceipt
 * @param {boolean} isDraftSelected - check trạng thái đang chọn có phải là trạng thái nháp không
 */
// eslint-disable-next-line no-unused-vars
export const makeGeneralSchema = (
  pageType,
  isBasket,
  isAutoReceipt,
  isDraftSelected,
) =>
  Yup.object().shape({
    status: Yup.mixed(),
    ...(pageType.create
      ? {
          // org: Yup.object(),
          accumulatedValue: Yup.string(),
          estValue: Yup.string(),
          reason: Yup.string(),
          requester: Yup.object()
            .nullable()
            .required('Trường bắt buộc'),
          approver1: isDraftSelected
            ? Yup.object().nullable()
            : Yup.object()
                .nullable()
                .required('Trường bắt buộc'),
          approver2: Yup.object()
            .nullable()
            .when('approver3', {
              is: val => !!val,
              then: Yup.object()
                .nullable()
                .required(
                  'Phải có người phê duyệt cấp 2 khi có người phê duyệt cấp 3',
                ),
            }),
        }
      : {}),
    ...(pageType.edit
      ? {
          reason: Yup.string(),
          requester: Yup.object()
            .nullable()
            .required('Trường bắt buộc'),
          approver1: isDraftSelected
            ? Yup.object().nullable()
            : Yup.object()
                .nullable()
                .required('Trường bắt buộc'),
          approver2: Yup.object().nullable(),
        }
      : {}),
    ...(pageType.approve
      ? {
          approve: Yup.string().required('Trường bắt buộc'),
          approverNote: Yup.string(),
        }
      : {}),
    ...(pageType.reApprove ? { status: Yup.string() } : {}),

    approver3: Yup.object().nullable(),

    // Section 2 table
    [PRODUCT_TABLE]: Yup.array()
      .transform(values => {
        // change undefined row => empty row
        const results = [];
        Array(values.length)
          .fill(null)
          .forEach((_, index) => {
            results[index] =
              values[index] || makeProductsRowSchema(pageType).cast({});
          });

        return results;
      })
      .of(makeProductsRowSchema(pageType))
      .default([]),

    // [BASKET_INFO_TABLE]: Yup.array().of(
    //   basketsInfoTableRowSchema(isDraftSelected),
    // ),
    [ASSET_TABLE]: Yup.array()
      .transform(values => {
        // change undefined row => empty row
        const results = [];
        Array(values.length)
          .fill(null)
          .forEach((_, index) => {
            results[index] =
              values[index] || makeAssetsRowSchema(pageType).cast({});
          });

        return results;
      })
      .of(makeAssetsRowSchema(pageType, isDraftSelected))
      .default([]),

    [BASKET_INUSE_TABLE]: Yup.array()
      .transform(values => {
        // change undefined row => empty row
        const results = [];
        Array(values.length)
          .fill(null)
          .forEach((_, index) => {
            results[index] =
              values[index] ||
              makeBasketsInUseRowSchema(
                pageType,
                isAutoReceipt,
                isDraftSelected,
              ).cast({});
          });

        return results;
      })
      .of(makeBasketsInUseRowSchema(pageType, isAutoReceipt, isDraftSelected)),
  });

/**
 * Scheme for popup select baskets
 */
export const popupSelectBasketsFormikSchema = Yup.object().shape({
  isSubmit: Yup.bool(), // true => submit; false => search
  keepPopupOpened: Yup.bool(),
  preventSubmit: Yup.bool(),

  palletBasket: Yup.object()
    .nullable()
    .required('Trường bắt buộc'),
  inStock: Yup.number(),
  cancelQuantity: Yup.number()
    .typeError('Phải là số nguyên dương')
    // .integer('Phải là số nguyên dương')
    .test(
      'Check Integer',
      'Phải là số nguyên dương',
      val => !val || val % 1 === 0,
    )
    .positive('Phải là số nguyên dương')
    .max(Yup.ref('inStock'), 'Phải bé hơn hoặc bằng SL tồn')
    .max(MAX_INT, `Không vượt quá ${formatToCurrency(MAX_INT)}`)
    .required('Trường bắt buộc'),
  cause: Yup.object()
    .nullable()
    .when('isSubmit', {
      is: val => !!val,
      then: Yup.object().required('Trường bắt buộc'),
    }),

  /**
   * Select Basket Table
   */
  [SELECT_BASKET_TABLE]: Yup.array().when('isSubmit', {
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
          // .integer('Phải là số nguyên lớn hơn hoặc bằng 0')
          .test(
            'Check Integer',
            'Phải là số nguyên lớn hơn hoặc bằng 0',
            val => !val || val % 1 === 0,
          )
          .min(0, 'Phải là số nguyên lớn hơn hoặc bằng 0')
          .max(Yup.ref('ownQuantity'), 'Phải bé hơn hoặc bằng SL sở hữu')
          .max(MAX_INT, `Không vượt quá ${formatToCurrency(MAX_INT)}`),
        // difference: Yup.number()
        //   .nullable()
        //   .typeError('Phải là số nguyên lớn hơn hoặc bằng 0')
        //   // .integer('Phải là số nguyên lớn hơn hoặc bằng 0')
        //   .test(
        //     'Check Integer',
        //     'Phải là số nguyên lớn hơn hoặc bằng 0',
        //     val => !val || val % 1 === 0,
        //   )
        //   .min(0, 'Phải là số nguyên lớn hơn hoặc bằng 0'),
      }),
    ),
  }),

  [SELECT_BASKET_TABLE_PINNED]: Yup.array().when('isSubmit', {
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
          .positive('Phải là số nguyên lớn hơn 0')
          .max(
            Yup.ref('expectedCancelQuantity'),
            'Phải bé hơn hoặc bằng SL thanh lý/huỷ',
          ),
      }),
    ),
  }),
});
