import { fromJS } from 'immutable';
import { localstoreUtilites } from 'utils/persistenceData';
import * as constants from './constants';
const auth = localstoreUtilites.getAuthFromLocalStorage();
const initTodayAtMidnight = new Date();

export const initialState = fromJS({
  form: {
    data: {
      receiverOrgCode: [],
      importType: [],
      status: [
        {
          value: 0,
          label: 'Tất cả',
        },
        {
          value: 1,
          label: 'Đang cân',
        },
        {
          value: 2,
          label: 'Hoàn thành',
        },
      ],
    },
    defaultValues: {
      receiverOrgCode: '',
      impStockRecptCode: '',
      importType: [],
      doCode: '',
      deliverOrgCode: '',
      importedDateFrom: initTodayAtMidnight,
      importedDateTo: initTodayAtMidnight,
      status: 0,
      orgCodes: '',
      weighingStaff: {
        value: auth.meta.userId,
        label: auth.meta.fullName,
      },
      filterProduct: '',
      pageSize: -1,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
    selectedRecords: [],
  },
});

function ImportStockListPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const {
        receiverOrgCode,
        orgCodes,
        importType,
        weighingStaffs,
      } = action.formData;
      return state
        .setIn(['form', 'data', 'receiverOrgCode'], receiverOrgCode)
        .setIn(['form', 'data', 'weighingStaffs'], weighingStaffs)
        .setIn(['form', 'data', 'importType'], importType)
        .setIn(
          ['form', 'defaultValues', 'receiverOrgCode'],
          receiverOrgCode.length > 1
            ? receiverOrgCode[1].value
            : receiverOrgCode[0].value,
        )
        .setIn(['form', 'defaultValues', 'orgCodes'], orgCodes || '')
        .setIn(
          ['form', 'defaultValues', 'importType'],
          importType[0] ? [importType[0].value] : [],
        );
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

export default ImportStockListPageReducer;
