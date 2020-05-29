import { fromJS } from 'immutable';

import { UPDATE_BBGH_SUCCESS, GET_INIT_BBGH_SUCCESS } from './constants';
import { initSchema } from './Schema';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';

// The initial state of the App
export const initialState = fromJS({
  typeUserEdit: null, // Bên giao/Bên nhận
  suppliers: [],
  leadtimes: [],
  bbghEdit: fromJS(initSchema),
  isQLNH: false,
  vehicleRoutes: [],
});

function bbghDetailReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INIT_BBGH_SUCCESS:
      return state
        .set('suppliers', fromJS(action.BBGH.suppliers))
        .set('leadtimes', fromJS(action.BBGH.leadtimes))
        .set('reasons', fromJS(action.BBGH.reasons))
        .set('vehiclePallets', fromJS(action.BBGH.vehiclePallets))
        .set('chipTemperatureStatus', fromJS(action.BBGH.chipTemperatureStatus))
        .set('shippingLeadtime', fromJS(action.BBGH.shippingLeadtime))
        .set('vehicleCleaning', fromJS(action.BBGH.vehicleCleaning))
        .set('temperatureStatus', fromJS(action.BBGH.temperatureStatus))
        .set(
          'bbghEdit',
          fromJS({
            ...initSchema,
            ...action.BBGH.resEditBBGH,
          }),
        )
        .set('vehicleRoutes', fromJS(action.BBGH.resVehicleRoute))
        .set('isQLNH', action.BBGH.resEditBBGH.doType === TYPE_BBGH.NCC_TO_NSC)
        .set('typeUserEdit', action.BBGH.resEditBBGH.deliverOrReceiver);
    case UPDATE_BBGH_SUCCESS:
      return state.set('bbghEdit', fromJS(initSchema));
    default:
      return state;
  }
}

export default bbghDetailReducer;
