import { fromJS } from 'immutable';

import { withLoading } from 'utils/sagaUtils';

import { masterRoutine, receiptsRoutine, productsRoutine } from './routines';

// Initial state
export const initialState = fromJS({
  master: {
    organizations: [], // Danh sách đơn vị nhận hàng
    differentTypes: [], // Trạng thái điều chỉnh
    orgCodes: '', // List of all organizations separated by commas
  },

  // Danh sách phiếu điều chỉnh
  receipts: {
    data: [],
  },

  // Danh sách sản phẩm điều chỉnh
  products: {
    data: [],
    documentId: null,
  },
});

// Define reducer
export function baseReducer(state = initialState, action) {
  switch (action.type) {
    case masterRoutine.SUCCESS:
      return state
        .setIn(
          ['master', 'organizations'],
          fromJS(action.payload.organizations),
        )
        .setIn(
          ['master', 'differentTypes'],
          fromJS(action.payload.differentTypes),
        )
        .setIn(['master', 'orgCodes'], fromJS(action.payload.orgCodes));

    case receiptsRoutine.SUCCESS:
      return state.setIn(['receipts', 'data'], fromJS(action.payload.data));

    case productsRoutine.REQUEST:
      return state
        .setIn(['products', 'data'], fromJS([]))
        .setIn(['products', 'documentId'], fromJS(null));

    case productsRoutine.SUCCESS:
      return state
        .setIn(['products', 'data'], fromJS(action.payload.data))
        .setIn(['products', 'documentId'], fromJS(action.payload.documentId));

    default:
      return state;
  }
}

export default withLoading(baseReducer);
