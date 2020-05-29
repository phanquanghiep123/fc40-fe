import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();

export const initialState = fromJS({
  form: {
    data: {
      org: [],
      doTypes: [],
      status: [],
      orgRole: [
        {
          value: 0,
          label: 'Tất cả',
        },
        {
          value: 1,
          label: 'Đơn vị giao hàng',
        },
        {
          value: 2,
          label: 'Đơn vị nhận hàng',
        },
      ],
      deliveryOrg: [],
      receiveOrg: [],
    },
    isSubmitted: false,
    submittedValues: {},
    defaultValues: {
      org: '', // get the first item
      orgRole: 0, // Tất cả
      doType: 0, // Tất cả
      deliveryRecordNo: '',
      deliveryOrg: null,
      receiveOrg: null,
      status: '',
      expectedArrivalDateFrom: currentDate,
      expectedArrivalDateTo: currentDate,
      productionOrder: '',
      filterProduct: '',
      drivingPlate: '',
      filterDocument: '',
    },
  },
  table: {
    data: [],
    selectedRows: [],
  },
});

function deliveryRecordListPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.CHANGE_SELECTION:
      return state.setIn(['table', 'selectedRows'], action.data);

    case constants.FETCH_FORM_DATA_SUCCESS: {
      const defaultStatus = action.data.status[1] || '1';

      return state
        .setIn(['form', 'data', 'org'], action.data.org)
        .setIn(['form', 'data', 'status'], action.data.status)
        .setIn(['form', 'data', 'receiveOrg'], action.data.receiveOrg)
        .setIn(['form', 'data', 'doTypes'], action.data.doTypes)
        .setIn(
          ['form', 'defaultValues', 'org'],
          action.data.org[0] ? action.data.org[0].value : '0',
        ) // set the first org
        .setIn(['form', 'defaultValues', 'status'], defaultStatus.value); // set default status code
    }

    case constants.FETCH_DELIVERY_ORG_SUCCESS: {
      let oldData = state.getIn(['form', 'data']);
      oldData = oldData.toJS ? oldData.toJS() : oldData;
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
        .setIn(['table', 'data'], action.tableData);

    case constants.DELETE_RECORD_SUCCESS: {
      const newData = state
        .getIn(['table', 'data'])
        .filter(record => record.doId !== action.id);

      return state.setIn(['table', 'data'], newData);
    }

    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);

    default:
      return state;
  }
}

export default deliveryRecordListPageReducer;
