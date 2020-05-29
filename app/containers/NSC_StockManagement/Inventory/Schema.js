import * as Yup from 'yup';
import { formatToNumber } from 'utils/numberUtils';

export const BasketSchema = Yup.object().shape({
  // Mã khay sọt
  palletBasketCode: Yup.string()
    .nullable()
    .default(undefined),

  // Tên khay sọt
  palletBasketName: Yup.string()
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
      .default(null),

    // Số lượng khay sọt
    basketQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .nullable(),

    // Số lượng pallet
    palletQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .nullable(),

    // Khối lượng cân
    scalesWeight: Yup.number()
      .transform(v => formatToNumber(v))
      .nullable(),

    // Khối lượng thực
    realWeight: Yup.number()
      .transform(v => formatToNumber(v))
      .min(0, 'Giá trị không được âm')
      .nullable(),
  })
  .concat(BasketSchema)
  .concat(PalletSchema);
