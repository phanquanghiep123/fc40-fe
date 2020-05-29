import { fromJS } from 'immutable';
import * as constants from './constants';
import { localstoreUtilites } from '../../../utils/persistenceData';

const { meta } = localstoreUtilites.getAuthFromLocalStorage();

export const initialState = fromJS({
  form: {
    data: {
      org: [],
      status: [],
      receiptType: [],
      reason: [],
      approver: [],
    },
    defaultValues: {
      org: '',
      receiptCode: '',
      status: '',
      receiptType: '', // Loại phiếu
      reason: '',
      // basketCode: null,
      // productCode: '',
      goodCode: '', // Mã hàng hoá, thay cho mã khay sọt và mã sản phẩm
      requestDateFrom: null,
      requestDateTo: null,
      approveDateFrom: null,
      approveDateTo: null,
      executeDateFrom: null,
      executeDateTo: null,
      requester: null,
      approver: {
        value: meta.userId,
        label: meta.fullName,
      },
      executor: null,

      pageSize: 5,
      pageIndex: 0,
      count: 0,
      sortKey: null,
      sortType: null,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function cancelRequestReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData: dt } = action;
      const statusWaiting = 1; // @todo: fixed code
      const defaultValues = {
        org: dt.org[1] ? dt.org[1].value : dt.org[0].value,
        status: dt.status.filter(item => item.value === statusWaiting).length
          ? statusWaiting
          : dt.status[0].value || '',
        receiptType: dt.receiptType.length ? dt.receiptType[0].value : '',
        reason: dt.reason.length ? dt.reason[0].value : '',
      };

      return state
        .setIn(['form', 'data'], dt)
        .setIn(['form', 'defaultValues', 'org'], defaultValues.org)
        .setIn(['form', 'defaultValues', 'status'], defaultValues.status)
        .setIn(
          ['form', 'defaultValues', 'receiptType'],
          defaultValues.receiptType,
        )
        .setIn(['form', 'defaultValues', 'reason'], defaultValues.reason);
    }

    case constants.SUBMIT_FORM_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'selectedRecords'], []);
    }

    case constants.DELETE_RECORD_SUCCESS: {
      const newData = state
        .getIn(['table', 'data'])
        .filter(
          record =>
            !(record.id === action.id && record.isBasket === action.isBasket),
        );
      return state.setIn(['table', 'data'], newData);
    }
    case constants.UPDATE_TABLE_DATA:
      return state.setIn(['table', 'data'], action.tableData);
    case constants.CHANGE_SELECTION:
      return state.setIn(['table', 'selectedRecords'], action.data);
    default:
      return state;
  }
}

export default cancelRequestReducer;
