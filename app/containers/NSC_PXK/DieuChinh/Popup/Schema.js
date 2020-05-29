import * as Yup from 'yup';
import { startOfDay } from 'date-fns';

import { formatToNumber } from 'utils/numberUtils';

export default Yup.object().shape({
  // Đơn vị
  plantCode: Yup.string().default(''),

  // Tên Đơn vị
  plantName: Yup.string().default(''),

  // Mã sản phẩm
  productCode: Yup.string().default(''),

  // Mã Farm/NCC
  receiverCode: Yup.string().default(''),

  // Tên Farm/NCC
  receiverName: Yup.string().default(''),

  // Ngày chia chọn
  processDate: Yup.date().default(startOfDay(new Date())),

  // Danh sách dữ liệu chi tiết
  modificationDetails: Yup.array().default([]),
});

export const SanPhamSchema = Yup.object().shape({
  // Đơn vị
  plantCode: Yup.string(),

  // Ngày chia chọn
  processDate: Yup.date(),

  // Mã sản phẩm
  productCode: Yup.string(),

  // Tên sản phẩm
  productName: Yup.string(),

  // Mã Farm/NCC
  receiverCode: Yup.string(),

  // Tên Farm/NCC
  receiverName: Yup.string(),

  // Đơn vị tính
  uom: Yup.string(),

  // Đơn vị cơ bản
  // baseUoM: Yup.string(),

  // SL chia thực tế
  deliveryQuantity: Yup.number(),

  // SL chia chọn
  pickingQuantity: Yup.number(),

  // SL chêch lệch
  differentQuantity: Yup.number(),

  // Tỷ lệ chênh lệch
  differentRatio: Yup.number(),

  // Tỷ lệ chênh lệch (%)
  differentRatioString: Yup.string(),

  // Danh sách Batch
  // details: Yup.array(),
});

export const BatchSchema = Yup.object().shape({
  // Id chi tiết phiếu
  documentDetailId: Yup.number().nullable(),

  // Batch
  batch: Yup.string().nullable(),

  // Lệnh sản xuất
  farmProductionOrder: Yup.string().nullable(),

  // Xác định dòng được thêm mới
  isFlag: Yup.boolean().nullable(),

  // Tỷ lệ phân bổ
  // ratio: Yup.string().nullable(),

  // SL Nhập bù lớn nhất
  quantityOffset: Yup.number().nullable(),

  // SL điều chỉnh
  differenceModify: Yup.number().transform(v => formatToNumber(v)),

  // Mã Kho
  locatorId: Yup.string().nullable(),

  // Kho nhập
  locatorName: Yup.string().nullable(),
});
