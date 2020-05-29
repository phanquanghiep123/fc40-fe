import { fromJS } from 'immutable';

export const initialState = fromJS({});

export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
