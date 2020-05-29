/*
 *
 * WeightDialog reducer
 *
 */

import { fromJS } from 'immutable';
import { GET_BASKETS_PALLETS_SUCCESS } from './constants';

export const initialState = fromJS({
  data: {
    turnToScales: [],
    basketPallet: {},
  },
  baskets: [],
  pallets: [],
});

function weightDialogReducer(state = initialState, action) {
  switch (action.type) {
    case GET_BASKETS_PALLETS_SUCCESS:
      return state
        .set('baskets', action.payload.baskets)
        .set('pallets', action.payload.pallets);
    default:
      return state;
  }
}

export default weightDialogReducer;
