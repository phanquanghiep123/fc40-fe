import * as constants from './constants';

export function fetchFormData(pageType, history, match) {
  return {
    type: constants.FETCH_FORM_DATA,
    pageType,
    history,
    match,
  };
}

export function fetchFormDataSuccess(formData) {
  return {
    type: constants.FETCH_FORM_DATA_SUCCESS,
    formData,
  };
}

export function fetchRequester(keyword, callback) {
  return {
    type: constants.FETCH_REQUESTER,
    keyword,
    callback,
  };
}

export function fetchApprover(keyword, isBasket, callback) {
  return {
    type: constants.FETCH_APPROVER,
    keyword,
    isBasket,
    callback,
  };
}

export function fetchAccumulatedValue(pageType, formValues, callback) {
  return {
    type: constants.FETCH_ACCUMULATED_VALUE,
    pageType,
    formValues,
    callback,
  };
}

export function fetchProductsAutocomplete(orgCode, keyword, callback) {
  return {
    type: constants.FETCH_PRODUCTS_AUTOCOMPLETE,
    orgCode,
    keyword,
    callback,
  };
}

export function updateFormValues(fieldName, value) {
  return {
    type: constants.UPDATE_FORM_VALUES,
    fieldName,
    value,
  };
}

/**
 * Get info of the receipt
 * @param id
 * @param pageType
 * @param {boolean} isBasket
 * @param callback
 * @returns {{pageType: *, id: *, type: string}}
 */
export function fetchReceiptData(id, pageType, isBasket, callback = undefined) {
  return {
    type: constants.FETCH_RECEIPT_DATA,
    id,
    pageType,
    isBasket,
    callback,
  };
}

export function fetchReceiptDataSuccess(receiptData) {
  return {
    type: constants.FETCH_RECEIPT_DATA_SUCCESS,
    receiptData,
  };
}

/**
 * Submit on Page Create Receipt
 * @param data
 * @param isBasket
 * @param callback
 * @returns {{data: *, callback: *, type: string}}
 */
export function submitCreateReceipt(data, isBasket, callback) {
  return {
    type: constants.SUBMIT_CREATE_RECEIPT,
    data,
    isBasket,
    callback,
  };
}

/**
 * @param id
 * @param data
 * @param isBasket
 * @param callback
 * @return {{data: *, isBasket: *, callback: *, id: *, type: string}}
 */
export function submitEditReceipt(id, data, isBasket, callback) {
  return {
    type: constants.SUBMIT_EDIT_RECEIPT,
    id,
    data,
    isBasket,
    callback,
  };
}

/**
 * @param id
 * @param data
 * @param isBasket
 * @param callback
 * @return {{data: *, isBasket: *, callback: *, id: *, type: string}}
 */
export function submitApproveReceipt(id, data, isBasket, callback) {
  return {
    type: constants.SUBMIT_APPROVE_RECEIPT,
    id,
    data,
    isBasket,
    callback,
  };
}

/**
 * @param id
 * @param data
 * @param isBasket
 * @param callback
 * @return {{data: *, isBasket: *, callback: *, id: *, type: string}}
 */
export function submitReApproveReceipt(id, data, isBasket, callback) {
  return {
    type: constants.SUBMIT_REAPPROVE_RECEIPT,
    id,
    data,
    isBasket,
    callback,
  };
}

export function fetchBigImage(id, callback, isRefactorImage) {
  return {
    type: constants.FETCH_BIG_IMAGE,
    id,
    callback,
    isRefactorImage,
  };
}
export function fetchBigImageRefer(id, callback) {
  return {
    type: constants.FETCH_REFER_IMAGE,
    id,
    callback,
  };
}

export function fetchBigImageBasket(id, callback) {
  return {
    type: constants.FETCH_BIG_IMAGE_BASKET,
    id,
    callback,
  };
}

export function deleteProduct(rowData, callback) {
  return {
    type: constants.DELETE_PRODUCT,
    rowData,
    callback,
  };
}

/**
 * Fetch Mã tài sản autocomplete
 * @param orgCode
 * @param inputText
 * @param callback
 * @returns {{payload: {orgCode: *, inputText: *, callback: *}, type: string}}
 */
export function fetchAssetAC(orgCode, inputText, callback) {
  return {
    type: constants.FETCH_ASSET_AC,
    payload: { orgCode, inputText, callback },
  };
}

/**
 * Fetch nguyên nhân huỷ cho tài sản
 * @param reasonCode - mã lý do huỷ
 * @param callback
 * @returns {{payload: {inputText: *, callback: *, reasonCode: *}, type: string}}
 */
export function fetchCauseAsset(reasonCode, callback = undefined) {
  return {
    type: constants.FETCH_CAUSE_ASSET,
    payload: { reasonCode, callback },
  };
}

/**
 * @param data - data nguyên nhân huỷ cho tài sản
 * @returns {{payload: {reasonCode: *}, type: string}}
 */
export function fetchCauseAssetSuccess(data) {
  return {
    type: constants.FETCH_CAUSE_ASSET_SUCCESS,
    payload: { data },
  };
}

/**
 * Fetch mã khay sọt ở popup chọn tài sản
 * @param formik - main formik
 * @param {Object} basketLocatorCode - kho nguồn mặc định hoặc được chọn ở popup
 * @param callback
 * @returns {{payload: {inputText: *, callback: *}, type: string}}
 */
export function fetchPopupBasket(
  formik,
  basketLocatorCode,
  isEdit,
  data,
  callback = undefined,
) {
  return {
    type: constants.FETCH_POPUP_BASKET,
    payload: { formik, basketLocatorCode, isEdit, data, callback },
  };
}

/**
 * Fetch mã khay sọt theo kho nguồn
 * @param formik - main formik
 * @param basketLocatorCode - mã kho nguồn
 * @param inputText
 * @param callback
 * @returns {{payload: {inputText: *, callback: *}, type: string}}
 */
export function fetchBasketByLocatorAC(
  formik,
  basketLocatorCode,
  inputText,
  callback = undefined,
) {
  return {
    type: constants.FETCH_BASKET_BY_LOCATOR_AC,
    payload: { formik, basketLocatorCode, inputText, callback },
  };
}

/**
 * Store popup basket data to store
 * @param data
 * @return {{payload: {data: *}, type: string}}
 */
export function fetchPopupBasketSuccess(data) {
  return {
    type: constants.FETCH_POPUP_BASKET_SUCCESS,
    payload: { data },
  };
}

/**
 * Fetch table data for popup basket selection
 * @param filters
 * @param assetsTable
 * @param callback
 * @return {{payload: {callback: *, filters: *, assetsTable: *}, type: string}}
 */
export function fetchPopupTableData(filters, assetsTable, callback) {
  return {
    type: constants.FETCH_POPUP_TABLE_DATA,
    payload: { filters, assetsTable, callback },
  };
}

/**
 * Delete basket
 * @param rowData
 * @param callback
 * @return {{rowData: *, callback: *, type: string}}
 */
export function deleteAsset(rowData, callback) {
  return {
    type: constants.DELETE_ASSET,
    rowData,
    callback,
  };
}

/**
 * Fetch basketLocators - lấy danh sách kho nguồn theo đơn vị
 * @param filters - form values
 * @param callback
 * @return {{rowData: *, callback: *, type: string}}
 */
export function fetchBasketLocators(filters, callback = undefined) {
  return {
    type: constants.FETCH_BASKET_LOCATORS,
    payload: { filters, callback },
  };
}

/**
 * Fetch basketLocators - lấy danh sách kho nguồn theo đơn vị - for autocomplete field
 * @param filters - form values
 * @param callback
 * @return {{rowData: *, callback: *, type: string}}
 */
export function fetchBasketLocatorsAC(filters, callback = undefined) {
  return {
    type: constants.FETCH_BASKET_LOCATORS_AC,
    payload: { filters, callback },
  };
}

export function fetchBasketLocatorsSuccess(data) {
  return {
    type: constants.FETCH_BASKET_LOCATORS_SUCCESS,
    payload: { data },
  };
}

export function discardReceipt(id) {
  return {
    type: constants.DISCARD_RECEIPT,
    payload: { id },
  };
}

/**
 * @param {string} id - receiptId
 * @param {boolean} isPreview
 * @param {boolean} isRePrint - true -> trường hợp in lại
 * @param {function} callback
 * @returns {{callback: *, type: string, selectedRecords: *}}
 */
export function printReceipt(
  id,
  isPreview = false,
  isRePrint = false,
  callback = undefined,
) {
  return {
    type: constants.PRINT_RECEIPT,
    payload: { id, isPreview, isRePrint, callback },
  };
}

/**
 * Fetch options trạng thái
 * @param pageType
 * @param receiptId
 * @param isBasket
 * @return {{payload: {pageType: *, isBasket: *, receiptId: *}, type: string}}
 */
export function fetchStatusData(pageType, receiptId, isBasket) {
  return {
    type: constants.FETCH_STATUS_DATA,
    payload: { pageType, receiptId, isBasket },
  };
}

export function fetchStatusDataSuccess(data) {
  return {
    type: constants.FETCH_STATUS_DATA_SUCCESS,
    payload: { data },
  };
}

/**
 * Check if draft status is selected
 */
export function checkIsDraftSelected(isDraftSelected) {
  return {
    type: constants.CHECK_IS_DRAFT_SELECTED,
    payload: { isDraftSelected },
  };
}
