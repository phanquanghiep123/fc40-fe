import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';

const values = {
  org: [],
  date: new Date(),
  pageSize: 5,
  pageIndex: 0,
  totalItem: 0,
  isRuning: false,
  Sort: ['-processDay'],
};

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    defaultValues: values,
    submittedValues: values,
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function HistoryInventoryReportListPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData: dt } = action;
      const defaultValues = {
        ...values,
        org: dt.org && dt.org.length ? [dt.org[0].value] : [],
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
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'selectedRecords'], []);
    case constants.CHANGE_ORDER: {
      return state.setIn(['form', 'submittedValues'], action.submittedValues);
    }
    default:
      return state;
  }
}

export default HistoryInventoryReportListPageReducer;
