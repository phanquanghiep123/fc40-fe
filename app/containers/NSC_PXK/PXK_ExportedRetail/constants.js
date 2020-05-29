/**
 * @description
 * constants actions common for in PXK page
 */
export const GET_INIT_PXK = 'fc40/PXKExportedRetail/GET_INIT_PXK';
export const GET_INIT_PXK_SUCCESS =
  'fc40/PXKExportedRetail/GET_INIT_PXK_SUCCESS';
export const GET_EXPORT_SELL_SUCCESS =
  'fc40/PXKExportedRetail/GET_EXPORT_SELL_SUCCESS';
export const GET_RECEIVER_SUCCCESS =
  'fc40/PXKExportedRetail/GET_RECEIVER_SUCCCESS';
export const GET_WAREHOUSES_SUCCESS =
  'fc40/PXKExportedRetail/GET_WAREHOUSES_SUCCESS';
export const GET_PRODUCTS = 'fc40/PXKExportedRetail/GET_PRODUCTS';
export const SAVE = 'fc40/PXKExportedRetail/SAVE';
export const SAVE_PXK_SUCCESS = 'fc40/PXKExportedRetail/SAVE_PXK_SUCCESS';
export const GET_LIST_REQUEST_DESTROY =
  'fc40/PXKExportedRetail/GET_LIST_REQUEST_DESTROY';
export const SAVE_LIST_REQUEST_DESTROY =
  'fc40/PXKExportedRetail/SAVE_LIST_REQUEST_DESTROY';
export const SAVE_DESTROY_ITEMS = 'fc40/PXKExportedRetail/SAVE_DESTROY_ITEMS';
export const SAVE_PXK = 'fc40/PXKExportedRetail/SAVE_PXK';
export const COMPLETE_PXK = 'fc40/PXKExportedRetail/COMPLETE_PXK';
export const GET_PXK_BY_ID_SUCCESS =
  'fc40/PXKExportedRetail/GET_PXK_BY_ID_SUCCESS';
export const DELETE_ROW = 'fc40/PXKExportedRetail/DELETE_ROW';
export const GET_BASKET_AUTO = 'fc40/PXKExportedRetail/GET_BASKET_AUTO';
export const GET_BASKET_MANGAGERS =
  'fc40/PXKExportedRetail/GET_BASKET_MANGAGERS';
export const UPDATE_REDUCER_PXK = 'fc40/PXKExportedRetail/UPDATE_REDUCER_PXK';
// -------------------------------------------------------
export const GET_PXK_BY_ID = 'fc40/PXKExportedRetail/GET_PXK_BY_ID';
export const GET_WAREHOUSES = 'fc40/PXKExportedRetail/GET_WAREHOUSES';
export const GET_BUSINESS_OBJECTS =
  'fc40/PXKExportedRetail/GET_BUSINESS_OBJECTS';
export const GET_PAYMENT_TYPES = 'fc40/PXKExportedRetail/GET_PAYMENT_TYPES';
export const GET_PACKING_STYPES = 'fc40/PXKExportedRetail/GET_PACKING_STYPES';
export const GET_RETAIL_TYPES = 'fc40/PXKExportedRetail/GET_RETAIL_TYPES';
export const GET_CUSTOMER_CODE_AUTO =
  'fc40/PXKExportedRetail/GET_CUSTOMER_CODE_AUTO';
export const GET_RETAIL_CUSTOMER = 'fc40/PXKExportedRetail/GET_RETAIL_CUSTOMER';
export const GET_USERS = 'fc40/PXKExportedRetail/GET_USERS';
/**
 * @description
 * constants bussiness common for PXK page
 */
export const TYPE_PXK = {
  PXK_NOI_BO: 53, // Phiếu xuất kho nội bộ
  PXK_XDC_FARM: 51, // Phiếu xuất kho xuất điều chuyển farm
  PXK_XUAT_HUY: 58, // Phiếu xuất kho xuất hủy
  PXK_XUAT_BAN: 56, // Phiếu xuất kho - xuất bán
  PXK_XUAT_BAN_XA: 57, // Phiếu xuất kho - xuất bán xá
  PXK_CHUYEN_MA: 60, // Phiếu xuất chuyển mã
};

/**
 * @description
 * Trạng thái phiếu xuất kho
 */
export const STATUS_PXK = {
  COMPLETE: 2, // Hoàn thành
  SCALING: 1, // Đang cân
};

/**
 * @description
 * Trạng thái cân của sản phẩm
 */
export const STATUS_PRODUCT = {
  SCALING: 1, // Đang cân
  COMPLETE: 2, // Hoàn thành
  NOT_SCALE_YET: 3, // Chưa cân
  WAIT_CREATE_TRANSACTION: 4, // Chờ tạo transaction
  NO_SCALE: 5, // Không cân
};
