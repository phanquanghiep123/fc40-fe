export const GET_BASKET_AUTO = 'fc40/importedStockReceipt/GET_BASKET_AUTO';
export const GET_CUSTOMER_AUTO = 'fc40/importedStockReceipt/GET_CUSTOMER_AUTO';

export const NUM_PER_PAGE = 10; // Số lượng dòng khi khởi tạo

export const TYPE_ACTION = {
  IMPORT_STOCK: 1, // Hành động Nhập kho
  IMPORT_COMPLETEED: 2, // Hành động Hoàn thành
};

export const TYPE_USER = {
  NONE: null,
  NCC: 1,
  FARM: 0,
};

export const TYPE_IMPORT = {
  NONE: null,
  IMPORT_STOCK: 1, // Nhập kho đâu vào
  IMPORT_RIGHT: 2, // Nhập xuất thẳng
};

export const TYPE_PROCESSING = {
  NONE: null,
  LUU_KHO: 1000, // Lưu kho
  SO_CHE: 2000, // Sơ chế
};

// Trạng thái của phiếu cân nhập kho
export const DOCUMENT_STATUS = {
  ALL: 0, // Tất cả
  WEIGHT: 1, // Đang cân
  COMPLETED: 2, // Đã hoàn thành
};

export const DOCUMENT_DETAIL_STATUS = {
  ALL: 0, // Tất cả
  WEIGHT: 1, // Đang cân
  COMPLETED: 2, // Đã hoàn thành
};
// Trạng thái cân nhập kho của sản phẩm
export const PRODUCT_STATUS = {
  ALL: 0,
  WEIGHT: 1, // Đã cân
  UNWEIGHT: 3, // Chưa cân
  COMPLETED: 2, // Đã hoàn thành
};

// Đơn vị tính cơ bản
export const TYPE_BASE_UNIT = {
  KG: 'KG',
};
