export const FETCH_FORM_DATA = 'app/CancelRequestDetail/FETCH_FORM_DATA';
export const FETCH_FORM_DATA_SUCCESS =
  'app/CancelRequestDetail/FETCH_FORM_DATA_SUCCESS';
export const FETCH_REQUESTER = 'app/CancelRequestDetail/FETCH_REQUESTER';
export const FETCH_APPROVER = 'app/CancelRequestDetail/FETCH_APPROVER';
export const FETCH_ACCUMULATED_VALUE =
  'app/CancelRequestDetail/FETCH_ACCUMULATED_VALUE';
export const FETCH_PRODUCTS_AUTOCOMPLETE =
  'app/CancelRequestDetail/FETCH_PRODUCTS_AUTOCOMPLETE';
export const UPDATE_FORM_VALUES = 'app/CancelRequestDetail/UPDATE_FORM_VALUES';
export const FETCH_RECEIPT_DATA = 'app/CancelRequestDetail/FETCH_RECEIPT_DATA';
export const FETCH_RECEIPT_DATA_SUCCESS =
  'app/CancelRequestDetail/FETCH_RECEIPT_DATA_SUCCESS';
export const SUBMIT_CREATE_RECEIPT =
  'app/CancelRequestDetail/SUBMIT_CREATE_RECEIPT';
export const SUBMIT_EDIT_RECEIPT =
  'app/CancelRequestDetail/SUBMIT_EDIT_RECEIPT';
export const SUBMIT_APPROVE_RECEIPT =
  'app/CancelRequestDetail/SUBMIT_APPROVE_RECEIPT';
export const SUBMIT_REAPPROVE_RECEIPT =
  'app/CancelRequestDetail/SUBMIT_REAPPROVE_RECEIPT';
export const FETCH_BIG_IMAGE = 'app/CancelRequestDetail/FETCH_BIG_IMAGE';
export const DELETE_PRODUCT = 'app/CancelRequestDetail/DELETE_PRODUCT';
export const FETCH_REFER_IMAGE = 'app/CancelRequestDetail/FETCH_REFER_IMAGE';

export const FETCH_ASSET_AC = 'app/CancelRequestDetail/FETCH_ASSET_AC';
export const FETCH_CAUSE_ASSET = 'app/CancelRequestDetail/FETCH_CAUSE_ASSET'; // nguyên nhân huỷ cho tài sản
export const FETCH_CAUSE_ASSET_SUCCESS =
  'app/CancelRequestDetail/FETCH_CAUSE_ASSET_SUCCESS';
export const FETCH_STATUS_DATA = 'app/CancelRequestDetail/FETCH_STATUS_DATA';
export const FETCH_STATUS_DATA_SUCCESS =
  'app/CancelRequestDetail/FETCH_STATUS_DATA_SUCCESS';

export const FETCH_POPUP_BASKET = 'app/CancelRequestDetail/FETCH_POPUP_BASKET';
export const FETCH_POPUP_BASKET_SUCCESS =
  'app/CancelRequestDetail/FETCH_POPUP_BASKET_SUCCESS';
export const FETCH_POPUP_TABLE_DATA =
  'app/CancelRequestDetail/FETCH_POPUP_TABLE_DATA';
export const DELETE_ASSET = 'app/CancelRequestDetail/DELETE_BASKET';
export const FETCH_BIG_IMAGE_BASKET =
  'app/CancelRequestDetail/FETCH_BIG_IMAGE_BASKET';
export const FETCH_BASKET_LOCATORS =
  'app/CancelRequestDetail/FETCH_BASKET_LOCATORS';
export const FETCH_BASKET_LOCATORS_SUCCESS =
  'app/CancelRequestDetail/FETCH_BASKET_LOCATORS_SUCCESS';
export const FETCH_BASKET_LOCATORS_AC =
  'app/CancelRequestDetail/FETCH_BASKET_LOCATORS_AC';
export const FETCH_BASKET_BY_LOCATOR_AC =
  'app/CancelRequestDetail/FETCH_BASKET_BY_LOCATOR_AC'; // get khay sọt theo kho nguồn
export const DISCARD_RECEIPT = 'app/CancelRequestDetail/DISCARD_RECEIPT'; // huỷ phiếu
export const PRINT_RECEIPT = 'app/CancelRequestDetail/PRINT_RECEIPT'; // in phiếu
export const CHECK_IS_DRAFT_SELECTED =
  'app/CancelRequestDetail/CHECK_IS_DRAFT_SELECTED'; // in phiếu

// Table IDs/Keys
export const GENERAL_INFO_SECTION = 'generalInfoSection';
export const PRODUCT_TABLE = 'products';
export const BASKET_INFO_TABLE = 'basketsInfo';
export const ASSET_TABLE = 'assets';
export const ASSET_TABLE_PINNED = 'assets_pinned';
export const BASKET_INUSE_TABLE = 'basketsInUse';
export const BASKET_INUSE_TABLE_PINNED = 'basketsInUse_pinned';
export const SELECT_BASKET_TABLE = 'selectBaskets';
export const SELECT_BASKET_TABLE_PINNED = 'selectBaskets_pinned';
export const APPROVAL_TABLE = 'approvalInfo';

// Fixed Status Code
export const statusCode = {
  all: 0, // tất cả
  pending: 1, // chờ phê duyệt
  disapproved: 2, // không phê duyệt
  approved: 3, // đã phê duyệt
  exported: 4, // đã xuất
  draft: 5, // nháp
  cancelled: 6, // đã huỷ
};

// Nguồn gốc tạo phiếu tự động
export const originSource = {
  DifferenceExportBorrow: 9, // Tạo tự động từ điều chỉnh chênh lệch xuất cho mượn
  DifferenceExportPay: 10, // Tạo tự động từ điều chỉnh chênh lệch xuất trả
};

export const MAX_INT = 999999999;
