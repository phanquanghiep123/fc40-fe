import * as Yup from 'yup';
import { format } from 'date-fns';
import { getDatetimeNow } from 'utils/datetimeUtils';
import { localstoreUtilites } from 'utils/persistenceData';
import {
  VEHICLE_ROUTE_TYPE_1,
  VEHICLE_ROUTE_TYPE_4,
  VEHICLE_ROUTE_TYPE_5,
} from './constants';
const auth = localstoreUtilites.getAuthFromLocalStorage();
const now = getDatetimeNow();

export const ReceivingDeliveryOrderFarmSchema = Yup.object().shape({
  receivingPersonName: Yup.string().required('Trường không được bỏ trống'),
  receiverName: Yup.string().required('Trường không được bỏ trống'),
  actualArrivalHour: Yup.string().required('Trường không được bỏ trống'),
  regulatedDepartureHour: Yup.string().required('Trường không được bỏ trống'),
  drivingDuration: Yup.number().required('Trường không được bỏ trống'),
  coolingVehicleTime: Yup.number().nullable(),
  minStandardTemperature: Yup.number()
    .when('vehicleRouteType', (vehicleRouteType, schema) => {
      // eslint-disable-next-line eqeqeq
      if (vehicleRouteType == VEHICLE_ROUTE_TYPE_4) {
        return schema.required('Trường không được bỏ trống');
      }
      return Yup.number();
    })
    .max(
      Yup.ref('maxStandardTemperature'),
      'Nhiệt độ tiêu chuẩn Min không được lớn hơn Nhiệt độ tiêu chuẩn Max',
    ),
  maxStandardTemperature: Yup.number()
    .when('vehicleRouteType', (vehicleRouteType, schema) => {
      // eslint-disable-next-line eqeqeq
      if (vehicleRouteType == VEHICLE_ROUTE_TYPE_4) {
        return schema.required('Trường không được bỏ trống');
      }
      return Yup.number();
    })
    .min(
      Yup.ref('minStandardTemperature'),
      'Nhiệt độ tiêu chuẩn Max không được nhỏ hơn Nhiệt độ tiêu chuẩn Min',
    ),
  actualTemperature: Yup.string().when(
    'vehicleRouteType',
    (vehicleRouteType, schema) => {
      if (
        // eslint-disable-next-line eqeqeq
        vehicleRouteType != VEHICLE_ROUTE_TYPE_1 &&
        // eslint-disable-next-line eqeqeq
        vehicleRouteType != VEHICLE_ROUTE_TYPE_5
      ) {
        return schema.required('Trường không được bỏ trống');
      }
      return Yup.string();
    },
  ),
  reason: Yup.string().when('shippingLeadtime', (shippingLeadtime, schema) => {
    if (shippingLeadtime !== 1) {
      // 1 là đạt, khác 1 là không đạt
      return schema.required('Trường không được bỏ trống');
    }
    return Yup.string();
  }),
  vehicleCleaning: Yup.string().required('Trường không được bỏ trống'),
});

export const ReceivingDeliveryOrderBussinesSchema = Yup.object().shape({
  receivingPersonName: Yup.string().required('Trường không được bỏ trống'),
  receiverName: Yup.string().required('Trường không được bỏ trống'),
  actualArrivalHour: Yup.string().required('Trường không được bỏ trống'),
  drivingPlate: Yup.string().nullable(),
  regulatedArrivalHour: Yup.string().required('Trường không được bỏ trống'),
  coolingVehicleTime: Yup.number().nullable(),
  minStandardTemperature: Yup.number()
    .when('vehicleRouteType', (vehicleRouteType, schema) => {
      // eslint-disable-next-line eqeqeq
      if (vehicleRouteType == VEHICLE_ROUTE_TYPE_4) {
        return schema.required('Trường không được bỏ trống');
      }
      return Yup.number();
    })
    .max(
      Yup.ref('maxStandardTemperature'),
      'Nhiệt độ tiêu chuẩn Min không được lớn hơn Nhiệt độ tiêu chuẩn Max',
    ),
  maxStandardTemperature: Yup.number()
    .when('vehicleRouteType', (vehicleRouteType, schema) => {
      // eslint-disable-next-line eqeqeq
      if (vehicleRouteType == VEHICLE_ROUTE_TYPE_4) {
        return schema.required('Trường không được bỏ trống');
      }
      return Yup.number();
    })
    .min(
      Yup.ref('minStandardTemperature'),
      'Nhiệt độ tiêu chuẩn Max không được nhỏ hơn Nhiệt độ tiêu chuẩn Min',
    ),
  actualTemperature: Yup.string().when(
    'vehicleRouteType',
    (vehicleRouteType, schema) => {
      if (
        // eslint-disable-next-line eqeqeq
        vehicleRouteType != VEHICLE_ROUTE_TYPE_1 &&
        // eslint-disable-next-line eqeqeq
        vehicleRouteType != VEHICLE_ROUTE_TYPE_5
      ) {
        return schema.required('Trường không được bỏ trống');
      }
      return Yup.string();
    },
  ),
  reason: Yup.string().when('shippingLeadtime', (shippingLeadtime, schema) => {
    if (shippingLeadtime !== 1) {
      // 1 là đạt, khác 1 là không đạt
      return schema.required('Trường không được bỏ trống');
    }
    return Yup.string();
  }),
  vehicleCleaning: Yup.string().required('Trường không được bỏ trống'),
});

export const initialSchema = {
  deliverOrReceiver: 1,
  doType: 1,
  doCode: '', // Mã BBGH
  status: 1, // Trạng thái
  sealNumber: '', // Số seal
  sealStatus: 0, // Trạng thái của Seal
  deliveryName: '', // Bên Giao Hàng(Lấy từ màn trước)
  deliveryPersonName: '', // Đại diện giao hàng (Lấy từ màn trước)
  deliveryPersonPhone: '', // Số điện thoại
  deliveryDateTime: '', // Ngày Giao Hàng
  receiverName: '', // Bên Nhận Hàng
  // chọn nhân viên thì số điện thoại tự động hiển thị
  receivingPersonName: `${auth.meta.fullName}`, // Đại Diện Nhận Hàng
  receivingPersonPhone: `${auth.meta.phoneNumber}`, // Số Điện Thoại
  stockReceivingDateTime: now, // Ngày Nhận Hàng
  shipperName: '', // Nhà Vận Chuyển
  driver: '', // Lái Xe
  phone: '', // Số Điện Thoại
  drivingPlate: '', // Biển Số Xe
  vehicleWeight: '', // Trọng Tải
  unregulatedLeadtime: false, // leadtime không theo quy định
  // Ngày giờ đến thực tế < ngày giờ đến theo quy định ==> Không đạt
  // Chọn vào check box thì cho thay đổi giá trị
  shippingLeadtime: 1, // Vận Chuyển Theo Leadtime
  //  (Farm/NSC) Bắt buộc nhập vào khi check, Lấy từ masterdata khi không check
  regulatedDepartureHour: '', // Giờ Xuất Phát Theo Quy Định
  actualDepartureHour: '10:10', // Giờ Xuất Phát Thực Tế
  //  (Farm/NSC) Bắt buộc nhập vào khi check
  drivingDuration: '', // Thời Gian Di Chuyển (giờ)
  //  Giờ Đến Theo Quy Định
  // (Farm/NSC) Ngày giao hàng + Giờ xuất phát theo qui định + Thời gian di chuyển (giờ)
  // (NCC) Bắt buộc nhập vào khi check, Lấy từ masterdata khi không check
  // Ngày Giờ đến theo qui định = Ngày giao hàng + Giờ đến theo qui định
  regulatedArrivalHour: '', // Giờ Đến Theo Quy Định
  //  Giờ Dự Kiến Đến
  // (Farm/NSC) Ngày giao hàng + Giờ xuất phát thực tế + Thời gian di chuyển (giờ)
  // (NCC) không xác định
  plannedArrivalHour: '', // Giờ Dự Kiến Đến
  //  Giờ Đến Thực Tế
  // (Farm/NSC) Ngày giờ đến thực tế = Ngày nhận hàng + Giờ đến thực tế
  // (NCC) Ngày giờ đến thực tế = Ngày nhận hàng + Giờ đến thực tế
  actualArrivalHour: `${format(new Date(), 'HH:mm')}`, // Giờ Đến Thực Tế
  reason: '', // Nguyên Nhân
  deliveryTime: `${format(new Date(), 'HH:mm')}`, // Thời Gian Trả Hàng Xong
  coolingVehicleTime: '', // Thời Gian Nổ Xe Lạnh Trả Hàng
  vehicleRouteType: 1, // Loại Xe.Tuyến
  actualTemperature: '', // Nhiệt Độ Thực Tế
  minStandardTemperature: '', // Nhiệt Độ Tiêu Chuẩn Min
  maxStandardTemperature: '', // Nhiệt Độ Tiêu Chuẩn Max
  temperatureStatus: 1, // Trạng Thái Nhiệt Độ
  chipTemperature1: '', // Nhiệt Độ Chip 1
  chipTemperature2: '', // Nhiệt Độ Chip 2
  chipTemperatureStatus: 1, // Trạng Thái Nhiệt Độ Chip
  vehiclePallet: 1, // Pallet Lót Sàn Xe
  vehicleCleaning: 1, // Vệ Sinh Xe
  notes: '', // Ghi Chú Về Vận Chuyển
  imageFiles: [],
  deleteIds: [],
  shipperId: 0,
  deliveryOrderTransportViolationList: [],
  receivingPersonCode: `${auth.meta.userId}`, // mã đại diện nhận hàng
  vehicleNumbering: 1,
  receiverCode: '',
  filedName: '',
};
