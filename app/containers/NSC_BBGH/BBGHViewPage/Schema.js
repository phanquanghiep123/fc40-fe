import * as Yup from 'yup';

// import { section4Schema } from '../BBGHCreatePage/section4Schema';

export default Yup.object().shape({});

export const initSchema = {
  updatedTimes: 0,
  deliverOrReceiver: null, // type user edit page (1/ giao /2 nhận / 3 giao nhận)
  statusName: '',
  doTypeName: '',
  createdByName: '',
  farmSupplierName: '',
  zoneRegion: '',
  doCode: '', // Mã BBGH
  doType: 0, // Loại BBGH
  status: 1, // Trạng thái 1: chưa tiếp nhận 2: đã tiếp nhận
  sealNumber: '', // Số seal --- [api]
  sealStatus: 0, // Trạng thái seal --- [api]
  doWorkingUnitCode: 0, // Mã  đơn vị tạo BBGH
  deliverCode: 0, // Mã bên giao hàng
  deliveryName: '', // Tên bên giao hàng
  deliveryPersonCode: '', // Mã đại diện giao hàng --- [api]
  deliveryPersonName: '', // Tên đại diện giao hàng ---[api]
  deliveryPersonPhone: '', // Điện thoại đại diện giao ---[api]
  deliveryDateTime: '', // Ngày giờ giao hàng
  receiverCode: 0, // Mã bên nhận hàng
  receiverName: '', // Tên bên nhận hàng
  receivingPersonCode: '', // Mã đại diện nhận hàng ---[api]
  receivingPersonName: '', // Tên đại diện nhận hàng ---[api]
  receivingPersonPhone: '', // Điện thoại đại diện nhận ---[api]
  stockReceivingDateTime: '', // Ngày giờ nhận hàng ---[api]
  receivingOrderFlag: 0, // Flag đã tiếp nhận
  stockExportReceiptCode: null, // Khi tạo BBGH từ Phiếu xuất kho/Phiếu điều chuyển
  vehicleNumbering: '', // Số thứ tự xe trong ngày --- [api]
  stockList: [],
  shipperList: [],
  id: 0, // ---[api]
  createdBy: null,
  createdAt: '',
  updatedBy: null,
  updatedAt: '',
  // UI section 5
  basketsTrays: [
    {
      stt: '',
      name: '', // tên khay sọt
      amount: '', // số lượng
      amountReal: '', // số lượng thực tế
    },
  ],
};
