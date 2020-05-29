import { fromJS } from 'immutable';
import { get } from 'lodash';

import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';

const initTodayAtMidnight = new Date();

const initValue = {
  org: 0,
  DateFrom: initTodayAtMidnight,
  DateTo: initTodayAtMidnight,
  RegionProductionCode: 0,
  RegionConsumeCode: 0,
  orgCodes: '',
  pageSize: 5,
  pageIndex: 0,
  totalItem: 0,
  productCode: null,
  sort: 'plantCode',
  orgList: [],
  regionList: [],
};

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    defaultValues: initValue,
    submittedValues: initValue,
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function ImportPriceListReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      return state.setIn(['form', 'data'], action.formData);
    }
    case constants.GET_FORM_DATA_SUCCESS: {
      const orgValue = get(action.formData, 'org[0].value', '');
      const regionValue = get(
        action.formData,
        'RegionProductionCode[0].value',
        '',
      );
      return state
        .setIn(['form', 'data'], action.formData)
        .setIn(['form', 'defaultValues', 'org'], orgValue)
        .setIn(['form', 'defaultValues', 'RegionProductionCode'], regionValue);
    }
    case constants.FETCH_DELIVERY_ORG_SUCCESS: {
      const oldData = state.getIn(['form', 'data']);
      const newData = {
        ...oldData,
        deliveryOrg: action.fieldData,
      };
      return state.setIn(['form', 'data'], newData);
    }

    case constants.SUBMIT_FORM_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(
          ['form', 'defaultValues', 'orgList'],
          action.submittedValues.orgList,
        )
        .setIn(
          ['form', 'defaultValues', 'regionList'],
          action.submittedValues.regionList,
        )
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'selectedRecords'], []);

    case constants.CHANGE_SELECTION:
      return state.setIn(['table', 'selectedRecords'], action.data);

    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);

    case constants.DELETE_RECORD_SUCCESS: {
      const newData = state
        .getIn(['table', 'data'])
        .filter(record => record.documentId !== action.recordId);

      return state.setIn(['table', 'data'], newData);
    }
    case constants.CHANGE_ORDER: {
      return state.setIn(['form', 'submittedValues'], action.submittedValues);
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

export default ImportPriceListReducer;
