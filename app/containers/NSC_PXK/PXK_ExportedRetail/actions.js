import * as constants from './constants';

/**
 * @return {object}
 * Init information of PXK page
 */
export function getInitPXK(callback) {
  return {
    type: constants.GET_INIT_PXK,
    callback,
  };
}

/**
 *
 * @param {*} res : object
 */
export function getInitPXKSucess(res) {
  return {
    type: constants.GET_INIT_PXK_SUCCESS,
    res,
  };
}

export function initExportSellSuccess(data) {
  return {
    type: constants.GET_EXPORT_SELL_SUCCESS,
    data,
  };
}

export function onGetBasketMangagers(inputText, callback) {
  return {
    type: constants.GET_BASKET_MANGAGERS,
    inputText,
    callback,
  };
}

export function getReceiverSuccess(data) {
  return {
    type: constants.GET_RECEIVER_SUCCCESS,
    data,
  };
}

export function getWarehousesSucess(res) {
  return {
    type: constants.GET_WAREHOUSES_SUCCESS,
    res,
  };
}

/**
 *
 * @param {*} params object
 * {options: object, inputText: string, callback: function}
 *
 * @description
 * action get autocomplete for 'Mã sản phẩm'
 */
export function getProducts(params) {
  return {
    type: constants.GET_PRODUCTS,
    params,
  };
}

/**
 * @param {values: object} body post
 * @param {callback: function} function is called when success
 */
export function save(values, callback) {
  return {
    type: constants.SAVE,
    values,
    callback,
  };
}

/**
 * @param {values: object} body post
 * @param {callback: function} function is called when success
 */
export function savePXK(values, callback) {
  return {
    type: constants.SAVE_PXK,
    values,
    callback,
  };
}

/**
 *
 * @param {*} params : object {id: int}
 * @param {*} callback : function is called when success
 */
export function deleteRow(params, callback) {
  return {
    type: constants.DELETE_ROW,
    params,
    callback,
  };
}

/**
 * @param {values: object} body post
 * @param {location: string} current path pxk
 */
export function completePXK(values, location) {
  return {
    type: constants.COMPLETE_PXK,
    values,
    location,
  };
}

export function savePXKSuccess(res) {
  return {
    type: constants.SAVE_PXK_SUCCESS,
    res,
  };
}

/**
 * @description
 * autocomplete get users
 */
export function getUsers(inputText, callback) {
  return {
    type: constants.GET_USERS,
    inputText,
    callback,
  };
}

/**
 * @description
 * get list request destroy
 */
export function getListRequestDestroy(plantCode) {
  return {
    type: constants.GET_LIST_REQUEST_DESTROY,
    plantCode,
  };
}

/**
 * @description
 * save list request destroy
 */
export function saveDestroyList(data) {
  return {
    type: constants.SAVE_LIST_REQUEST_DESTROY,
    data,
  };
}

/**
 * @description
 * save list request destroy
 */
export function saveDestroyItem(destroyDetail) {
  return {
    type: constants.SAVE_DESTROY_ITEMS,
    destroyDetail,
  };
}

/**
 * @param{params: object} {id: int, type: constants.int}
 * id: phiếu xuất kho
 * type: constants.loại phiếu xuất kho
 *
 * @description:
 * lấy dữ liệu cho edit/view
 */
export function getPXKbyId(params) {
  return {
    type: constants.GET_PXK_BY_ID,
    params,
  };
}

/**
 * @param {res: object} dữ liệu trả về từ api view/edit
 *
 * @description
 * action cập nhật lại initSchema
 */
export function getPXKByIdSuccess(res) {
  return {
    type: constants.GET_PXK_BY_ID_SUCCESS,
    res,
  };
}

export function getBasketAuto(inputText, callback) {
  return {
    type: constants.GET_BASKET_AUTO,
    inputText,
    callback,
  };
}

// ------------------------------------
export function getBusinessObject() {
  return {
    type: constants.GET_BUSINESS_OBJECTS,
  };
}

export function getPaymentTypes() {
  return {
    type: constants.GET_PAYMENT_TYPES,
  };
}

export function getPackingStypes() {
  return {
    type: constants.GET_PACKING_STYPES,
  };
}

export function getRetailTypes() {
  return {
    type: constants.GET_RETAIL_TYPES,
  };
}

export function updateReducer(data) {
  return {
    type: constants.UPDATE_REDUCER_PXK,
    data,
  };
}

export function getCustomerCode(inputText, callback) {
  return {
    type: constants.GET_CUSTOMER_CODE_AUTO,
    inputText,
    callback,
  };
}

export function getRetailCustomer(inputText, callback, soldTo) {
  return {
    type: constants.GET_RETAIL_CUSTOMER,
    inputText,
    callback,
    soldTo,
  };
}

/**
 *
 * @param {*} plantId : int / plant is select
 *
 * @description
 * get all warehouse of plant is selected
 */
export function getWarehouses(plantId) {
  return {
    type: constants.GET_WAREHOUSES,
    plantId,
  };
}
