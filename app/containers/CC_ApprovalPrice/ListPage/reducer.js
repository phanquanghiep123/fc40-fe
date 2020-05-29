import { fromJS } from 'immutable';
import { get } from 'lodash';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';

const values = {
  org: '0',
  DateFrom: new Date(),
  DateTo: new Date(),
  RegionProductionCode: '0',
  RegionConsumeCode: '0',
  orgCodes: '',
  productCode: null,
  totalItem: 0,
  sort: 'plantCode',
  pageSize: 5,
  pageIndex: 0,
  orgList: [],
  regionList: [],
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
  },
});

function ApprovalPriceListReducer(state = initialState, action) {
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
        .setIn(['form', 'defaultValues', 'RegionProductionCode'], regionValue)
        .setIn(['form', 'defaultValues', 'RegionConsumeCode'], regionValue);
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
        .setIn(['table', 'data'], action.tableData);

    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);
    default:
      return state;
  }
}

export default ApprovalPriceListReducer;
