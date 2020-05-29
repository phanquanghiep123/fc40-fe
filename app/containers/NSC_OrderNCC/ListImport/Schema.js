import * as Yup from 'yup';

import { PAGE_SIZE } from 'utils/constants';

export const SearchSchema = Yup.object().shape({
  // Từ Ngày đặt hàng
  dateFrom: Yup.date().default(null),

  // Đến Ngày đặt hàng
  dateTo: Yup.date().default(null),

  // Vùng sản xuất
  productionRegion: Yup.string().default(''),

  // Vùng tiêu thụ
  consumeRegion: Yup.string().default(''),

  // Loại đặt hàng
  importType: Yup.number().default(0),

  // Ngày import
  importDate: Yup.date().default(null),

  // Tất cả version
  isAllVersion: Yup.boolean().default(false),
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

export const FileImportSchema = Yup.object().shape({
  // Tên File
  fileName: Yup.string(),

  // Version
  version: Yup.number(),

  // Vùng sản xuất
  productionRegionName: Yup.string(),

  // Vùng tiêu thụ
  consumeRegionName: Yup.string(),

  // Tên Loại đặt hàng
  importType: Yup.string(),

  // Ngày đặt hàng (Từ)
  dateFrom: Yup.date(),

  // Ngày đặt hàng (Đến)
  dateTo: Yup.date(),

  // Người thực hiện
  userName: Yup.string(),

  // Thời điểm import
  importDate: Yup.date(),

  // Kết quả gửi mail
  result: Yup.string(),
});
