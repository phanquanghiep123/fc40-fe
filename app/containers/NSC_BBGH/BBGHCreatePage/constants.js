/*
 * BBGH details
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const CREATE_BBGH_FARM = 'fc40/BBGHDetails/CREATE_BBGH_FARM';
export const CREATE_BBGH_SUCCESS = 'fc40/BBGHDetails/CREATE_BBGH_SUCCESS';
export const GET_INIT_CREATED_BBGH = 'fc40/BBGHDetails/GET_INIT_CREATED_BBGH';
export const GET_INIT_CREATED_BBGH_SUCCESS =
  'fc40/BBGHDetails/GET_INIT_CREATED_BBGH_SUCCESS';
export const GET_USER_AUTOCOMPLETE = 'fc40/BBGHDetails/GET_USER_AUTOCOMPLETE';
export const GET_FARM_NSC_AUTO = 'fc40/BBGHDetails/GET_FARM_NSC_AUTO';
export const CHANGE_TYPE_BBGH = 'fc40/BBGHDetails/CHANGE_TYPE_BBGH';
export const CHANGE_SELECTED_UNIT = 'fc40/BBGHDetails/CHANGE_SELECTED_UNIT';
export const ALERT_INVALID_WHEN_SUBMIT =
  'fc40/BBGHDetails/ALERT_INVALID_WHEN_SUBMIT';
export const GET_SHIPPER_AUTO = 'fc40/BBGHDetails/GET_SHIPPER_AUTO';

export const GET_PROD_ORDER_AUTO = 'fc40/BBGHDetails/GET_PROD_ORDER_AUTO';
export const GET_FARM_PRODUCT_AUTO = 'fc40/BBGHDetails/GET_FARM_PRODUCT_AUTO';
export const GET_FINISH_PRODUCTS_AUTO =
  'fc40/BBGHDetails/GET_FINISH_PRODUCTS_AUTO';

export const GET_PLAN_AUTO = 'fc40/BBGHDetails/GET_PLAN_AUTO';
export const GET_SUGGEST_SEARCH = 'fc40/BBGHDetails/GET_SUGGEST_SEARCH';
export const SET_DATA_SUGGEST_SEARCH =
  'fc40/BBGHDetails/SET_DATA_SUGGEST_SEARCH';
export const SET_SUBMIT_SUGGEST_SEARCH =
  'fc40/BBGHDetails/SET_SUBMIT_SUGGEST_SEARCH';

export const CHANGE_SUGGEST_DATA = 'fc40/BBGHDetails/CHANGE_SUGGEST_DATA';

export const GET_PROD_ORDER_BY_SUGGEST_AUTO =
  'fc40/BBGHDetails/GET_PROD_ORDER_BY_SUGGEST_AUTO';

export const SHOW_LOADING = 'fc40/BBGHDetails/SHOW_LOADING';

/**
 * @descripton
 * plant: một trong hai loại Farm hoặc NSC
 * change from v8
 */
export const TYPE_BBGH = {
  NCC_TO_NSC: 3, // Từ NCC tới NSC
  FARM_POST_HARVEST: 6, // Farm nhập sau thu hoạch
  FARM_TO_PLANT_CODE_1: 1, // Từ Farm tới plant khác (không có PXK - khác địa điểm)
  FARM_TO_PLANT_CODE_2: 2, // Từ Farm tới plant khác (không có PXK - cùng địa điểm)
  PLANT_TO_PLANT_CODE_4: 4, // Từ plant tới plant khác
  BASKET_DELIVERY_ORDER: 7, //  Loại khay sọt
  BASKET_DELIVERY_ORDER_LOAN: 8, //  Loại khay sọt cho phiếu xuất mượn
};

export const TYPE_MATERIAL = {
  FARM: '', // Version v8.0
  NCC: 'ZSFX,ZFVC,ZTDG', // Version v8.0
};

// BTP Loại 2
export const BTP_L2_GRADE = 20;
export const BTP_L2_MATERIAL = 'ZSFG,ZSFX';

export const TYPE_SUPERVIOR = {
  NONE: 0, // Bình thường
  BY_CODE: 1, // Chuyển mã
  BY_PRODUCT: 2, // By Product
};

export const TYPE_PROCESSING = {
  LUU_KHO: 1000, // Lưu kho
  SO_CHE: 2000, // Sơ chế
};

export const GET_LEADTIME_REGULAR = 'fc40/BBGHDetails/GET_LEADTIME_REGULAR';
export const GET_LEADTIME_SUCCESS = 'fc40/BBGHDetails/GET_LEADTIME_SUCCESS';
export const CHANGE_SELECTED_UNIT_SUCCESS =
  'fc40/BBGHDetails/CHANGE_SELECTED_UNIT_SUCCESS';

export const TYPE_PLANT = {
  HO: 1,
  Farm: 2, // Bên nhận hàng là Farm
  NSC: 4, // Bên nhận hàng là NSC
};

export const NUM_PER_PAGE = 10; // Số lượng dòng khi khởi tạo

export const BASKETS_TYPE = {
  PXKS: 2, // Đang chờ tiếp nhận
  PNKS: 1, // Đã tiếp nhận
};
