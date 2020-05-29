import { fromJS } from 'immutable';

import { GET_INIT_BBGH_SUCCESS } from './constants';
import { initSchema } from './Schema';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';

// The initial state of the App
export const initialState = fromJS({
  typeUserEdit: null, // Bên giao/Bên nhận
  bbghEdit: fromJS(initSchema),
  isQLNH: false,
});

function bbghDetailReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INIT_BBGH_SUCCESS:
      return state
        .set(
          'bbghEdit',
          fromJS({
            ...initSchema,
            ...action.BBGH.resEditBBGH,
          }),
        )
        .set('isQLNH', action.BBGH.resEditBBGH.doType === TYPE_BBGH.NCC_TO_NSC)
        .set('typeUserEdit', action.BBGH.resEditBBGH.deliverOrReceiver);
    default:
      return state;
  }
}

export default bbghDetailReducer;
