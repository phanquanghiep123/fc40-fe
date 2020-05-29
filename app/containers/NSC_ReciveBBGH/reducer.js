import { fromJS } from 'immutable';
import { initialSchema } from './ReceivingDeliveryOrderSchema';
import {
  SET_INIT_RECEIVING_DELEVERY_ORDER,
  TO_PREVIOUS_PAGE,
} from './constants';
import { mappingMasterCode } from './Utils';

export const initialState = fromJS({
  sealStatusColection: [],
  initialSchema,
  masterCode: {
    status: [],
    sealStatus: [],
    shippingLeadtime: [],
    temperatureStatus: [],
    vehiclePallet: [],
    vehicleCleaning: [],
    reason: [],
  },
  leadTime: [],
  vehicleRoute: [],
  backToPreviousPage: 0,
  checkDocument: {},
});

function ReceivingDeliveryOrder(state = initialState, action) {
  switch (action.type) {
    case TO_PREVIOUS_PAGE:
      return state.set(
        'backToPreviousPage',
        state.get('backToPreviousPage') + 1,
      );
    case SET_INIT_RECEIVING_DELEVERY_ORDER: {
      return state
        .set('initialSchema', fromJS(action.deliveryOrder))
        .set('masterCode', fromJS(mappingMasterCode(action.masterCode)))
        .set('leadTime', action.leadTime)
        .set('vehicleRoute', action.vehicleRoute)
        .set('checkDocument', fromJS(action.checkDocument));
    }

    default:
      return state;
  }
}

export default ReceivingDeliveryOrder;
