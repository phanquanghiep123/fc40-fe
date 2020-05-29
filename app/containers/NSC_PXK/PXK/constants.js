/**
 * @description
 * constants actions common for in PXK page
 */
export const RESET_FORM = 'fc40/PXK/RESET_FORM';

export const GET_INIT_PXK = 'fc40/PXK/GET_INIT_PXK';
export const GET_INIT_PXK_SUCCESS = 'fc40/PXK/GET_INIT_PXK_SUCCESS';
export const GET_WAREHOUSES = 'fc40/PXK/GET_WAREHOUSES';
export const GET_INIT_EXPORT_SELL = 'fc40/PXK/GET_INIT_EXPORT_SELL';
export const GET_EXPORT_SELL_SUCCESS = 'fc40/PXK/GET_EXPORT_SELL_SUCCESS';

export const GET_CHANNEL = 'fc40/PXK/GET_CHANNEL';
export const GET_CHANNEL_SUCCESS = 'fc40/PXK/GET_CHANNEL_SUCCESS';

export const GET_RECEIVER = 'fc40/PXK/GET_PLANT_TO_PLANT';
export const GET_CUSTOMER = 'fc40/PXK/GET_CUSTOMER';
export const GET_RECEIVER_SUCCCESS = 'fc40/PXK/GET_RECEIVER_SUCCCESS';
export const GET_WAREHOUSES_SUCCESS = 'fc40/PXK/GET_WAREHOUSES_SUCCESS';
export const GET_PRODUCTS = 'fc40/PXK/GET_PRODUCTS';
export const SAVE = 'fc40/PXK/SAVE';
export const SAVE_PXK_SUCCESS = 'fc40/PXK/SAVE_PXK_SUCCESS';
export const GET_USERS = 'fc40/PXK/GET_USERS';
export const GET_LIST_REQUEST_DESTROY = 'fc40/PXK/GET_LIST_REQUEST_DESTROY';
export const SAVE_LIST_REQUEST_DESTROY = 'fc40/PXK/SAVE_LIST_REQUEST_DESTROY';
export const GET_REQUEST_DESTROY_DETAIL = 'fc40/PXK/GET_REQUEST_DESTROY_DETAIL';
export const SAVE_DESTROY_ITEMS = 'fc40/PXK/SAVE_DESTROY_ITEMS';
export const SAVE_PXK = 'fc40/PXK/SAVE_PXK';
export const COMPLETE_PXK = 'fc40/PXK/COMPLETE_PXK';
export const GET_PXK_BY_ID = 'fc40/PXK/GET_PXK_BY_ID';
export const GET_PXK_BY_ID_SUCCESS = 'fc40/PXK/GET_PXK_BY_ID_SUCCESS';
export const DELETE_ROW = 'fc40/PXK/DELETE_ROW';
export const GET_BASKET_AUTO = 'fc40/PXK/GET_BASKET_AUTO';
export const GET_BASKET_MANGAGERS = 'fc40/PXK/GET_BASKET_MANGAGERS';
export const UPDATE_REDUCER_PXK = 'fc40/PXK/UPDATE_REDUCER_PXK';
export const GET_DATA_FROM_DELI = 'fc40/PXK/GET_DATA_FROM_DELI';
export const GET_SUGGEST_FROM_TURN_TO_SCALE =
  'fc40/PXK/GET_SUGGEST_FROM_TURN_TO_SCALE';
export const GET_BATCH_AUTO = 'fc40/PXK/GET_BATCH_AUTO';
export const CHECK_SAVE = 'fc40/PXK/CHECK_SAVE';

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
export const SUBTYPE_LABEL = {
  53: 'phiếu xuất kho nội bộ',
  51: 'phiếu xuất kho xuất điều chuyển farm',
  58: 'phiếu xuất kho xuất hủy',
  56: 'phiếu xuất bán',
};

/**
 * @description
 * Trạng thái phiếu xuất kho xuất kho
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
