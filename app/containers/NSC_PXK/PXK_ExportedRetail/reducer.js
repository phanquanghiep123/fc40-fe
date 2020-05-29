import { fromJS } from 'immutable';
import { mappingState } from 'utils/reducerUtils';
import * as constants from './constants';

export const initialState = fromJS({
  businessObjects: [],
  paymentTypes: [],
  exportTypes: [],
  units: [],
  transporters: [],
  warehouse: [],
  packingStyles: [],
  retailTypes: [],
});

function exportedRetailReducer(state = initialState, action) {
  switch (action.type) {
    case constants.UPDATE_REDUCER_PXK:
      return mappingState(state, action.data);
    case constants.GET_WAREHOUSES_SUCCESS:
      return state.set('warehouse', action.res.warehouse);
    default:
      return state;
  }
}

export default exportedRetailReducer;
