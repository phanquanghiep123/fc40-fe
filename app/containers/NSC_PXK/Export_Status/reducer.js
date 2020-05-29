import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './schema';

const currentDayAtMidnight = new Date();
currentDayAtMidnight.setHours(0, 0, 0, 0);

export const initialState = fromJS({
  form: {
    data: {
      ...formDataSchema,
    },
    submittedValues: {},
    defaultValues: {
      org: '',
      planCode: '',
      processingDate: '',
      custom: '',
      goods: '',
    },
    table: {
      data: [],
    },
  },
});

function totalWeightReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_ORG_LIST_SUCCESS: {
      return state
        .setIn(['form', 'data', 'org'], action.orgList)
        .setIn(['form', 'defaultValues', 'org'], action.defaultOrg.value);
    }
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData);
    }
    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);
    default:
      return state;
  }
}

export default totalWeightReducer;
