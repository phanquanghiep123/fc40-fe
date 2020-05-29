/*
 *
 * ImportedBasketsTray reducer
 *
 */

import { fromJS } from 'immutable';
import { get } from 'lodash';
import * as constants from './constants';
import { formDataSchema } from '../CC_Retail/ListPage/FormSection/formats';

const values = {
  basketDocumentCode: '',
  importType: null,
  filterBasket: '',
  status: null,
  deliver: '0',
  receiver: '0',
  userId: '',
  doCode: '',
  ToDate: new Date(),
  FromDate: null,
  ids: [],
  deliverType: null,
  orgCodes: '',
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
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

function importedBasketsTrayReducer(state = initialState, action) {
  switch (action.type) {
    case constants.DEFAULT_ACTION:
      return state;
    case constants.FETCH_FORM_DATA_SUCCESS:
      return state.setIn(['form', 'data'], action.formData);
    case constants.GET_FORM_DATA_SUCCESS: {
      const type = get(action.formData, 'status[0]', '');
      const org = get(action.formData, 'org', '');
      const orgDefault = org.length === 1 ? org[0] : '';
      return state
        .setIn(['form', 'data'], action.formData)
        .setIn(['form', 'defaultValues', 'status'], type)
        .setIn(['form', 'defaultValues', 'receiver'], orgDefault);
    }
    case constants.CHANGE_SELECTION:
      return state.setIn(['table', 'selectedRecords'], action.data);
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData);
    }
    case constants.DELETE_RECORD_SUCCESS: {
      const newData = state
        .getIn(['table', 'data'])
        .filter(record => record.basketDocumentId !== action.id);
      return state.setIn(['table', 'data'], newData);
    }
    default:
      return state;
  }
}

export default importedBasketsTrayReducer;
