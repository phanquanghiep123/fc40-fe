/*
 * BBGH details Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 *
 */

import {
  CHANGE_TYPE_BBGH,
  GET_FARM_NSC_AUTO,
  CREATE_BBGH_FARM,
  CREATE_BBGH_SUCCESS,
  GET_INIT_CREATED_BBGH,
  GET_INIT_CREATED_BBGH_SUCCESS,
  GET_USER_AUTOCOMPLETE,
  CHANGE_SELECTED_UNIT,
  ALERT_INVALID_WHEN_SUBMIT,
  GET_PROD_ORDER_AUTO,
  GET_FARM_PRODUCT_AUTO,
  GET_FINISH_PRODUCTS_AUTO,
  GET_SHIPPER_AUTO,
  GET_LEADTIME_SUCCESS,
  GET_LEADTIME_REGULAR,
  CHANGE_SELECTED_UNIT_SUCCESS,
  GET_PLAN_AUTO,
  GET_SUGGEST_SEARCH,
  SET_DATA_SUGGEST_SEARCH,
  SET_SUBMIT_SUGGEST_SEARCH,
  GET_PROD_ORDER_BY_SUGGEST_AUTO,
} from './constants';

/**
 * Create BBGH details
 *
 * @param {BBGH: object} get from form UI
 * @param {organizationType: number} NSC/Farm/NCC
 * @param {callback: function} method is called when create BBGH is successful
 *
 * @return {object}
 */
export function createBBGHFarm(BBGH, organizationType, callback) {
  return {
    type: CREATE_BBGH_FARM,
    BBGH,
    organizationType,
    callback,
  };
}

/**
 * Actions is dispatched after request success
 *
 * @param {res: object} response from api
 */
export function createBBGHSuccess(res) {
  return {
    type: CREATE_BBGH_SUCCESS,
    res,
  };
}

export function getInitCreatedBBGH() {
  return {
    type: GET_INIT_CREATED_BBGH,
  };
}

/**
 * @param {resTypeBBGH: object} response from api get typeBBGH
 * @param {resUnitsByUserLogin: object} list unit is got by userId has login
 * @param {schema: object} init schema formik
 * @param {suppliers: array} suppliers section 6
 * @param {unitRegions: object} regions
 * @param {resVehicleRoute: array}
 */
export function getInitCreatedBBGHSuccess(
  resTypeBBGH,
  resUnitsByUserLogin,
  schema,
  suppliers,
  unitRegions,
  resVehicleRoute,
) {
  return {
    type: GET_INIT_CREATED_BBGH_SUCCESS,
    resUnitsByUserLogin,
    resTypeBBGH,
    schema,
    suppliers,
    unitRegions,
    resVehicleRoute,
  };
}

/**
 *
 * @param {inputText: string} string get from input field ui
 * @param {farmNscId?: number} id farm/nsc is selected from Farm/NSC field
 * @param {callback: function} function is called when response from api is successful
 *
 * @description action get autocoplete user on screen
 */
export function getUsersAuto(inputText, farmNscId, callback) {
  return {
    type: GET_USER_AUTOCOMPLETE,
    inputText,
    farmNscId,
    callback,
  };
}

/**
 * @param {typeAuto: int} Farm: 1, NSC: 2
 * @param {inputText: string}
 * @param {callback: function} function is called get response success
 */
export function getFarmNSCAuto(callback, inputText, typeBBGH) {
  return {
    type: GET_FARM_NSC_AUTO,
    inputText,
    typeBBGH,
    callback,
  };
}

/**
 * @param {selectedUnit: number} id of unit is selected
 * @param {callback: function}
 */
export function changeSelectedUnit(selectedUnit, callback) {
  return {
    type: CHANGE_SELECTED_UNIT,
    selectedUnit,
    callback,
  };
}

export function changeTypeBBGH(typebBGH) {
  return {
    type: CHANGE_TYPE_BBGH,
    typebBGH,
  };
}

export function alertInvalidWhenSubmit(message) {
  return {
    type: ALERT_INVALID_WHEN_SUBMIT,
    message,
  };
}

export function getProdOrderAuto(params, inputText, callback) {
  return {
    type: GET_PROD_ORDER_AUTO,
    params,
    inputText,
    callback,
  };
}

export function getFarmProductAuto(params, inputText, callback) {
  return {
    type: GET_FARM_PRODUCT_AUTO,
    params,
    inputText,
    callback,
  };
}
export function getfetchPlanSaga(inputText, callback) {
  return {
    type: GET_PLAN_AUTO,
    inputText,
    callback,
  };
}

export function getFinishProductsAuto(params, inputText, callback) {
  return {
    type: GET_FINISH_PRODUCTS_AUTO,
    params,
    inputText,
    callback,
  };
}

/**
 *
 * @param {inputText: string}
 * @param {callback: function}
 */
export function getShipperAuto(inputText, callback) {
  return {
    type: GET_SHIPPER_AUTO,
    inputText,
    callback,
  };
}

/**
 * @param {leadtimes: array} array listime of reciver and deliver
 */
export function getLeadtimeSuccess(leadtimes) {
  return {
    type: GET_LEADTIME_SUCCESS,
    leadtimes,
  };
}

/**
 * @param {selectedUnit: number} in of unit is selected
 * @param {typesBBGH: array} array of BBGH is got by id of unit
 */
export function changeSelectedUnitSuccess(selectedUnit, typesBBGH) {
  return {
    type: CHANGE_SELECTED_UNIT_SUCCESS,
    selectedUnit,
    typesBBGH,
  };
}

/**
 * @param {deliveryCode: number} id of reciver
 * @param {receiveCode: number} id of reciver
 */
export function getLeadtime(deliveryCode, receiveCode) {
  return {
    type: GET_LEADTIME_REGULAR,
    deliveryCode,
    receiveCode,
  };
}

export function getSuggestSearch(submitValuesSuggest, callback) {
  return {
    type: GET_SUGGEST_SEARCH,
    submitValuesSuggest,
    callback,
  };
}
export function setDataSuggestSearch(dataTableSuggest) {
  return {
    type: SET_DATA_SUGGEST_SEARCH,
    dataTableSuggest,
  };
}

export function changeSubmitSuggest(submitValuesSuggest) {
  return {
    type: SET_SUBMIT_SUGGEST_SEARCH,
    submitValuesSuggest,
  };
}

export function getProdOrderBySuggestAuto(params, inputText, callback) {
  return {
    type: GET_PROD_ORDER_BY_SUGGEST_AUTO,
    params,
    inputText,
    callback,
  };
}
