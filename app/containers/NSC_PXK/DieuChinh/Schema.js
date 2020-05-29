import * as Yup from 'yup';
import { startOfDay } from 'date-fns';

import { PAGE_SIZE } from 'utils/constants';
import { formatToNumber } from 'utils/numberUtils';

export const SearchSchema = Yup.object().shape({
  // Đơn vị
  plantCode: Yup.string().default(''),

  // Tên Đơn vị
  plantName: Yup.string(),

  // Kho nguồn
  locatorCode: Yup.string().default(''),

  // Tên Kho nguồn
  locatorName: Yup.string().default(''),

  // Ngày chia chọn
  processDate: Yup.date().default(startOfDay(new Date())),

  // Tỷ lệ chênh lệch (Từ)
  differentFrom: Yup.number()
    .transform(v => formatToNumber(v))
    .default(''),

  // Tỷ lệ chênh lệch (Đến)
  differentTo: Yup.number()
    .transform(v => formatToNumber(v))
    .default(''),

  // Mã sản phẩm
  productCode: Yup.string().default(''),

  // Tên sản phẩm
  productName: Yup.string().default(''),

  // Farm/NCC
  farmSupplierCode: Yup.string().default(''),

  // Tên Farm/NCC
  farmSupplierName: Yup.string().default(''),
});

export const PaginationSchema = Yup.object().shape({
  // Số lượng record trên trang
  pageSize: Yup.number().default(PAGE_SIZE),

  // Trang hiện tại
  pageIndex: Yup.number().default(0),

  // Tổng số lượng record
  totalCount: Yup.number().default(0),
});

export const FormSearchSchema = Yup.object()
  .concat(SearchSchema)
  .concat(PaginationSchema);

export const DuLieuDieuChinhSchema = Yup.object().shape({
  // Mã kế hoạch
  planningCode: Yup.string(),

  // Mã bán hàng
  productCode: Yup.string(),

  // Tên sản phẩm
  productName: Yup.string(),

  // Mã Farm/NCC
  receiverCode: Yup.string(),

  // Tên Farm/NCC
  receiverName: Yup.string(),

  // Đơn vị tính
  uom: Yup.string(),

  // SL chia thực tế
  deliveryQuantity: Yup.number(),

  // SL chia chọn
  pickingQuantity: Yup.number(),

  // SL chêch lệch
  differentQuantity: Yup.number(),

  // Tỷ lệ chênh lệch
  differentRatio: Yup.number(),

  // Tỷ lệ chêch lệch (%)
  differentRatioString: Yup.string(),

  // Cho phép điều chỉnh
  isModify: Yup.boolean(),
});
