import { fromJS } from 'immutable';
// import * as constants from '../constants';
import { masterRoutine } from '../routine';

// Initial state
export const initialState = fromJS({
  master: {
    // Đơn vị
    plants: [],
  },

  // Thông tin file
  nameFile: '',
  uploadingFile: '',
});

// Define reducer
export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case masterRoutine.SUCCESS:
      return state.setIn(['master', 'plants'], fromJS(action.payload.plants));

    default:
      return state;
  }
}
