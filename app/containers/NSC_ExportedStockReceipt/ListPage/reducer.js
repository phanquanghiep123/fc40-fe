import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';
import { localstoreUtilites } from '../../../utils/persistenceData';
const { userId, fullName } = localstoreUtilites.getAuthFromLocalStorage().meta;
const initTodayAtMidnight = new Date();
initTodayAtMidnight.setHours(0, 0, 0, 0);

export const initialState = fromJS({
  form: {
    data: { ...formDataSchema },
    defaultValues: {
      deliverCode: null,
      expStockRecptCode: '',
      receiverCode: null,
      exportedDateFrom: initTodayAtMidnight,
      exportedDateTo: initTodayAtMidnight,
      status: '',
      exportType: [],
      orgCodes: '',
      pageSize: -1,
      filterProduct: '',
      user: { value: userId, label: fullName },
    },
    isSubmitted: false,
    submittedValues: {},
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function ExportStockListPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { deliverCode, orgCodes, status, exportType } = action.formData;
      return state
        .setIn(['form', 'data'], action.formData)
        .setIn(
          ['form', 'defaultValues', 'deliverCode'],
          deliverCode.length > 1 ? deliverCode[1].value : deliverCode[0].value,
        )
        .setIn(['form', 'defaultValues', 'orgCodes'], orgCodes || '')
        .setIn(
          ['form', 'defaultValues', 'status'],
          status[0] ? status[0].value : '0',
        )
        .setIn(
          ['form', 'defaultValues', 'exportType'],
          exportType[0] ? [exportType[0].value] : [],
        );
    }

    case constants.FETCH_RECEIVER_ORG_SUCCESS: {
      const oldData = state.getIn(['form', 'data']);
      const newData = {
        ...oldData,
        receiverCode: action.fieldData,
      };
      return state.setIn(['form', 'data'], newData);
    }

    case constants.SUBMIT_FORM_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
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

    default:
      return state;
  }
}

export default ExportStockListPageReducer;
