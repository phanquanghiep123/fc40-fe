import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';
import { initialSchema } from './FormSection/schema';

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    defaultValues: initialSchema,
    submittedValues: initialSchema,
    isSubmitted: true,
  },
  table: {
    data: [],
    selectedRecords: [],
    totalRowData: [],
  },
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData: dt } = action;
      const defaultValues = {
        ...initialSchema,
        org: dt.org && dt.org.length ? [dt.org[0].value] : [],
        status: dt.status && dt.status.length ? [dt.status[0].value] : [],
      };
      return state
        .setIn(['form', 'data'], dt)
        .setIn(['form', 'defaultValues'], defaultValues);
    }
    case constants.GET_FORM_DATA_SUCCESS: {
      return state.setIn(['form', 'data'], action.formData);
    }
    case constants.SUBMIT_FORM_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'totalRowData'], action.totalRow)
        .setIn(['table', 'selectedRecords'], []);
    default:
      return state;
  }
}

export default reducer;
