import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();
const init = {
  status: 0,
  warnings: 0,
  documentCode: '',
  deliveryOrderCode: '',
  exportDateFrom: currentDate,
  exportDateTo: currentDate,
  receivedDateFrom: null,
  receivedDateTo: null,
  palletBasket: '',
  org: '',
  roles: 0,
  orgReceived: '',
  orgDeliver: '',
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
};

export const initialState = fromJS({
  form: {
    data: {
      status: [],
      warnings: [],
      roles: [],
      palletBaskets: [],
      currentOrgs: [],
      orgs: [],
    },
    defaultValues: init,
    submittedValues: init,
    isSubmitted: false,
  },
  table: {
    data: [],
    totalRow: {},
  },
});

function palletBasketReportReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const data = action.payload;

      return state
        .setIn(['form', 'data'], data)
        .setIn(['form', 'isSubmitted'], true);
    }

    case constants.FETCH_REPORT_DATA_SUCCESS: {
      const data = action.payload;
      return state
        .setIn(['table', 'data'], data.table)
        .setIn(['table', 'totalRow'], data.totalRow)
        .setIn(['form', 'submittedValues'], data.submittedValues);
    }

    default:
      return state;
  }
}

export default palletBasketReportReducer;
