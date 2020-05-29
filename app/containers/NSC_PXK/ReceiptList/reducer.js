import { fromJS } from 'immutable';

import { withLoading } from 'utils/sagaUtils';

import {
  getDefaultScale,
  getTotalQuantity,
} from 'components/GoodsWeight/utils';

import {
  masterRoutine,
  productRoutine,
  receiptsRoutine,
  productsRoutine,
} from './routines';

import WeightSchema from './WeightPopup/Schema';

import { SET_INIT_WEIGHT_POPUP } from './constants';

// Initial state
export const initialState = fromJS({
  master: {
    baskets: [], // Danh sách Khay sọt
    pallets: [], // Danh sách Pallet
    organizations: [], // Danh sách Đơn vị
  },

  // Danh sách phiếu cân
  receipts: {
    data: [],
    recently: [],
  },

  // Danh sách sản phẩm cân
  products: {
    data: [],
  },

  // Sản phẩm cân
  product: {
    loading: false,
    data: WeightSchema.cast(),
  },
});

// Define reducer
export function baseReducer(state = initialState, action) {
  switch (action.type) {
    case masterRoutine.SUCCESS:
      return state
        .setIn(['master', 'baskets'], fromJS(action.payload.baskets))
        .setIn(['master', 'pallets'], fromJS(action.payload.pallets))
        .setIn(
          ['master', 'organizations'],
          fromJS(action.payload.organizations),
        );

    case receiptsRoutine.SUCCESS:
      return state
        .setIn(['receipts', 'data'], fromJS(action.payload.data))
        .setIn(['receipts', 'recently'], fromJS(action.payload.recently));

    case productsRoutine.SUCCESS:
      return state.setIn(['products', 'data'], fromJS(action.payload.data));

    case productRoutine.SUCCESS: {
      const baskets = state.getIn(['master', 'baskets']);
      const pallets = state.getIn(['master', 'pallets']);

      return state
        .setIn(
          ['product', 'data', 'basketPallet'],
          fromJS(
            getDefaultScale(
              action.payload.data,
              baskets.toJS(),
              pallets.toJS(),
            ),
          ),
        )
        .setIn(
          ['product', 'data', 'exportedQuantity'],
          getTotalQuantity(action.payload.data),
        )
        .setIn(
          ['product', 'data', 'turnToScales'],
          fromJS(action.payload.data),
        );
    }

    case SET_INIT_WEIGHT_POPUP: {
      const baskets = state.getIn(['master', 'baskets']);
      const pallets = state.getIn(['master', 'pallets']);

      const weightData = WeightSchema.cast(action.weightData, {
        stripUnknown: true,
      });

      return state
        .setIn(['product', 'data'], fromJS(weightData))
        .setIn(
          ['product', 'data', 'basketPallet'],
          fromJS(getDefaultScale(null, baskets.toJS(), pallets.toJS())),
        );
    }

    default:
      return state;
  }
}

export default withLoading(baseReducer);
