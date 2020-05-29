import { OPEN_WEIGHT_POPUP, SET_INIT_WEIGHT_POPUP } from './constants';

/**
 * Open Weight Popup
 * @param {object} weightData
 */
export function openWeightPopup(weightData, callback) {
  return {
    type: OPEN_WEIGHT_POPUP,
    weightData,
    callback,
  };
}

/**
 * Set init Weight Popup
 * @param {object} weightData
 */
export function setInitWeightPopup(weightData) {
  return {
    type: SET_INIT_WEIGHT_POPUP,
    weightData,
  };
}
