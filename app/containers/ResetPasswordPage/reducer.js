import { fromJS } from 'immutable';
import { RESET_SUCCESS } from './constants';

export const initialState = fromJS({ resetSuccess: false });
function resetPasswordReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_SUCCESS:
      return state.set('resetSuccess', true);
    default:
      return state;
  }
}

export default resetPasswordReducer;
