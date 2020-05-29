/*
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

import { clone } from 'lodash';
import { mappingState } from 'utils/reducerUtils';
import { initSchema, validationDestroy } from './Schema';
import * as constants from './constants';

export const initialState = fromJS({
  units: [], // Đơn vị xuất hàng
  receiverUnits: [], // Đơn vị nhận hàng
  exportTypes: [], // Loại xuất kho
  warehouse: [], // Kho nguồn, đích
  sellTypes: [], // Loại Đơn Bán Hàng
  channels: [], // Kênh
  transporters: [], // Nhà Vận Chuyển
  initSchema: clone(initSchema),
  listRequestDestroy: [],
  validationSchema: clone(validationDestroy),
  type: constants.TYPE_PXK.PXK_NOI_BO,
  turnToScales: [],
});

function pxkReducer(state = initialState, action) {
  switch (action.type) {
    case constants.RESET_FORM:
      return state.set('initSchema', fromJS(clone(initSchema)));

    case constants.SAVE_DESTROY_ITEMS:
      return state.set('initSchema', fromJS(action.destroyDetail));
    case constants.SAVE_LIST_REQUEST_DESTROY:
      return state.set('listRequestDestroy', action.data);
    case constants.GET_INIT_PXK_SUCCESS:
      return state.withMutations(map => {
        map
          .set('exportTypes', fromJS(action.res.resTypes))
          .set('units', fromJS(action.res.resUnits))
          .set('receiverUnits', fromJS(action.res.resReceiverUnits))
          .set('initSchema', fromJS(action.res.initSchema))
          .set('validationSchema', fromJS(action.res.validation));
      });
    case constants.GET_WAREHOUSES_SUCCESS:
      return state.set('warehouse', fromJS(action.res.warehouse));
    case constants.GET_EXPORT_SELL_SUCCESS:
      return state.withMutations(map => {
        map
          .set('channels', action.data.channels)
          .set('sellTypes', action.data.sellTypes)
          .set('transporters', action.data.transporters);
      });

    case constants.GET_CHANNEL_SUCCESS:
      return state.set('channels', action.data);

    case constants.GET_RECEIVER_SUCCCESS:
      return state.set('receiverUnits', fromJS(action.data.resReceiverUnits));
    // .setIn(['initSchema', 'receiverCode'], action.data.receiverCode);
    case constants.GET_PXK_BY_ID_SUCCESS:
      return state.withMutations(map => {
        map
          .set('exportTypes', fromJS(action.res.resTypes))
          .set('initSchema', fromJS(action.res.pxk))
          .set('validationSchema', fromJS(action.res.validation));
      });
    case constants.UPDATE_REDUCER_PXK: {
      return mappingState(state, action.data);
    }
    default:
      return state;
  }
}

export default pxkReducer;
