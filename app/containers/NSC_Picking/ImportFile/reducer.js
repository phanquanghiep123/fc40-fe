import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  showInfo: false,
  fileInfo: {},
});

function totalWeightReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FORM_VALUES_CHANGE:
    case constants.SUBMIT_FILE:
      return state.set('showInfo', false);

    case constants.SUBMIT_FILE_SUCCESS:
      return state
        .set('fileInfo', fromJS(action.fileInfo))
        .set('showInfo', true);

    default:
      return state;
  }
}

export default totalWeightReducer;
