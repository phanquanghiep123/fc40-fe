import * as Yup from 'yup';

import { formatToNumber } from 'utils/numberUtils';

import { TYPE_DIEUCHINH } from './constants';

export const TimKiemSchema = Yup.object().shape({
  // Mã phiếu nhập kho
  documentCode: Yup.string().default(''),

  // Ngày nhập kho bắt đầu
  dateFrom: Yup.date().default(new Date()),

  // Ngày nhập kho kết thúc
  dateTo: Yup.date().default(new Date()),

  // Trạng thái điều chỉnh
  differentStatus: Yup.number().default(TYPE_DIEUCHINH.NOT_ADJUSTED),

  // Đơn vị nhận hàng
  receiverOrgCode: Yup.string().default(''),

  // Đơn vị giao hàng
  deliverOrgCode: Yup.string().default(''),
});

export const PhanTrangSchema = Yup.object().shape({
  // Số lượng record trên trang
  pageSize: Yup.number().default(5),

  // Trang hiện tại
  pageIndex: Yup.number().default(0),

  // Tổng số lượng record
  totalCount: Yup.number().default(0),
});

export const FormTimKiemSchema = Yup.object()
  .concat(TimKiemSchema)
  .concat(PhanTrangSchema);

export const PhieuSchema = Yup.object().shape({
  // Id Phiếu nhập kho
  // id: Yup.number(),

  // Phiếu nhập kho
  documentCode: Yup.string(),

  // Trạng thái
  documentStatus: Yup.string(),

  // Loại nhập kho
  documentSubType: Yup.string(),

  // Đơn vị giao hàng
  deliver: Yup.string(),

  // Đơn vị nhận hàng
  receiver: Yup.string(),

  // Ngày nhập kho
  date: Yup.string(),

  // Danh sách Sản phẩm
  // listDetails: Yup.array(),
});

export const SanPhamSchema = Yup.object().shape({
  // Phiếu nhập kho
  documentCode: Yup.string(),

  // Mã đi hàng
  productCode: Yup.string(),

  // Tên sản phẩm
  productName: Yup.string(),

  // Batch
  batch: Yup.string(),

  // Phân loại xử lý
  processingType: Yup.number(),

  // Tên Phân loại xử lý
  processingTypeName: Yup.string(),

  // Khối lượng giao
  deliveryQuantity: Yup.number(),

  // Khối lượng nhận
  receiveQuantity: Yup.number(),

  // Khối lượng chênh lệch
  differentQuantity: Yup.number(),

  // Tỷ lệ chênh lệch
  differentRatio: Yup.string(),

  // Loại chênh lệch
  differenceType: Yup.number(),

  // Trạng thái điều chỉnh
  differenceStatus: Yup.number(),

  // Tên Trạng thái điều chỉnh
  differenceStatusName: Yup.string(),

  // Danh sách Lệnh sản xuát
  // farmProductionOrderDtos: Yup.array(),
});

export const LenhSanXuatSchema = Yup.object().shape({
  // Id Chi tiết phiếu
  documentDetailId: Yup.number(),

  // Lệnh sản xuất
  farmProductionOrder: Yup.string().nullable(),

  // Khối lượng
  quantity: Yup.number(),

  // Kho
  locatorIdModified: Yup.string(),

  // Danh sách kho
  locatorIds: Yup.array(),

  // Khối lượng điều chỉnh
  quantityModify: Yup.number().transform(v => formatToNumber(v)),
});
