import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();

export const initialState = fromJS({
  form: {
    data: {
      org: [],
      type: [],
    },
    defaultValues: {
      org: '',
      code: '',
      deliveryReceiptType: '',
      creatorCode: '',
      customer: null,
      deliveryDateFrom: currentDate,
      deliveryDateTo: currentDate,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function totalWeightReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { data } = action;
      return state
        .setIn(['form', 'data'], action.data)
        .setIn(
          ['form', 'defaultValues', 'org'],
          data.org.length > 1 ? data.org[1].value : data.org[0].value || '',
        )
        .setIn(
          ['form', 'defaultValues', 'deliveryReceiptType'],
          data.type[0] && (data.type[0].value || data.type[0].value === 0)
            ? data.type[0].value
            : '',
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
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'selectedRecords'], []);
    }
    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);
    case constants.CHANGE_SELECTION:
      return state.setIn(['table', 'selectedRecords'], action.data);
    default:
      return state;
  }
}

export default totalWeightReducer;
