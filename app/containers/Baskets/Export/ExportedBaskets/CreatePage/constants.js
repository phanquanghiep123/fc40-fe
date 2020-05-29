/*
 *
 * ExportedBaskets constants
 *
 */

export const DEFAULT_ACTION = 'app/ExportedBaskets/DEFAULT_ACTION';
export const CHANGE_TYPE_SAGA = 'app/ExportedBaskets/CHANGE_TYPE_SAGA';
export const CHANGE_DELIVER = 'app/ExportedBaskets/CHANGE_DELIVER';
export const GET_BASKET_LOCATORS_SUCCESS =
  'app/ExportedBaskets/GET_BASKET_LOCATORS_SUCCESS';
export const GET_BASKET_LOCATORS = 'app/ExportedBaskets/GET_BASKET_LOCATORS';
export const CHANGE_TYPE = 'app/ExportedBaskets/CHANGE_TYPE';
export const ADD_ROWS = 'app/ExportedBaskets/ADD_ROWS';
export const DELETE_ROW = 'app/ExportedBaskets/DELETE_ROWS';
export const DELETE_ROW_SERVER = 'app/ExportedBaskets/DELETE_ROW_SERVER';
export const DELETE_ROW_SERVER_SUCCESS =
  'app/ExportedBaskets/DELETE_ROW_SERVER_SUCCESS ';
export const UPDATE_BASKET_DOCUMENT_DETAILS =
  'fc40/ExportedBaskets/UPDATE_BASKET_DOCUMENT_DETAILS';
export const UPDATE_BASKET_DOCUMENT_DETAILS_SUCCESS =
  'fc40/ExportedBaskets/UPDATE_BASKET_DOCUMENT_DETAILS_SUCCESS';
export const CHANGE_FIELD = 'app/ExportedBaskets/CHANGE_FIELD';
export const GET_VALUE_FORM = 'app/ExportedBaskets/GET_VALUE_FORM';
export const GET_VALUE_FORM_SUCCESS =
  'app/ExportedBaskets/GET_VALUE_FORM_SUCCESS';
export const INIT_VALUE = 'app/ExportedBaskets/INIT_VALUE';
export const GET_BASKETS = 'app/ExportedBaskets/GET_BASKETS';
export const CHANGE_DELIVERY_ORDER =
  'app/ExportedBaskets/CHANGE_DELIVERY_ORDER';
export const CHANGE_SELL_DOCUMENT = 'app/ExportedBaskets/CHANGE_SELL_DOCUMENT';
export const CHANGE_GET_BASKETS_CODE =
  'app/ExportedBaskets/CHANGE_GET_BASKETS_CODE';
export const CHANGE_USER = 'app/ExportedBaskets/CHANGE_USER';
export const GET_DELIVERY_ORDER = 'fc40/ExportedBaskets/GET_DELIVERY_ORDER';
export const GET_DELIVERY_ORDER_SUCCESS =
  'fc40/ExportedBaskets/GET_DELIVERY_ORDER_SUCCESS';
export const GET_RECEIVER = 'fc40/ExportedBaskets/GET_RECEIVER';
export const BASKETS_SAVE_COMPLETE =
  'fc40/ExportedBaskets/BASKETS_SAVE_COMPLETE';
export const FETCH_AUTOCOMPLETE = 'app/ExportedBaskets/FETCH_AUTOCOMPLETE';
export const EXPORT_PDF = 'app/ExportedBaskets/EXPORT_PDF';
export const PRINT_PREVIEW = 'app/ExportedBaskets/PRINT_PREVIEW';
export const RESET_BASKETS_DETAIL = 'app/ExportedBaskets/RESET_BASKETS_DETAIL';
export const RESET_DELIVERY_ORDER = 'app/ExportedBaskets/RESET_DELIVERY_ORDER';
export const GET_LOAN_BASKET = 'app/ExportedBaskets/GET_LOAN_BASKET';
export const GET_LOAN_BASKET_SUCCESS =
  'app/ExportedBaskets/GET_LOAN_BASKET_SUCCESS';
export const RESET_DOCUMENT_SELL = 'app/ExportedBaskets/RESET_DOCUMENT_SELL';

// For Cancellation Export Receipt - Phiếu xuất huỷ khay sọt
export const FETCH_CANCEL_REQUESTS_AC =
  'app/ExportedBaskets/FETCH_CANCEL_REQUESTS_AC';
export const FETCH_CANCEL_RECEIPT_BY_REQUEST_ID =
  'app/ExportedBaskets/FETCH_CANCEL_RECEIPT_BY_REQUEST_ID'; // fetch by request id
export const FETCH_CANCEL_RECEIPT_BY_REQUEST_ID_SUCCESS =
  'app/ExportedBaskets/FETCH_CANCEL_RECEIPT_BY_REQUEST_ID_SUCCESS';
export const FETCH_CANCEL_RECEIPT_BY_ID =
  'app/ExportedBaskets/FETCH_CANCEL_RECEIPT_BY_ID'; // fetch by receipt id

export const FETCH_BIG_IMAGE_BASKET =
  'app/ExportedBaskets/FETCH_BIG_IMAGE_BASKET';
export const SUBMIT_SAVE_CANCEL_RECEIPT =
  'app/ExportedBaskets/SUBMIT_SAVE_CANCEL_RECEIPT'; // submit api lưu phiếu huỷ
export const SUBMIT_COMPLETE_CANCEL_RECEIPT =
  'app/ExportedBaskets/SUBMIT_COMPLETE_CANCEL_RECEIPT'; // submit api hoàn thành phiếu huỷ
export const PRINT_CANCEL_RECEIPT = 'app/ExportedBaskets/PRINT_CANCEL_RECEIPT'; // in/xem trước phiếu

export const TYPE_ACTION = {
  BASKETS_SAVE: 1, // Hành động Nhập kho
  BASKETS_COMPLETE: 2, // Hành động Hoàn thành
};

export const TYPE_EXPORTED = {
  TYPE_TRANSFER: 'transfer',
  TYPE_LOAN: 'loan',
  TYPE_REFUND: 'refund',
};
export const TYPE_FORM = {
  CREATE: '1',
  EDIT: '2',
  VIEW: '3',
  CONFIRM: '4',
};
// [{"description":null,"name":"Xuất hủy","id":21},
// {"description":null,"name":"Xuất điều chuyển","id":22},
// {"description":null,"name":"Xuất mượn khay sọt","id":23}
// ,{"description":null,"name":"Xuất trả khay sọt","id":24}
// ,{"description":null,"name":"Xuất điều chỉnh","id":25},
// {"description":null,"name":"Xuất chuyển nội bộ","id":26},
// {"description":null,"name":"Xuất kho đi đường","id":27}]
export const TYPE_PXKS = {
  PXKS_HUY: 21,
  PXKS_DIEU_CHUYEN: 22,
  PXKS_MUON: 23,
  PXKS_TRA: 24,
  PXKS_DIEU_CHINH: 25,
  PXKS_NOI_BO: 26,
  PXKS_DI_DUONG: 27,
};

export const REFER_TYPE = {
  // "1: Tạo từ BBGH / BBGNHH
  FROM_BBGH_BBGHNHH: 1,
  // 2: Tham chiếu từ BBGH/BBGNHH
  REFER_BBGH_BBGHNHH: 2,
  // 3: Tạo từ BBGH Khay sọt"
  FROM_BBGHKS: 3,
};
