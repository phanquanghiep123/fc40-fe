import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export const initialState = fromJS({
  form: {
    data: {
      org: [],
    },
    defaultValues: {
      org: '',
      dateFrom: currentDate,
      dateTo: currentDate,

      pageSize: 5,
      pageIndex: 0,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
  },
});

function proceedProductionReportReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData: dt } = action;
      const defaultValues = {
        org: dt.org.length ? dt.org[0].value : '',
      };

      return state
        .setIn(['form', 'data'], dt)
        .setIn(['form', 'defaultValues', 'org'], defaultValues.org);
    }

    case constants.FETCH_TABLE_DATA_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData);
    }

    default:
      return state;
  }
}

export default proceedProductionReportReducer;
