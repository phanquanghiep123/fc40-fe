/*
 *
 * AdjustStockTaking reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  form: {
    values: {
      cancelBaskets: [],
      assetCancels: [],
      newBaskets: [],
      waitingCancelBaskets: [],
      documents: [],
      initAssetTable: {},
      assetInfo: [],
      cancelBasketAdjusteds: [],
      assetCancelAdjusteds: [],
      newBasketAdjusteds: [],
    },
  },
  formOption: {
    users: [],
    reasonCancel: [],
  },
});

function adjustStockTakingReducer(state = initialState, action) {
  switch (action.type) {
    case constants.GET_VALUE_FORM_SUCCESS: {
      return state
        .setIn(['formOption', 'users'], action.payload.users)
        .setIn(['formOption', 'reasonCancel'], action.payload.cause);
    }
    case constants.INIT_VALUE: {
      return state.setIn(['form', 'values'], fromJS(action.payload));
    }
    case constants.CHANGE_VALUE_ASSET: {
      return state.setIn(
        ['form', 'values', 'initAssetTable'],
        fromJS(action.payload),
      );
    }
    case constants.FETCH_POPUP_TABLE_DATA_SUCCESS: {
      const { filters } = action.payload;
      let totalPrice = 0;
      filters.forEach(item => {
        totalPrice += item.cancelQuantity * item.currentUnitPrice;
      });
      return state
        .setIn(['form', 'values', 'assetInfo'], fromJS(action.payload.filters))
        .setIn(
          ['form', 'values', 'initAssetTable', 'assetInfo'],
          fromJS(action.payload.filters),
        )
        .setIn(['form', 'values', 'initAssetTable', 'cancelValue'], totalPrice);
    }
    case constants.UPDATE_BASKET_CANCEL_DETAIL: {
      return state.setIn(
        ['form', 'values', action.payload.table, action.payload.index],
        fromJS(action.payload.data),
      );
    }
    case constants.CHANGE_FIELD: {
      return state.setIn(
        ['form', 'values', action.payload.field],
        fromJS(action.payload.value),
      );
    }
    case constants.CHANGE_IMAGES_TABLE: {
      return state.setIn(
        ['form', 'values', action.payload.table, action.payload.index],
        fromJS(action.payload.data),
      );
    }
    case constants.MERGE_ASSET_TABLE: {
      return state.setIn(
        ['form', 'values', 'assetCancels'],
        fromJS(action.payload.data),
      );
    }
    case constants.CHANGE_REASON_ASSET: {
      return state.setIn(
        ['form', 'values', action.payload.table],
        fromJS(action.payload.data),
      );
    }

    default:
      return state;
  }
}

export default adjustStockTakingReducer;
