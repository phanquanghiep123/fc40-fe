import * as Yup from 'yup';

import {
  TurnScalesSchema,
  BasketPalletSchema,
} from 'components/GoodsWeight/Schema';

export const ProductSchema = Yup.object().shape({
  // Mã sản phẩm
  productCode: Yup.string()
    .nullable()
    .default(''),

  // Tên sản phẩm
  productName: Yup.string()
    .nullable()
    .default(''),

  // Số lô, batch
  slotCode: Yup.string()
    .nullable()
    .default(''),

  // Tên Phân loại xử lý
  processingTypeName: Yup.string()
    .nullable()
    .default(''),

  // [Xuất điều chuyển]
  // Tên kho nguồn
  locatorName: Yup.string()
    .nullable()
    .default(''),

  // [Xuất chuyển nội bộ]
  // Tên kho nguồn
  locatorNameFrom: Yup.string()
    .nullable()
    .default(''),

  // Tên kho đích
  locatorNameTo: Yup.string()
    .nullable()
    .default(''),

  // Số lượng tồn
  inventoryQuantity: Yup.number()
    .nullable()
    .default(null),

  // Số lượng thực
  exportedQuantity: Yup.number()
    .nullable()
    .default(null),

  // Trạng thái cân của sản phẩm
  status: Yup.number()
    .nullable()
    .default(null),
});

export default Yup.object()
  .shape({
    // Id phiếu xuất kho
    documentId: Yup.number()
      .nullable()
      .default(null),

    // Mã phiếu xuất kho
    documentCode: Yup.string()
      .nullable()
      .default(''),

    // Loại xuất kho
    subType: Yup.number()
      .nullable()
      .default(null),

    // Tên Loại xuất kho
    subTypeName: Yup.string()
      .nullable()
      .default(''),

    // Tên đơn vị nhận hàng
    receiverName: Yup.string()
      .nullable()
      .default(''),

    // Id chi tiết phiếu, sản phẩm
    documentDetailId: Yup.number()
      .nullable()
      .default(null),

    // Đơn vị của sản phẩm
    baseUoM: Yup.string().nullable(),

    // Thông tin khay sọt
    basketPallet: BasketPalletSchema,

    // Danh sách các lần cân
    turnToScales: TurnScalesSchema,
  })
  .concat(ProductSchema);
