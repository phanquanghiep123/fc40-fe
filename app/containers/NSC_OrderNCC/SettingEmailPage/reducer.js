import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './Schema';

const currentDayAtMidnight = new Date();
currentDayAtMidnight.setHours(0, 0, 0, 0);

export const initialState = fromJS({
  form: {
    data: {
      ...formDataSchema,
    },
    submittedValues: {
      regionList: [],
      email: '',
      ccListEmail: [],
      carbonCopies: [],
      subject: '',
      header: '',
      body: '',
      signature: '',
      isActive: null,
    },
    defaultValues: {
      regionList: [],
      email: '',
      ccListEmail: [],
      carbonCopies: [],
      subject: '',
      header: '',
      body: '',
      signature: '',
      isActive: null,
    },
    suggestEmail: [],
    table: {
      data: [],
      selectedRecords: [],
    },
  },
});

function totalWeightReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData);
    }
    case constants.FETCH_FORM_DATA_SUCCESS: {
      return state.setIn(['form', 'defaultValues'], action.data); // set default status code
    }
    case constants.INPUT_FORM_SUCCESS: {
      return state.setIn(['form', 'suggestEmail'], action.data);
    }
    default:
      return state;
  }
}

export default totalWeightReducer;
