import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    defaultValues: {
      supplierCode: '',
      supplierName: '',
      supplierType: '0',
      email: '',
      contractCode: '',
      contractType: '',
      regionCode: '0',
      source: '0',
      postingBlock: '0',
      purchBlock: '0',
      pageIndex: 0,
      pageSize: 5,
      totalItem: 0,
    },
    submittedValues: {
      supplierCode: '',
      supplierName: '',
      supplierType: '0',
      email: '',
      contractCode: '',
      contractType: '',
      regionCode: '0',
      source: '0',
      postingBlock: '0',
      purchBlock: '0',
      pageIndex: 0,
      pageSize: 5,
      totalItem: 0,
    },
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function SupplierListPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      return state;
    }

    case constants.FETCH_DELIVERY_ORG_SUCCESS: {
      const oldData = state.getIn(['form', 'data']);
      const newData = {
        ...oldData,
        deliverOrgCode: action.fieldData,
      };
      return state.setIn(['form', 'data'], newData);
    }

    case constants.SUBMIT_FORM_SUCCESS:
      return state
        .setIn(['table', 'data'], action.tableData)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'selectedRecords'], []);

    case constants.CHANGE_SELECTION:
      return state.setIn(['table', 'selectedRecords'], action.data);

    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);

    case constants.DELETE_RECORD_SUCCESS: {
      const newData = state
        .getIn(['table', 'data'])
        .filter(record => record.id !== action.recordId);

      return state.setIn(['table', 'data'], newData);
    }

    default:
      return state;
  }
}

export default SupplierListPageReducer;
