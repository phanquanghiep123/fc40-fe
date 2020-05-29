import { fromJS } from 'immutable';
import * as constants from './constants';
const currentDate = new Date();

export const initialState = fromJS({
  form: {
    data: {},
    defaultValues: {
      processingDate: currentDate,
    },
  },
  table: {
    processingDate: {},
    data: [],
  },
});

function pickingListPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FILE_LIST_SUCCESS:
      return state.setIn(['table', 'data'], action.tableData);
    case constants.FETCH_PROCESSING_DATE:
      return state.setIn(['table', 'processingDate'], action.professingDate);
    default:
      return state;
  }
}

export default pickingListPageReducer;
