import * as Yup from 'yup';

import { formatToNumber } from 'utils/numberUtils';

// Khay sọt
export const BasketSchema = Yup.object().shape({
  // Mã khay sọt
  basketCode: Yup.string()
    .nullable()
    .default(undefined),

  // Tên khay sọt
  basketName: Yup.string()
    .nullable()
    .default(''),

  // Trọng lượng khay sọt
  basketWeight: Yup.number().nullable(),
});

// Pallet
export const PalletSchema = Yup.object().shape({
  // Mã pallet
  palletCode: Yup.string()
    .nullable()
    .default(undefined),

  // Tên pallet
  palletName: Yup.string()
    .nullable()
    .default(''),

  // Trọng lượng pallet
  palletWeight: Yup.number().nullable(),
});

// Cân sản phẩm
export const ScaleSchema = Yup.object()
  .shape({
    // ID lần cân
    id: Yup.number()
      .nullable()
      .default(0),

    // Số lượng khay sọt
    basketQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .nullable()
      .default(0),

    // Số lượng pallet
    palletQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .nullable()
      .default(0),

    // Khối lượng cân
    quantity: Yup.number()
      .transform(v => formatToNumber(v))
      .nullable(),

    // Khối lượng thực
    realQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .min(0, 'Giá trị không được âm')
      .nullable(),
  })
  .concat(BasketSchema)
  .concat(PalletSchema);

// Khay sọt & Pallet
export const BasketPalletSchema = Yup.object()
  .shape({
    // Số lượng khay sọt
    basketQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .default(0),

    // Số lượng pallet
    palletQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .default(0),
  })
  .concat(BasketSchema)
  .concat(PalletSchema);

// Danh sách các lần cân
export const TurnScalesSchema = Yup.array()
  .transform(values => {
    const results = [];

    for (let i = 0, len = values.length; i < len; i += 1) {
      const value = values[i];

      if (value !== undefined) {
        results[i] = value;
      } else {
        results[i] = ScaleSchema.cast();
      }
    }

    return results;
  })
  .of(
    ScaleSchema.transform(value => {
      let nextValue = { ...value };

      if (!value.basketQuantity) {
        nextValue = {
          ...nextValue,
          basketQuantity: undefined,
        };
      }

      if (!value.palletCode && !value.palletQuantity) {
        nextValue = {
          ...nextValue,
          palletQuantity: undefined,
        };
      }

      return nextValue;
    }),
  )
  .default([]);
