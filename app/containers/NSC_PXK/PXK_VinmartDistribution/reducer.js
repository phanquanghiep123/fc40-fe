import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

export const initialState = fromJS({
  form: {
    data: {
      org: [],
      mappingValues: {},
    },
    defaultValues: {
      org: '',
      date: currentDate,
      customer: null,
      isCreatingReceipt: false, // true => khi click button tạo phiếu xuất bán
      soldToVinmart: null, // SL chia cho VM
      soldToVinmartPlus: null, // SL chia cho VM+
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [{}],
    originalData: [], // will NOT be modified
  },
});

function vinmartDistributionReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const data = action.formData;
      return state
        .setIn(['form', 'data', 'org'], data.org)
        .setIn(['form', 'data', 'mappingValues'], data.mappingValues)
        .setIn(
          ['form', 'defaultValues', 'org'],
          data.org && data.org[0] ? data.org[0] : '',
        );
    }

    case constants.FETCH_TABLE_DATA_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.formValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'originalData'], action.tableData);
    }

    case constants.UPDATE_TABLE_DATA: {
      if (action.formValues) {
        return state
          .setIn(['form', 'submittedValues'], action.formValues)
          .setIn(['table', 'data'], action.tableData);
      }
      return state.setIn(['table', 'data'], action.tableData);
    }

    default:
      return state;
  }
}

export default vinmartDistributionReducer;
