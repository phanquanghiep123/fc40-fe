export const GET_ROUTE_AUTO = 'fc40/BBGNHHCreate/GET_ROUTE_AUTO';
export const GET_SHIPPER_AUTO = 'fc40/BBGNHHCreate/GET_SHIPPER_AUTO';
export const GET_CUSTOMER_AUTO = 'fc40/BBGNHHCreate/GET_CUSTOMER_AUTO';

export const GET_EXPORT_RECEIPT_AUTO =
  'fc40/BBGNHHCreate/GET_EXPORT_RECEIPT_AUTO';
export const GET_DELIVERY_PERSON_AUTO =
  'fc40/BBGNHHCreate/GET_DELIVERY_PERSON_AUTO';

export const CHANGE_TYPE_BBGNHH = 'fc40/BBGNHHCreate/CHANGE_TYPE_BBGNHH';

// Mã code trên Form
export const CODE_FORM = {
  PXK: 'PXK',
  MA_PXK: 'MA_PXK',
  KHACH_HANG: 'KHACH_HANG',
  VIEW_BBGNHH: 'VIEW_BBGNHH',
  TUYEN_DUONG: 'TUYEN_DUONG',
  BUTTON_DELI: 'BUTTON_DELI',
  BUTTON_SAVE: 'BUTTON_SAVE',
  NON_EDITABLE: 'NON_EDITABLE',
  DIA_CHI_NHAN_HANG: 'DIA_CHI_NHAN_HANG',
};

// Tạo, Chỉnh sửa và Xem
export const TYPE_FORM = {
  CREATE: 1,
  EDIT: 2,
  VIEW: 3,
};

// Loại BBGNHH
export const TYPE_BBGNHH = {
  ICD: 1,
  VINLOG: 2,
  OTHER: 3,
};

// Nguyên nhân
export const TYPE_REASON = {
  NG: 2, // Không dùng
  OTHER: 5, // Khác
};

// Vận chuyển theo Leadtime
export const TYPE_LEADTIME = {
  OK: 1, // Đạt
  NG: 0, // Không đạt
};

// Loại xe tuyến
export const VEHICLE_ROUTE = {
  XE_LANH_TUYEN_GAN: 2,
  XE_LANH_TUYEN_XA: 3,
};

// Giá trị mặc định
export const MASTER_FORM = {
  // Pallet lót sàn xe
  PALLET_LOT_SAN_XE: 2, // Không dùng

  // Trạng thái nhiệt độ
  TRANG_THAI_NHIET_DO: 2, // Không dùng

  // Trạng thái nhiệt độ chip
  TRANG_THAI_NHIET_DO_CHIP: 2, // Không dùng

  // Vệ sinh xe
  VE_SINH_XE: 2, // Không dùng

  // Vận chuyển theo Leadtime
  VAN_CHUYEN_THEO_LEADTIME: TYPE_LEADTIME.OK,

  // Nguyên nhân
  NGUYEN_NHAN: TYPE_REASON.NG,
};
