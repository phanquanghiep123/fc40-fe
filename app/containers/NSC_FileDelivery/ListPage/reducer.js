import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();

export const initialState = fromJS({
  form: {
    data: {
      plantCode: [],
    },
    defaultValues: {
      plantCode: '',
      productCode: '',
      productName: '',
      customer: null,
      processDate: currentDate,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function fileDeliveryReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS:
      return state
        .setIn(['form', 'data', 'plantCode'], action.data.plantCode)
        .setIn(
          ['form', 'defaultValues', 'plantCode'],
          action.data.plantCode[1] ? action.data.plantCode[1].value : '0',
        );
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

export default fileDeliveryReducer;
