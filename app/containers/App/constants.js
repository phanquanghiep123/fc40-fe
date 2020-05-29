/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

// Trạng thái biên bản giao hàng
export const MASTER_CODE_DELIVERY_ORDER_STATUS = 2;
// Pallet lót sàn xe
export const MASTER_CODE_DELIVERY_ORDER_VEHICLE_PALLET = 3;
// vệ sinh xe
export const MASTER_CODE_DELIVERY_ORDER_VEHICLE_CLEANING = 4;
// Leadtime vận chuyển
export const MASTER_CODE_DELIVERY_ORDER_SHIPPING_LEADTIME = 5;
// nguyên nhân
export const MASTER_CODE_DELIVERY_ORDER_REASON = 6;
// Trạng thái nhiệt độ
export const MASTER_CODE_DELIVERY_ORDER_TEMPERATURE_STATUS = 7;
// Trạng thái seal
export const MASTER_CODE_DELIVERY_ORDER_SEAL_STATUS = 20;

// Farm tới Plant (cùng địa điểm)
export const DELIVERY_ORDER_FARM_TO_PLANT_2 = 2;
// Plan tới plant
export const DELIVERY_ORDER_PLANT_TO_PLANT = 4;
// loại biên bản giao hàng nhà cung cấp
export const DELIVERY_ORDER_BUSSINES = 3;
// Loại biên bản giao hàng khay sọt
export const BASKET_ORDER = 7;

export const IMPORT_STOCK_FROM_BUSSINES = 12;

// QUYỀN
// Update thông tin cân tổng điều phối
export const CP0040U = 'CP0040U';

// Import thông tin cân tổng điều phối
export const CP0040C = 'CP0040C';

export const CLOSE_SNACK_BAR = 'fc40/App/CLOSE_SNACK_BAR';
export const CLOSE_DIALOG = 'fc40/App/CLOSE_DIALOG';
export const OPEN_DIALOG = 'fc40/App/OPEN_DIALOG';
export const LOADING_ERROR = 'fc40/App/LOADING_ERROR';
export const GET_MENU = 'fc40/App/GET_MENU';
export const SAVE_MENU = 'fc40/App/SAVE_MENU';
export const ALERT_INVALID = 'fc40/App/ALERT_INVALID';
export const SET_LOADING = 'fc40/App/SET_LOADING';
export const CONNEC_DEVICE = 'fc40/App/CONNEC_DEVICE';
export const RECIVE_DATA = 'fc40/App/RECIVE_DATA';

// Notification
export const NOTIFICATION_TYPE_SUCCESS = 1;
export const NOTIFICATION_TYPE_INFO = 2;
export const NOTIFICATION_TYPE_WARNING = 3;
export const NOTIFICATION_TYPE_ERROR = 4;
