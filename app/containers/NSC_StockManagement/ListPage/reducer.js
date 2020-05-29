import { fromJS } from 'immutable';
import { get } from 'lodash';
// import { setIn } from 'formik';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';
const values = {
  date: new Date(),
  org: '0',
  FromDate: null,
  ToDate: null,
  locatorCode: '0',
  warningClass: '0',
  warningType: '0',
  plantCode: null,
  productCode: '',
  purposeStorage: '',
  dateRemain: '',
  totalItem: 0,
  sort: 'plantCode',
  originCode: null,
  uom: null,
  pageSize: 10,
  pageIndex: 0,
  regionList: [],
  locators: [],
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
    total: [],
    size: 0,
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
        .setIn(['form', 'data'], fromJS(action.formData))
        .setIn(['form', 'defaultValues', 'plantCode'], orgValue)
        .setIn(['form', 'defaultValues', 'RegionProductionCode'], regionValue)
        .setIn(['form', 'defaultValues', 'RegionConsumeCode'], regionValue);
    }
    case constants.UPDATE_LOCATOR: {
      return state.setIn(['form', 'data', 'locators'], action.locators);
    }
    case constants.FETCH_DELIVERY_ORG_SUCCESS: {
      const oldData = state.getIn(['form', 'data']);
      const newData = {
        ...oldData,
        deliveryOrg: action.fieldData,
      };
      return state.setIn(['form', 'data'], newData);
    }
    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(
          ['form', 'defaultValues', 'regionList'],
          action.submittedValues.regionList,
        )
        .setIn(['table', 'data'], fromJS(action.tableData))
        .setIn(['table', 'total'], fromJS(action.totalQuantity));
    }
    case constants.SUBMIT_ASSESS_SUCCESS: {
      const { rowIndex, data } = action.payload;
      return state.setIn(['table', 'data', rowIndex], fromJS(data));
    }
    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], fromJS(action.tableData));
    case constants.DELETE_IMAGE_SUCCESS: {
      return state.updateIn(
        ['table', 'data', action.payload.rowIndex, 'images'],
        arr => arr.splice(action.payload.imgIndex, 1),
      );
    }
    case constants.SIZE_FILE_SUCCESS:
      return state.setIn(['table', 'size'], fromJS(action.sizeFile));
    default:
      return state;
  }
}

export default ApprovalPriceListReducer;
