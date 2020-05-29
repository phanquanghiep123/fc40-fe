/* eslint-disable func-names */
import * as Yup from 'yup';

import { formatToNumber } from 'utils/numberUtils';

import { TYPE_BASE_UNIT } from './constants';

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

// Sản phẩm
export const ProductSchema = Yup.object().shape({
  // Mã sản phẩm
  productCode: Yup.string()
    .nullable()
    .default(''),

  // Phân loại xử lý
  processingType: Yup.number()
    .nullable()
    .default(null),

  // Số lô (batch)
  slotCode: Yup.string()
    .nullable()
    .default(''),

  // Mã thành phẩm
  finshedProductCode: Yup.string()
    .nullable()
    .default(''),

  // Tên thành phẩm
  finshedProductName: Yup.string()
    .nullable()
    .default(''),

  // Id của hàng hóa trong BBGH
  listIds: Yup.string()
    .nullable()
    .default(''),
});

// Khay sọt & Pallet
export const BasketPalletSchema = Yup.object()
  .shape({
    // Số lượng khay sọt
    basketQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .nullable(0),

    // Số lượng pallet
    palletQuantity: Yup.number()
      .transform(v => formatToNumber(v))
      .default(0),
  })
  .concat(BasketSchema)
  .concat(PalletSchema);

// Sản phẩm của Phiếu nhập kho
export const ImportReceiptProductSchema = ProductSchema.concat(
  Yup.object().shape({
    // Id phiếu nhập kho
    documentId: Yup.number()
      .nullable()
      .required(),

    // Loại xử lý nhập kho
    importType: Yup.number()
      .nullable()
      .default(null),

    // Cân hàng của NCC (1) hay cân hàng của Farm/NSC (0)
    isSupplier: Yup.number()
      .nullable()
      .default(null),

    // Khối lượng thực tế
    quantity: Yup.number()
      .nullable()
      .default(null),

    // Khối lượng dự kiến
    planedQuantity: Yup.number()
      .nullable()
      .default(null),

    // Tỉ lệ khấu trừ
    recoveryRate: Yup.number()
      .nullable()
      .default(null),

    // Trạng thái của phiếu cân nhập kho
    documentStatus: Yup.number()
      .nullable()
      .default(null),

    // Trạng thái cân nhập kho của sản phẩm
    documentDetailStatus: Yup.number()
      .nullable()
      .default(null),

    // Số lượng khay sọt của Bên giao
    deliveryPallet: Yup.number()
      .nullable()
      .default(null),

    // Loại sản phẩm
    gradeCode: Yup.string()
      .nullable()
      .default(''),

    materialTypeCode: Yup.string()
      .nullable()
      .default(''),

    // Tổng khối lượng của các chuyển xe (Đối với NCC)
    totalQuantity: Yup.number()
      .nullable()
      .default(null),

    // Đơn vị sản phẩm
    baseUoM: Yup.string()
      .nullable()
      .default(TYPE_BASE_UNIT.KG),

    // Danh sách các lần cân
    turnToScales: Yup.array()
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
      .default([]),
  }),
);

// ===================================================================================
export const SearchParamsSchema = Yup.object().shape({
  // Id phiếu nhập kho
  documentId: Yup.string()
    .nullable()
    .default(''),

  // Mã sản phẩm
  productCode: Yup.string()
    .nullable()
    .default(''),

  // Phân loại xử lý
  processingType: Yup.string()
    .nullable()
    .default(''),

  // Số lô (batch)
  slotCode: Yup.string()
    .nullable()
    .default(''),

  // Mã thành phẩm
  finshedProductCode: Yup.string()
    .nullable()
    .default(''),
});

// Màn hình cân nhập kho
export default ImportReceiptProductSchema.concat(
  Yup.object().shape({
    // Form cân
    basketPallet: BasketPalletSchema,

    // Khối lượng thực tế mặc định
    defaultQuantity: Yup.number()
      .nullable()
      .default(0),

    // Phân loại xử lý mặc định
    defaultProcessingType: Yup.number()
      .nullable()
      .default(null),
  }),
);
