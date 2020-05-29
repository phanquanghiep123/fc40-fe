/*
 *
 * InventoryBasket actions
 *
 */
import * as constants from './constants';

export function initFormData(data) {
  return {
    type: constants.GET_INIT_FORM_DATA,
    data,
  };
}
export function initFormDataSuccess(data) {
  return {
    type: constants.GET_INIT_FORM_DATA_SUCCESS,
    data,
  };
}
export function initValue(data) {
  return {
    type: constants.INIT_VALUE,
    data,
  };
}
export function create(data, callback) {
  return {
    type: constants.CREATE,
    data,
    callback,
  };
}
export function update(data, callback) {
  return {
    type: constants.UPDATE,
    data,
    callback,
  };
}
export function complete(data, callback) {
  return {
    type: constants.COMPLETE,
    data,
    callback,
  };
}
export function addUser(data) {
  return {
    type: constants.ADD_USER,
    data,
  };
}
export function addBasket(data) {
  return {
    type: constants.ADD_BASKET,
    data,
  };
}
export function changeField(data, field) {
  return {
    type: constants.CHANGE_FIELD,
    data,
    field,
  };
}
export function changeForm(data) {
  return {
    type: constants.CHANGE_FORM,
    data,
  };
}
export function getLocator(data) {
  return {
    type: constants.GET_LOCATOR,
    data,
  };
}
export function getLocatorSuccess(data) {
  return {
    type: constants.GET_LOCATOR_SUCCESS,
    data,
  };
}
export function changePlant(data) {
  return {
    type: constants.CHANGE_PLANT,
    data,
  };
}
export function getSection4(data, form) {
  return {
    type: constants.GET_SECTION4,
    data,
    form,
  };
}
export function filterSection4(data) {
  return {
    type: constants.FILTER_SECTION4,
    data,
  };
}
export function getSection5(data) {
  return {
    type: constants.GET_SECTION5,
    data,
  };
}
export function getSection4Success(data, form) {
  return {
    type: constants.GET_SECTION4_SUCCESS,
    data,
    form,
  };
}

export function getSection5Success(data) {
  return {
    type: constants.GET_SECTION5_SUCCESS,
    data,
  };
}
export function updateDetailCommand(data, field) {
  return {
    type: constants.UPDATE_DETAILS_COMMAND,
    data,
    field,
  };
}
export function removeRecordSection3(data) {
  return {
    type: constants.REMOVE_RECORD_SECTION3,
    data,
  };
}
export function removeRecordSection3Success(data) {
  return {
    type: constants.REMOVE_RECORD_SECTION3_SUCCESS,
    data,
  };
}
export function removeRecordSection4(data) {
  return {
    type: constants.REMOVE_RECORD_SECTION4,
    data,
  };
}
export function removeRecordSection4Success(data) {
  return {
    type: constants.REMOVE_RECORD_SECTION4_SUCCESS,
    data,
  };
}

export function getQuantity(data, callback) {
  return {
    type: constants.GET_QUANTITY,
    data,
    callback,
  };
}

export function getQuantitySuccess(data) {
  return {
    type: constants.GET_QUANTITY_SUCCESS,
    data,
  };
}

export function cancel(data, callback) {
  return {
    type: constants.CANCEL,
    data,
    callback,
  };
}

export function completeInventory(data) {
  return {
    type: constants.COMPLETE_INVENTORY,
    data,
  };
}

export function completeInventorySuccess(data) {
  return {
    type: constants.COMPLETE_INVENTORY_SUCCESS,
    data,
  };
}

export function getLocatorByBasket(data, callback) {
  return {
    type: constants.GET_LOCATOR_BY_BASKET,
    data,
    callback,
  };
}

export function getLocatorByBasketSuccess(data) {
  return {
    type: constants.GET_LOCATOR_BY_BASKET_SUCCESS,
    data,
  };
}

export function setBtnSubmit(data) {
  return {
    type: constants.SET_BTN_SUBMIT,
    data,
  };
}

export function print(data) {
  return {
    type: constants.PRINT,
    data,
  };
}
