import * as Yup from 'yup';

/**
 * Phiếu
 */
export const ReceiptSchema = Yup.object().shape({});

/**
 * Sản phẩm
 */
export const ProductSchema = Yup.object().shape({
  // Phân loại xử lý
  processingType: Yup.number(),

  // Tên Phân loại xử lý
  processingTypeName: Yup.string(),
});

/**
 * Sản phẩm cân
 */
export const WeightProductSchema = Yup.object()
  .shape({})
  .concat(ProductSchema);

/**
 * Tham số tìm kiếm
 */
export const SearchParamsSchema = Yup.object().shape({
  // Mã đơn vị xuất hàng
  deliverCode: Yup.object()
    .nullable()
    .default(''),

  // Id PXK
  documentId: Yup.string()
    .nullable()
    .default(''),

  // Id chi tiết sản phẩm của phiếu
  documentDetailId: Yup.string()
    .nullable()
    .default(''),
});
