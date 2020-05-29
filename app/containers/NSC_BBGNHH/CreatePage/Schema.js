import * as Yup from 'yup';

import { formatToNumber } from 'utils/numberUtils';

import { MASTER_FORM, TYPE_BBGNHH, VEHICLE_ROUTE } from './constants';

// Phiếu xuất kho
export const ExportReceiptSchema = Yup.object({
  // Mã Phiếu xuất kho
  stockExportReceiptCode: Yup.string().nullable(),

  // Mã khách hàng
  customerCode: Yup.string().nullable(),

  // Tên khách hàng
  customerName: Yup.string().nullable(),
});

// Thông tin hàng hóa
export const DeliveryStockSchema = Yup.object({
  // Id Hàng hóa
  // id: Yup.string().nullable(),

  /* Dành cho ICD */
  // Cửa hàng
  shipToCode: Yup.string().nullable(),

  // Tên Cửa hàng
  shipToName: Yup.string().nullable(),

  // Địa chỉ
  routeAddress: Yup.string().nullable(),

  // Mã tuyến
  routeCode: Yup.string().nullable(),

  /* Dành cho VinLog */
  // Mã Phiếu xuất kho
  stockExportReceiptCode: Yup.string().nullable(),

  // Mã khách hàng
  customerCode: Yup.string().nullable(),

  // Tên khách hàng
  customerName: Yup.string().nullable(),

  // Mã Farm/NCC
  farmSupplierCode: Yup.string().nullable(),

  // Tên Farm/NCC
  farmSupplierName: Yup.string().nullable(),

  // Mã VCM
  vcmCode: Yup.string().nullable(),

  /* Dành cho VinLog + Loại khác */
  // Mã sản phẩm
  productCode: Yup.string().nullable(),

  // Tên sản phẩm
  productName: Yup.string().nullable(),

  // Số lượng xuất
  quantity: Yup.number().nullable(),

  // Đơn vị
  uoM: Yup.string().nullable(),

  /* Thông tin khay sọt */
  // Mã khay sọt 1
  basketCode1: Yup.string().nullable(),

  // Tên khay sọt 1
  basketName1: Yup.string().nullable(),

  // SL khay sọt 1
  deliverQuantity1: Yup.number().nullable(),

  // Đơn vị khay sọt 1
  basketUoM1: Yup.string().nullable(),

  // Mã khay sọt 2
  basketCode2: Yup.string().nullable(),

  // Tên khay sọt 2
  basketName2: Yup.string().nullable(),

  // SL khay sọt 2
  deliverQuantity2: Yup.number().nullable(),

  // Đơn vị khay sọt 2
  basketUoM2: Yup.string().nullable(),

  // Mã khay sọt 3
  basketCode3: Yup.string().nullable(),

  // Tên khay sọt 3
  basketName3: Yup.string().nullable(),

  // SL khay sọt 3
  deliverQuantity3: Yup.number().nullable(),

  // Đơn vị khay sọt 3
  basketUoM3: Yup.string().nullable(),

  // Ghi chú
  notes: Yup.string().nullable(),
});

// Thông tin khay sọt
export const BasketSchema = Yup.object({
  // Mã khách hàng (Loại khác không hiển thị trường này)
  customerCode: Yup.string(),

  // Tên khách hàng (Loại khác không hiển thị trường này)
  customerName: Yup.string(),

  // Mã khay sọt
  basketCode: Yup.string(),

  // Tên khay sọt
  basketName: Yup.string(),

  // Đơn vị tính
  basketUoM: Yup.string(),

  // SL giao
  totalQuantity: Yup.number(),
});

/**
 * Generate schema for columns which depend on "Transporter"
 * @param transporter - transporter value
 * @param schema - current column schema
 * @returns {*}
 */
function whenTransporter(transporter, schema) {
  return transporter
    ? schema.required('Cần nhập giá trị').typeError('Yêu cầu nhập đúng')
    : schema;
}

// Thông tin vận chuyển
export const DeliveryTransportSchema = Yup.object({
  // Id Vận chuyển
  // id: Yup.string().nullable(),

  // Bên vận chuyển
  // transporterCode: Yup.string()
  //   .nullable()
  //   .when(
  //     ['driver', 'drivingPlate', 'vehicleWeight'],
  //     (driver, drivingPlate, vehicleWeight, schema) => {
  //       if (driver || drivingPlate || vehicleWeight) {
  //         return schema.required('Cần nhập giá trị');
  //       }
  //       return schema;
  //     },
  //   ),

  // Tên Bên vận chuyển
  transporter: Yup.string().nullable(),

  // Lái xe
  driver: Yup.string()
    .nullable()
    .when('transporter', whenTransporter),

  // Điện thoại
  phone: Yup.string().nullable(),

  // Biển số xe
  drivingPlate: Yup.string()
    .nullable()
    .when('transporter', whenTransporter),

  // Tải trọng xe
  vehicleWeight: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .when('transporter', whenTransporter),

  // Leadtime phát sinh
  unregulatedLeadtime: Yup.boolean()
    .nullable()
    .default(false),

  // Giờ xuất phát quy định
  regulatedDepartureDate: Yup.string()
    .nullable()
    .when('transporter', whenTransporter),

  // Giờ xuất phát thực tế
  actualDepartureDate: Yup.string()
    .nullable()
    .default(new Date())
    .when('transporter', whenTransporter),

  // Thời gian di chuyển
  drivingDuration: Yup.number()
    .nullable()
    .max(1000, 'Thời gian di chuyển không quá 1000 Giờ')
    .when('transporter', whenTransporter),

  // Giờ đến theo quy định
  regulatedArrivalDate: Yup.string().nullable(),

  // Giờ dự kiến đến
  plannedArrivalDate: Yup.string().nullable(),

  // Vận chuyển theo Leadtime xuất hàng
  shippingLeadtimeExport: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .default(MASTER_FORM.VAN_CHUYEN_THEO_LEADTIME),

  // Nguyên nhân xuất hàng
  shippingLeadtimeExportReason: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .default(MASTER_FORM.NGUYEN_NHAN),

  // Loại xe tuyến
  vehicleRouteType: Yup.number()
    .nullable()
    .when('transporter', whenTransporter),

  // Nhiệt độ lúc load hàng
  loadTemperature: Yup.number()
    .nullable()
    .when('transporter', whenTransporter),

  /**
   * Tab Bên Nhận
   */
  // TG trả hàng xong
  deliveryTime: Yup.string().nullable(),

  // TG nổ xe lạnh trả hàng
  coolingVehicleTime: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v)),

  // Pallet lót sàn xe
  vehiclePallet: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .default(MASTER_FORM.PALLET_LOT_SAN_XE),

  // Giờ xe đến thực tế
  actualArrivalDate: Yup.string().nullable(),

  // Trạng thái nhiệt độ
  temperatureStatus: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .default(MASTER_FORM.TRANG_THAI_NHIET_DO),

  // Nhiệt độ chip 1
  chipTemperature1: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v)),

  // Nhiệt độ chip 2
  chipTemperature2: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v)),

  // Trạng thái nhiệt độ chip
  chipTemperatureStatus: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .default(MASTER_FORM.TRANG_THAI_NHIET_DO_CHIP),

  // Vệ sinh xe
  vehicleCleaning: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .default(MASTER_FORM.VE_SINH_XE),

  // Vận chuyển theo Leadtime
  shippingLeadtime: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v)),

  // Nguyên nhân
  reason: Yup.number()
    .nullable()
    .transform(v => formatToNumber(v))
    .default(MASTER_FORM.NGUYEN_NHAN),

  // Ghi chú
  notes: Yup.string()
    .nullable()
    .default(''),
});

export default Yup.object({
  // Id BBGNHH
  // id: Yup.string().nullable(),

  /* Thông tin biên bản */
  // Mã BBGNHH
  deliveryReceiptCode: Yup.string().nullable(),

  // Loại BBGNHH
  deliveryReceiptType: Yup.number()
    .nullable()
    .default(TYPE_BBGNHH.ICD),

  // Thời gian tạo BB
  createDate: Yup.date()
    .nullable()
    .default(new Date()),

  // Mã Người tạo BB
  creatorCode: Yup.string().nullable(),

  // Người tạo BB
  creatorName: Yup.string()
    .nullable()
    .required('Không được bỏ trống'),

  // Điện thoại của người tạo
  creatorPhone: Yup.string().nullable(),

  // Số seal
  sealNumber: Yup.string()
    .nullable()
    .when(
      [
        'deliveryReceiptTransports[0].transporterCode',
        'deliveryReceiptTransports[0].vehicleRouteType',
      ],
      (transporterCode, vehicleRouteType, schema) => {
        if (
          transporterCode &&
          [
            VEHICLE_ROUTE.XE_LANH_TUYEN_GAN,
            VEHICLE_ROUTE.XE_LANH_TUYEN_XA,
          ].includes(vehicleRouteType)
        ) {
          return schema.required('Không được bỏ trống');
        }
        return schema;
      },
    ),

  // Danh sách Phiếu xuất kho (Dành cho VinLog và Loại khác)
  deliveryReceiptStockExports: Yup.array(ExportReceiptSchema)
    .nullable()
    .default([]),

  /* Thông tin bên giao hàng */
  // Mã Farm/NSC
  deliverCode: Yup.string()
    .nullable()
    .required('Không được bỏ trống'),

  // Farm/NSC
  deliverName: Yup.string().nullable(),

  // Mã Đại diện giao hàng
  deliveryPersonCode: Yup.string().nullable(),

  // Đại diện giao hàng
  deliveryPersonName: Yup.string()
    .nullable()
    .required('Không được bỏ trống'),

  // Điện thoại
  deliveryPersonPhone: Yup.string().nullable(),

  // Ngày giao
  deliveryDate: Yup.date().default(new Date()),

  /* Thông tin bên nhận hàng */
  // Mã khách hàng
  customerCode: Yup.string().nullable(),

  // Khách hàng
  customerName: Yup.string()
    .nullable()
    .when('deliveryReceiptType', (deliveryReceiptType, schema) => {
      if (deliveryReceiptType === TYPE_BBGNHH.OTHER) {
        // return schema.required('Vui lòng nhập Mã Phiếu Xuất Kho');
        return schema.required('Vui lòng nhập Tên Khách Hàng');
      }
      return schema.required('Không được bỏ trống');
    }),

  // Tuyến đường (Dành cho ICD)
  deliveryReceiptRouteCode: Yup.string()
    .nullable()
    .when('deliveryReceiptType', (deliveryReceiptType, schema) => {
      if (deliveryReceiptType === TYPE_BBGNHH.ICD) {
        return schema.required('Không được bỏ trống');
      }
      return schema;
    }),

  // Địa chỉ nhận hàng
  receiverAddress1: Yup.string().nullable(),

  // ĐT liên hệ
  receiverContact1: Yup.string().nullable(),

  // Địa chỉ nhận hàng 2 (Dành cho ICD)
  receiverAddress2: Yup.string().nullable(),

  // ĐT liên hệ 2 (Dành cho ICD)
  receiverContact2: Yup.string().nullable(),

  /* Thông tin hàng hóa */
  deliveryReceiptStocks: Yup.array(DeliveryStockSchema).default([]),

  /* Thông tin bên vận chuyển */
  deliveryReceiptTransports: Yup.array(DeliveryTransportSchema).default([
    DeliveryTransportSchema.cast(),
  ]),
});
