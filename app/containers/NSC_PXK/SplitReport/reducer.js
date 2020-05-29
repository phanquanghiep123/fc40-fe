import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';

const currentDayAtMidnight = new Date();
// currentDayAtMidnight.setHours(0, 0, 0, 0);
export const initialState = fromJS({
  form: {
    data: {
      ...formDataSchema,
    },
    submittedValues: {},
    defaultValues: {
      org: '',
      planningCode: '',
      processDate: currentDayAtMidnight,
      customer: '',
      productName: '',
    },
  },
  table: {
    data: [],
    total: null,
  },
});

function splitReportReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_ORG_LIST_SUCCESS: {
      return state
        .setIn(['form', 'data', 'org'], action.orgList)
        .setIn(['form', 'defaultValues', 'org'], action.defaultOrg.value);
    }
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'total'], action.tableTotal);
    }
    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);
    default:
      return state;
  }
}

export default splitReportReducer;
