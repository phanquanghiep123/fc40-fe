import { fromJS } from 'immutable';

import { detailRoutine } from './routines';

export const initialState = fromJS({
  detail: {
    data: {},
  },
});

export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    case detailRoutine.REQUEST:
      return state.setIn(['detail', 'data'], fromJS({}));

    case detailRoutine.SUCCESS:
      return state.setIn(['detail', 'data'], fromJS(action.payload.data));

    default:
      return state;
  }
}
