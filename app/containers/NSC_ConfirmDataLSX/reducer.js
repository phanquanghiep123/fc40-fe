import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  form: {
    data: {
      org: [],
      weighingEmployee: ' ',
    },
    submittedValues: {
      org: '',
      weighingEmployee: ' ',
    },
    defaultValues: {
      org: [],
      weighingEmployee: ' ',
      unConfirmAndNotPv: true,
      unConfirmAndHasPv: true,
      confirmed: true,
    },
  },
  table: {
    data: [],
    originalData: [],
  },
});

function confirmDataLSXReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_ORG_LIST_SUCCESS: {
      return state
        .setIn(['form', 'data'], { ...action.formData })
        .setIn(['form', 'defaultValues', 'org'], action.formData.org[0].value)
        .setIn(
          ['form', 'defaultValues', 'weighingEmployee'],
          action.formData.weighingEmployee,
        )
        .setIn(
          ['form', 'submittedValues', 'weighingEmployee'],
          action.formData.weighingEmployee,
        );
    }

    case constants.FETCH_TABLE_DATA_SUCCESS: {
      return state
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'originalData'], action.tableData)
        .setIn(['form', 'submittedValues', 'org'], action.formValues.org)
        .setIn(
          ['form', 'submittedValues', 'unConfirmAndNotPv'],
          action.formValues.unConfirmAndNotPv,
        )
        .setIn(
          ['form', 'submittedValues', 'unConfirmAndHasPv'],
          action.formValues.unConfirmAndHasPv,
        )
        .setIn(
          ['form', 'submittedValues', 'confirmed'],
          action.formValues.confirmed,
        );
    }

    case constants.UPDATE_TABLE_DATA: {
      return state.setIn(['table', 'data'], action.tableData);
    }
    default:
      return state;
  }
}

export default confirmDataLSXReducer;
