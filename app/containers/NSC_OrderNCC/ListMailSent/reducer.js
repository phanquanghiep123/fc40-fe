import { fromJS } from 'immutable';

import { masterRoutine, suppliersRoutine } from './routines';

import { FormSearchSchema } from './Schema';
import SentResultSchema from './SentResult/Schema';

import { SEND_MAIL, SEND_MAIL_SUCCESS } from './constants';

export const initialState = fromJS({
  master: {
    // Vùng tiêu thụ của file
    regions: [],

    // Danh sách NCC của file
    suppliers: [],

    // Trạng thái gửi mail
    sendStatus: [],
  },

  // Id Import
  importId: null,

  // Danh sách NCC
  suppliers: {
    data: [],
  },

  // Tìm kiếm NCC
  formSearch: FormSearchSchema.cast(),

  // Kết quả gửi mail
  sentResult: SentResultSchema.cast(),
});

export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_MAIL:
      return state.set('sentResult', fromJS(SentResultSchema.cast()));

    case SEND_MAIL_SUCCESS:
      return state.set('sentResult', fromJS(action.payload));

    case masterRoutine.REQUEST:
      return initialState;

    case masterRoutine.SUCCESS:
      return state
        .set('importId', fromJS(action.payload.importId))
        .setIn(['master', 'regions'], fromJS(action.payload.regions))
        .setIn(['master', 'suppliers'], fromJS(action.payload.suppliers))
        .setIn(['master', 'sendStatus'], fromJS(action.payload.sendStatus));

    case suppliersRoutine.SUCCESS:
      return state
        .set('formSearch', fromJS(action.payload.formSearch))
        .setIn(['suppliers', 'data'], fromJS(action.payload.data));

    default:
      return state;
  }
}
