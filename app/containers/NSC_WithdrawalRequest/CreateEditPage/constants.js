import { PATH_GATEWAY } from 'utils/request';

import {
  CREATE_NEW,
  VIEW_ISSUE,
  EDIT_ISSUE,
  APPROVE_ISSUE,
  REAPPROVE_ISSUE,
} from './messages';

// ***************************************
// #region style classes

export const PR3_CLASS = 'pr3';
export const TEXT_ALIGN_CENTER_CLASS = 'center';
export const TEXT_ALIGN_RIGHT_CLASS = 'right-align';

export const CELL_HEADER_CLASS = 'pl3';
export const CELL_NUMBER_CLASS = `${PR3_CLASS} ${TEXT_ALIGN_RIGHT_CLASS}`;

// #endregion

// Page types
export const CREATE = 'CREATE';
export const EDIT = 'EDIT';
export const VIEW = 'VIEW';
export const APPROVE = 'APPROVE';
export const REAPPROVE = 'REAPPROVE';

export const PAGE_TYPE_MAP = {
  'tao-moi-yeu-cau-ban-xa': {
    type: CREATE,
    title: CREATE_NEW,
  },
  sua: {
    type: EDIT,
    title: EDIT_ISSUE,
  },
  xem: {
    type: VIEW,
    title: VIEW_ISSUE,
  },
  duyet: {
    type: APPROVE,
    title: APPROVE_ISSUE,
  },
  'duyet-lai': {
    type: REAPPROVE,
    title: REAPPROVE_ISSUE,
  },
};

// Request status
export const IN_PROGRESS = 1;
export const NOT_APPROVED = 2;
export const APPROVED = 3;

export const DEFAULT_BUSINESS_OBJECT = 1; // Kinh doanh bán tại cơ sở
export const DEFAULT_PAYMENT_TYPE = 1; // cash

// export const DEFAULT_SUPPLIER_CODE = '2001'; // Tam Đảo

// ***************************************
// #region API URLs

export const IMPORT_EXCEL_FILE = `${
  PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
}/exported-retail-request/import-retail-request-detail`;

export const GET_USERS_API = `${PATH_GATEWAY.AUTHENTICATION_API}/users`;

export const GET_CUSTOMERS_API = `${
  PATH_GATEWAY.RESOURCEPLANNING_API
}/customer/autocomplete-distinct-retail`;

export const GET_RETAIL_CUSTOMERS_API = `${
  PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
}/exportedstockreceipts/export-retail-retail-customer`;

export const GET_REGIONS_API = `${PATH_GATEWAY.AUTHORIZATION_API}/regions`;
export const GET_PRODUCTS_API = `${
  PATH_GATEWAY.RESOURCEPLANNING_API
}/products/product-by-plant-code`;

export const CREATE_WITHDRAWAL_REQUEST_API = `${
  PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
}/exported-retail-request/create-exported-retail-request`;

export const UPDATE_WITHDRAWAL_REQUEST_API = `${
  PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
}/exported-retail-request/update-exported-retail-request`;

export const REAPPROVE_WITHDRAWAL_REQUEST_API = `${
  PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
}/exported-retail-request/reapprove-retail-request`;

export const APPROVE_REQUEST_API = `${
  PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
}/exported-retail-request/approve-retail-request`;

// #endregion

export const WITHDRAWAL_ISSUE_CHANNEL = '20';
export const NUMBER_LOCALE_FORMAT = 'en';
export const DATETIME_LOCALE_FORMAT = 'vi';
