// Loại BBGNHH
export const delivertReceiptTypes = [
  { id: 1, name: 'Dành cho ICD' },
  { id: 2, name: 'Dành cho VinLog' },
  { id: 3, name: 'Loại khác' },
];

// Leadtime phát sinh
export const unregulatedLeadtime = [
  {
    regulatedDepartureHour: '11:00',
    drivingDuration: 1.5,
    regulatedArrivalHour: '12:30',
  },
  {
    regulatedDepartureHour: '05:00',
    drivingDuration: 1.5,
    regulatedArrivalHour: '06:30',
  },
];

// Loại xe tuyến
export const vehicleRoutes = [
  { vehicleRouteCode: 1, vehicleType: 'Xe bạt' },
  { vehicleRouteCode: 2, vehicleType: 'Xe lạnh tuyến gần' },
  { vehicleRouteCode: 3, vehicleType: 'Xe lạnh tuyến xa' },
  { vehicleRouteCode: 5, vehicleType: 'Xe thùng' },
  { vehicleRouteCode: 4, vehicleType: 'Khác' },
];

// Pallet lót sàn xe
export const vehiclePallets = [
  { id: 0, name: 'Không dùng' },
  { id: 1, name: 'Có' },
  { id: 2, name: 'Không có' },
];

// Trạng thái nhiệt độ
export const temperatureStatus = [
  { id: 0, name: 'Không dùng' },
  { id: 1, name: 'Đạt' },
  { id: 2, name: 'Không đạt' },
];

// Trạng thái nhiệt độ chip
export const chipTemperatureStatus = [
  { id: 0, name: 'Không dùng' },
  { id: 1, name: 'Đạt' },
  { id: 2, name: 'Không đạt' },
];

// Vệ sinh xe
export const vehicleCleanings = [
  { id: 0, name: 'Không dùng' },
  { id: 1, name: 'Đạt' },
  { id: 2, name: 'Không đạt' },
];

// Vận chuyển theo Leadtime
export const shippingLeadtime = [
  { id: 0, name: 'Không đạt' },
  { id: 1, name: 'Đạt' },
];

// Nguyên nhân
export const shippingLeadtimeReasons = [
  { id: 1, name: 'Không dùng' },
  { id: 2, name: 'Do bên giao hàng' },
  { id: 3, name: 'Do bên vận chuyển' },
  { id: 4, name: 'Do cả 2 bên' },
  { id: 5, name: 'Khác' },
];

// Nguyên nhân xuất hàng
export const shippingLeadtimeExportReasons = [
  { id: 1, name: 'Không dùng' },
  { id: 2, name: 'Do bên giao hàng' },
  { id: 3, name: 'Do bên vận chuyển' },
  { id: 4, name: 'Do cả 2 bên' },
];

// Tuyến đường
export const routes = [
  {
    deliveryReceiptRouteCode: 'Long_Thanh_KTC_ICDSongThan',
    receiveAddress1:
      'Cửa số 1, kho 10, cảng ICD Sóng Thần, Xã Bình Hoà, Huyện Thuận An, Bình Dương',
    contactInfo1: 'Duy: 01689671719, Hùng: 0908233377',
    receiveAddress2:
      'Cửa số 1, kho 10, cảng ICD Sóng Thần, Xã Bình Hoà, Huyện Thuận An, Bình Dương',
    contactInfo2: 'Duy: 01689671719, Hùng: 0908233377',
    vehicleRouteCode: 1,
  },
];

// Gợi ý từ Deli
export const deliSuggests = [
  {
    customerCode: '1530',
    customerName: 'VM Hà Đông',
    shipToCode: '1529',
    shipToName: null,
    routeCode: 'HN-02',
    routeAddress: ' Hà Đông, Hà Nội ',
    basketCode1: 'K0000008',
    basketName1: 'Sọt lớn (2.66 KG)',
    deliverQuantity1: 4,
    basketUoM1: 'Cái',
    basketCode2: 'K0000002',
    basketName2: 'Sọt nhỏ (1.66 KG)',
    deliverQuantity2: 0,
    basketUoM2: 'Cái',
    basketCode3: 'K0000004',
    basketName3: 'Sọt vừa (2.46 KG)',
    deliverQuantity3: 0,
    basketUoM3: 'Cái',
    notes: 'hahaahaha',
    stocks: [
      { productCode: '51000026', quantity: 8, uoM: 'KG' },
      { productCode: '51000028', quantity: 8.1, uoM: 'KG' },
      { productCode: '51000036', quantity: 8, uoM: 'KG' },
      { productCode: '52000453', quantity: 0.52, uoM: 'KG' },
      { productCode: '52000021', quantity: 30, uoM: 'CAI' },
    ],
  },
];

// Phiếu xuất kho
export const exportReceipts = [
  {
    stockExportReceiptCode: '500000002',
    customerCode: 'AK0502',
    customerName: 'Vincommerce Dĩ An',
    deliveryDate: '2019-08-11T16:28:45.238Z',
  },
  {
    stockExportReceiptCode: '500000003',
    customerCode: 'AK0502VP',
    customerName: 'Vincommerce Hà Nội',
    deliveryDate: '2019-08-11T16:28:45.238Z',
  },
];

// Thông tin hàng hóa
export const deliveryReceiptStocks = [
  {
    stockExportReceiptCode: '500000002',
    shipToCode: 1560,
    routeAddress: 'VinMart Dĩ An',
    routeCode: 'BD-01',
    customerCode: 'AK0502',
    customerName: 'Vincommerce Dĩ An',
    farmSupplierCode: '2001',
    farmSupplierName: 'Farm Tam Đảo',
    productCode: '51000143',
    productName: 'TP-Cà chua đỏ ĐR/NL VE',
    vcmCode: '',
    quantity: 80.1,
    uoM: 'KG',
    basketCode1: '70000011',
    basketName1: 'Xanh dương',
    deliverQuantity1: 30,
    basketCode2: '70000012',
    basketName2: 'Xanh lá cây',
    deliverQuantity2: 12,
    basketCode3: null,
    basketName3: null,
    deliverQuantity3: null,
    notes: null,
  },
  {
    stockExportReceiptCode: '500000003',
    shipToCode: 3855,
    routeAddress: 'VM+ BDG 453 Lý Thường Kiệt',
    routeCode: 'BD-02',
    customerCode: 'AK0502VP',
    customerName: 'Vincommerce Hà Nội',
    farmSupplierCode: '2001',
    farmSupplierName: 'Farm Tam Đảo',
    productCode: '51000143',
    productName: 'TP-Cà chua đỏ ĐR/NL VE',
    vcmCode: '',
    quantity: 2.3,
    uoM: 'KG',
    basketCode1: '70000011',
    basketName1: 'Xanh dương',
    deliverQuantity1: 25,
    basketCode2: null,
    basketName2: null,
    deliverQuantity2: null,
    basketCode3: null,
    basketName3: null,
    deliverQuantity3: null,
    notes: null,
  },
  {
    stockExportReceiptCode: '500000003',
    shipToCode: 4099,
    routeAddress: 'VM+ BDG 489 Nguyễn Tri Phương',
    routeCode: 'BD-03',
    customerCode: 'AK0502VP',
    customerName: 'Vincommerce Hà Nội',
    farmSupplierCode: '2001',
    farmSupplierName: 'Farm Tam Đảo',
    productCode: '51000143',
    productName: 'TP-Cà chua đỏ ĐR/NL VE',
    vcmCode: '',
    quantity: 2.3,
    uoM: 'KG',
    basketCode1: '70000011',
    basketName1: 'Xanh dương',
    deliverQuantity1: 25,
    basketCode2: '70000012',
    basketName2: 'Xanh lá cây',
    deliverQuantity2: 10,
    basketCode3: null,
    basketName3: null,
    deliverQuantity3: null,
    notes: null,
  },
];
