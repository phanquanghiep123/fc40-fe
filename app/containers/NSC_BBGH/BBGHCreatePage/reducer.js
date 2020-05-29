/*
 * BBGH details Reducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import { get } from 'lodash';
import {
  CHANGE_TYPE_BBGH,
  GET_INIT_CREATED_BBGH_SUCCESS,
  GET_LEADTIME_SUCCESS,
  CHANGE_SELECTED_UNIT_SUCCESS,
  SET_SUBMIT_SUGGEST_SEARCH,
  SET_DATA_SUGGEST_SEARCH,
} from './constants';
import { initialSchema } from './BBGHDetailsSchema';
import { masterRoutine } from './routines';
import { initSubmitValues } from './Dialogs/Schema';
// The initial state of the App
export const initialState = fromJS({
  createdUnits: [{ value: '', label: '' }], // list unit by user login
  typesBBGH: [],
  typeBBGHSelected: null,
  initialSchema,
  unitRegions: [],
  selectedUnit: null,
  selectedRegion: 1,
  // section 6
  suppliers: [],
  leadtimes: [],
  vehicleRoutes: [],
  // section 4
  baskets: [],
  processTypes: [],
  submitValuesSuggest: initSubmitValues,
});
function bbghDetailReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LEADTIME_SUCCESS:
      return state.set('leadtimes', fromJS(action.leadtimes));
    case CHANGE_SELECTED_UNIT_SUCCESS: {
      const indexId = get(action.typesBBGH[0], 'id', 0);
      return state
        .set('selectedUnit', action.selectedUnit)
        .set('typesBBGH', fromJS(action.typesBBGH))
        .set('typeBBGHSelected', indexId);
    }
    case CHANGE_TYPE_BBGH:
      return state.set('typeBBGHSelected', action.typebBGH);
    case GET_INIT_CREATED_BBGH_SUCCESS:
      return state
        .set('selectedUnit', action.resUnitsByUserLogin[0].value)
        .set('initialSchema', fromJS(action.schema))
        .set('typeBBGHSelected', fromJS(action.resTypeBBGH[0].id))
        .set('typesBBGH', fromJS(action.resTypeBBGH))
        .set('suppliers', fromJS(action.suppliers))
        .set('unitRegions', fromJS(action.unitRegions))
        .set('vehicleRoutes', fromJS(action.resVehicleRoute))
        .set('createdUnits', fromJS(action.resUnitsByUserLogin));
    case masterRoutine.SUCCESS:
      return state
        .set('baskets', fromJS(action.payload.baskets))
        .set('reasons', fromJS(action.payload.reasons))
        .set('processTypes', fromJS(action.payload.processTypes));
    case SET_SUBMIT_SUGGEST_SEARCH:
      return state.set('submitValuesSuggest', action.submitValuesSuggest);
    case SET_DATA_SUGGEST_SEARCH:
      return state.set('dataTableSuggest', action.dataTableSuggest);
    default:
      return state;
  }
}

export default bbghDetailReducer;
