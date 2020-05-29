// Vùng tiêu thụ
export const regionOption = {
  regionName: 'Tất cả',
  regionCode: '',
};

// NCC
export const supplierOption = {
  supplierName: 'Tất cả',
  supplierCode: '',
};

// Trạng thái gửi mail
export const sendStatusOption = {
  statusCode: 0,
  statusName: 'Tất cả',
};

// Danh sách các NCC
export const danhSachNCC = [
  { supplierCode: 'NCC0001', supplierName: 'Htx Nn Hoang Hai Tan Lap' },
  { supplierCode: 'NCC0002', supplierName: 'Canh dong nho' },
  { supplierCode: 'NCC0003', supplierName: 'Htx Tu Xa' },
];

// Danh sách vùng miền
export const danhSachVungMien = [
  { regionCode: 'MB', regionName: 'Miền Bắc' },
  { regionCode: 'LD', regionName: 'Lâm Đồng' },
  { regionCode: 'MN', regionName: 'Miền Nam' },
];

// Danh sách Trạng thái gửi mail
export const danhSachTrangThai = [
  { statusCode: 1, statusName: 'Chưa gửi' },
  { statusCode: 2, statusName: 'Đã gửi' },
];

// Danh sách Lịch sử gửi mail
export const danhSachNhaCungCap = [
  {
    supplierCode: '2000216',
    supplierName: 'Htx Nn Hoang Hai Tan Lap',
    consumeRegionName: 'Miền Bắc, Miền Nam',
    fileName: 'BIEU MAU DAT HANG NCC_3.xlsb',
    date: '2001-01-01T01:01:01.310Z',
    status: 2,
    statusName: 'Đã gửi',
  },
  {
    supplierCode: '2000217',
    supplierName: 'Canh dong nho',
    consumeRegionName: 'Miền Bắc',
    fileName: 'BIEU MAU DAT HANG NCC_3.xlsb',
    date: '2001-01-01T01:01:01.310Z',
    status: 1,
    statusName: 'Chưa gửi',
  },
  {
    supplierCode: '2000248',
    supplierName: 'Htx Tu Xa',
    consumeRegionName: 'Miền Bắc',
    fileName: 'BIEU MAU DAT HANG NCC_3.xlsb',
    date: null,
    status: 1,
    statusName: 'Chưa gửi',
  },
];
