/*
 *
 * ListBbkk reducer
 *
 */

import { fromJS } from 'immutable';
import { localstoreUtilites } from 'utils/persistenceData';
import { get } from 'lodash';
import { formDataSchema } from './FormSection/format';
import * as constants from './constants';
const auth = localstoreUtilites.getAuthFromLocalStorage();

const values = {
  basketStockTakingCode: null,
  stageKK: null,
  status: 0,
  afterStatus: null,
  typeKK: null,
  userId: {
    value: auth.meta.userId,
    label: auth.meta.fullName,
  },
  unitKK: '',
  unitKKCodes: null,
  ToDate: new Date(),
  FromDate: null,
  userKK: '',
  ids: [],
  basketDocumentCode: null,
  pageSize: 5,
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

function listBbkkReducer(state = initialState, action) {
  switch (action.type) {
    case constants.DEFAULT_ACTION:
      return state;

    case constants.GET_FORM_DATA_SUCCESS: {
      const org = get(action.formData, 'unitKK', '');
      const orgDefault = org.length === 1 ? org : '';
      return state
        .setIn(['form', 'data'], action.formData)
        .setIn(['form', 'defaultValues', 'unitKK'], orgDefault)
        .setIn(['form', 'submittedValues', 'unitKK'], orgDefault);
    }
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData);
    }

    case constants.DELETE_RECORD_SUCCESS: {
      const newData = state
        .getIn(['table', 'data'])
        .filter(record => record.id !== action.id);
      return state.setIn(['table', 'data'], newData);
    }

    default:
      return state;
  }
}

export default listBbkkReducer;
