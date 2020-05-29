import { fromJS } from 'immutable';

import { masterRoutine, importFilesRoutine } from './routines';

import { FormSearchSchema } from './Schema';

// Initial state
export const initialState = fromJS({
  master: {
    // Vùng miền
    regions: [],

    // Loại đặt hàng
    orderTypes: [],
  },

  // Tìm kiếm File import
  formSearch: FormSearchSchema.cast(),

  // Danh sách File import
  importFiles: {
    data: [],
  },
});

// Define reducer
export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    case masterRoutine.REQUEST: {
      if (action.payload.isReset) {
        return initialState;
      }
      return state;
    }

    case masterRoutine.SUCCESS:
      return state
        .setIn(['master', 'regions'], fromJS(action.payload.regions))
        .setIn(['master', 'orderTypes'], fromJS(action.payload.orderTypes));

    case importFilesRoutine.SUCCESS:
      return state
        .set('formSearch', fromJS(action.payload.formSearch))
        .setIn(['importFiles', 'data'], fromJS(action.payload.data));

    default:
      return state;
  }
}
