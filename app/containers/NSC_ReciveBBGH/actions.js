import {
  SET_MASTER_CODE,
  SET_DELIVERY_ORDER,
  GET_INIT_RECEIVING_DELIVERY_ORDER,
  SUBMIT_FORM,
  SET_LEAD_TIME,
  RESTORE_REGULATED_LEADTIME,
  SET_INIT_RECEIVING_DELEVERY_ORDER,
  GET_RECEIVING_PERSON_AUTOCOMPLETE,
  UPDATE_RECEIVING_DELIVERY_ORDER_SUCCESS,
  TO_PREVIOUS_PAGE,
  SAVE_CREATE_IMPORT,
} from './constants';

export function initReceivingDeliveryOrder(id, shipperId) {
  return {
    type: GET_INIT_RECEIVING_DELIVERY_ORDER,
    id,
    shipperId,
  };
}

export function setDeliveryOrder(deliveryOrder) {
  return {
    type: SET_DELIVERY_ORDER,
    deliveryOrder,
  };
}

export function setMasterCode(masterCode) {
  return {
    type: SET_MASTER_CODE,
    masterCode,
  };
}

export function submitForm(id, form, callback, path) {
  return {
    type: SUBMIT_FORM,
    id,
    form,
    callback,
    path,
  };
}

export function setLeadTime(leadTime) {
  return {
    type: SET_LEAD_TIME,
    leadTime,
  };
}

export function setInitReceivingDO(
  deliveryOrder,
  masterCode,
  leadTime,
  vehicleRoute,
  checkDocument,
) {
  return {
    type: SET_INIT_RECEIVING_DELEVERY_ORDER,
    deliveryOrder,
    masterCode,
    leadTime,
    vehicleRoute,
    checkDocument,
  };
}

export function restoreRegulatedLeadtime() {
  return {
    type: RESTORE_REGULATED_LEADTIME,
  };
}

export function getReceivingPerson(callback, orgId, inputText) {
  return {
    type: GET_RECEIVING_PERSON_AUTOCOMPLETE,
    callback,
    orgId,
    inputText,
  };
}

export function updateReceivingDeliveryOrderSuccess(res) {
  return {
    type: UPDATE_RECEIVING_DELIVERY_ORDER_SUCCESS,
    res,
  };
}

export function backToPreviousPage() {
  return {
    type: TO_PREVIOUS_PAGE,
  };
}

export function saveCreateImport(form, callback) {
  return {
    type: SAVE_CREATE_IMPORT,
    form,
    callback,
  };
}
