/*
 *
 * BasketUsingFrequenceCalculation reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  paramsSearchPopup: {
    plantCode: [],
    date: new Date(),
    pageSize: 10,
    pageIndex: 0,
  },
  formData: {},
  tablePopup: [],
});

function basketUsingFrequenceCalculationReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SEARCH_POPUP_SUCCESS: {
      return state
        .set('tablePopup', fromJS(action.res))
        .set('paramsSearchPopup', fromJS(action.paramsSearchPopup));
    }
    case constants.FETCH_FORM_SUCCESS: {
      return state.set('formData', fromJS(action.payload.formData));
    }
    default:
      return state;
  }
}

export default basketUsingFrequenceCalculationReducer;
