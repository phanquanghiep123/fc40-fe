import { fromJS } from 'immutable';
import * as constants from './constants';
import WeighedImportedSchema from '../../NSC_ImportedStockReceipt/WeightPage/Schema';

export const initialState = fromJS({
  master: {
    baskets: [], // Danh sách Khay sọt
    pallets: [], // Danh sách pallet
    organizations: [], // Danh sách Đơn vị
  },
  data: {
    formData: {
      warehouse: [], // Kho nguồn, đích
    },
    receipts: {
      data: [],
    },
    basketPallet: {},
    product: {
      loading: false,
      error: false,
      data: WeighedImportedSchema.cast(),
      deliveryName: '',
      processingTypeName: '',
    },
  },
});

export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    case constants.INIT_MASTER_SUCCESS:
      return state
        .setIn(['master', 'baskets'], fromJS(action.payload.baskets))
        .setIn(['master', 'pallets'], fromJS(action.payload.pallets))
        .setIn(
          ['master', 'organizations'],
          fromJS(action.payload.organizations),
        );
    case constants.GET_WAREHOUSES_SUCCESS:
      return state.setIn(
        ['data', 'formData', 'warehouse'],
        fromJS(action.res.warehouse),
      );
    case constants.GET_INVENTORY_SUCCESS:
      return state.setIn(['receipts', 'data'], fromJS(action.payload.data));
    case constants.INVENTORY_STOCK_SUCCESS: {
      const { turnToScale } = action.payload.data;
      return state.setIn(
        ['product', 'data', 'turnToScale'],
        fromJS(turnToScale),
      );
    }
    default:
      return state;
  }
}
