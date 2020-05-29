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

export const ScaleSchema = Yup.object()
  .shape({
    // ID lần cân
    id: Yup.number()
      .nullable()
      .default(null),

    // Số lượng khay sọt
    palleBasketQuantity: Yup.number()
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

export const validSchema = Yup.object().shape({
  locatorId: Yup.string()
    .transform(value => (value === '0' ? undefined : value))
    .required(`Trường không được bỏ trống`),
  productCode: Yup.string()
    .transform(value => (value === '0' ? undefined : value))
    .required(`Trường không được bỏ trống`)
    .nullable(),
  originCode: Yup.string()
    .transform(value => (value === '0' ? undefined : value))
    .nullable()
    .required(`Trường không được bỏ trống`),
  dateCreatedBatch: Yup.date().required(`Trường không được bỏ trống`),
  reasonDifference: Yup.string()
    .required(`Trường không được bỏ trống`)
    .max(50, 'Trường không được nhiều hơn 50 kí tự'),
});

export const initialSchema = {
  id: 0,
  turnToScale: [],
  basketPallet: {},
  plantCode: '',
  warehouse: [],
  organization: '',
  products: {},
  locatorId: '',
  date: new Date(),
  dateCreatedBatch: new Date(),
  baseUoM: 'KG',
  productCode: '',
  productName: '',
  inventoryQuantity: '0',
  stockTakingQuantity: 0,
  originCode: '',
  batch: '',
  rateDifference: '',
  reasonDifference: '',
  weightDifference: 0,
  stockTakingTurnToScaleDetails: [],
  ratePercen: 100,
};
