import { fromJS } from 'immutable';
import { get } from 'lodash';

import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';

import { localstoreUtilites } from '../../../utils/persistenceData';
const auth = localstoreUtilites.getAuthFromLocalStorage();

const initTodayAtMidnight = new Date();
const initValues = {
  receiverOrgCode: '',
  impStockRecptCode: '',
  importType: [],
  doCode: '',
  deliverOrgCode: '',
  importedDateFrom: initTodayAtMidnight,
  importedDateTo: initTodayAtMidnight,
  status: 1,
  deliveryCode: 0,
  orgCodes: '',
  pageSize: 5,
  pageIndex: 0,
  totalItem: 0,
  ids: [],
  ApproverLevel: '',
  orgList: [],
  sort: ['status', '-RetailRequestCreateDate'],
};

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    defaultValues: initValues,
    submittedValues: initValues,
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function RetailListPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { status } = action.formData;
      return state
        .setIn(['form', 'data'], action.formData)
        .setIn(
          ['form', 'defaultValues', 'status'],
          status[0] ? status[0].value : '0',
        );
    }
    case constants.GET_FORM_DATA_SUCCESS: {
      const { Approver } = action.formData;

      const deliveryCodeValue = get(
        action.formData,
        'deliveryCode[0].value',
        '',
      );
      const statusValue = get(action.formData, 'status[1].value', '');

      let approverLevelValue = '';
      Approver.forEach(item => {
        if (item.value === auth.meta.userId) {
          approverLevelValue = item;
        }
      });

      return state.withMutations(map => {
        map
          .setIn(['form', 'data'], action.formData)
          .setIn(['form', 'defaultValues', 'status'], statusValue)
          .setIn(['form', 'defaultValues', 'ApproverLevel'], approverLevelValue)
          .setIn(['form', 'defaultValues', 'deliveryCode'], deliveryCodeValue);
      });
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
      return state.withMutations(map => {
        map
          .setIn(['form', 'isSubmitted'], true)
          .setIn(['form', 'submittedValues'], action.submittedValues)
          .setIn(
            ['form', 'defaultValues', 'orgList'],
            action.submittedValues.orgList,
          )

          .setIn(['table', 'data'], action.tableData)
          .setIn(['table', 'selectedRecords'], []);
      });
    case constants.PAGING_INIT:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues);
    case constants.PAGING_SUCCESS:
      return state.setIn(['table', 'data'], action.tableData);

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
    default:
      return state;
  }
}

export default RetailListPageReducer;
