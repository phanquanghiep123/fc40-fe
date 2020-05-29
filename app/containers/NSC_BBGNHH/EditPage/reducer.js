import { fromJS } from 'immutable';

import { bbgnhhRoutine } from './routines';

import Schema from '../CreatePage/Schema';

export const initialState = fromJS({
  // Form BBGNHH
  initialSchema: Schema.cast(),
});

export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    case bbgnhhRoutine.REQUEST:
      return state
        .setIn(['initialSchema', 'createDate'], new Date())
        .setIn(['initialSchema', 'deliveryDate'], new Date())
        .setIn(
          ['initialSchema', 'deliveryReceiptTransports', 'actualDepartureDate'],
          new Date(),
        );

    case bbgnhhRoutine.SUCCESS:
      return state.set('initialSchema', fromJS(action.payload.initialSchema));

    default:
      return state;
  }
}
