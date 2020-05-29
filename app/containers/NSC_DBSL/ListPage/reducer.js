import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';
import { initialSchema } from './FormSection/schema';
export const initialState = fromJS({
  form: {
    data: formDataSchema,
    defaultValues: initialSchema,
    submittedValues: initialSchema,
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});
function OutputPorecastsListReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SUBMIT_FORM_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'selectedRecords'], []);

    case constants.CHANGE_ORDER: {
      return state.setIn(['form', 'submittedValues'], action.submittedValues);
    }
    case constants.CHANGE_FROM_TO_FARM: {
      return state
        .setIn(['form', 'submittedValues.farmIdFrom'], action.farmIdFrom)
        .setIn(['form', 'submittedValues.farmIdTo'], action.farmIdTo);
    }
    case constants.GET_FORM_DATA_SUCCESS: {
      return state.setIn(['form', 'data'], action.formData);
    }
    case constants.SET_DATE_BEFORE: {
      return state.setIn(
        ['form', 'submittedValues', 'numberShowColumnDate'],
        action.numberShowColumnDate,
      );
    }
    case constants.PAGING_INIT:
      return state
        .setIn(['form', 'isSubmitted'], false)
        .setIn(['form', 'submittedValues'], action.submittedValues);
    case constants.PAGING_SUCCESS:
      return state.setIn(['table', 'data'], action.tableData);

    default:
      return state;
  }
}

export default OutputPorecastsListReducer;
