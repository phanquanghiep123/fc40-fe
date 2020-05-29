import * as Yup from 'yup';

import { PAGE_SIZE } from 'utils/constants';

export const SearchSchema = Yup.object().shape({
  // Vùng tiêu thụ
  consumeRegion: Yup.string().default(''),

  // NCC
  supplierCode: Yup.string().default(''),

  // Trạng thái gửi mail
  status: Yup.number().default(0),

  // Ngày gửi mail
  date: Yup.date().default(null),

  // Hoàn thành gửi mail
  isSent: Yup.boolean().default(true),
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

export const MailSentSchema = Yup.object().shape({
  // Mã NCC
  supplierCode: Yup.string(),

  // Tên NCC
  supplierName: Yup.string(),

  // Vùng Tiêu Thụ
  consumeRegionName: Yup.string(),

  // File gửi mail
  fileName: Yup.string(),

  // Ngày gửi mail
  date: Yup.date(),

  // Trạng thái
  status: Yup.number(),

  // Tên Trạng thái
  statusName: Yup.string(),
});
