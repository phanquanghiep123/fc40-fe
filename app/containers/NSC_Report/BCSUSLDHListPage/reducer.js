import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();
const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

export const initialState = fromJS({
  form: {
    data: {
      org: [],
    },
    defaultValues: {
      org: '',
      deliverName: '',
      productName: '',
      deliverCodes: '',
      productCode: null,
      importedDateFrom: firstDay,
      importedDateTo: currentDate,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
  },
});

function BCDUSLDHReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { data } = action;
      return state
        .setIn(['form', 'data'], action.data)
        .setIn(
          ['form', 'defaultValues', 'org'],
          data.org.length ? data.org[0].value : '',
        );
    }
    case constants.DELETE_RECORD_SUCCESS: {
      const newData = state
        .getIn(['table', 'data'])
        .filter(record => record.id !== action.id);
      return state.setIn(['table', 'data'], newData);
    }
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData);
    }
    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);
    default:
      return state;
  }
}

export default BCDUSLDHReducer;
