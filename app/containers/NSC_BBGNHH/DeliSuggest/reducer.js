import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './schema';
const currentDate = new Date();

export const initialState = fromJS({
  form: {
    data: {
      ...formDataSchema,
    },
    submittedValues: {},
    defaultValues: {
      deliver: null,
      routeFrom: '',
      routeTo: '',
      processDate: currentDate,
      deliveryReceiptStocks: null,
    },
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function deliSuggestReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      return state
        .setIn(['form', 'data'], action.data)
        .setIn(
          ['form', 'defaultValues', 'deliveryReceiptStocks'],
          action.data.deliveryReceiptStocks,
        )
        .setIn(
          ['form', 'defaultValues', 'processDate'],
          action.data.processDate,
        )
        .setIn(
          ['form', 'defaultValues', 'deliver'],
          action.data.deliver[0].value,
        );
    }
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'selectedRecords'], action.tableData);
    }
    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);
    case constants.CHANGE_SELECTION:
      return state.setIn(['table', 'selectedRecords'], action.data);
    default:
      return state;
  }
}

export default deliSuggestReducer;
