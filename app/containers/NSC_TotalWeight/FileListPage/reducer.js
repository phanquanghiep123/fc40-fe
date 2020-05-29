import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    isSubmitted: false,
    submittedValues: {},
    defaultValues: {
      unitCode: '',
      unitCodes: '',
      processingDate: tomorrow,
      supplier: null,
    },
  },
  table: {
    data: [],
  },
});

function totalWeightFileListPage(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS:
      return state
        .setIn(['form', 'data'], action.data)
        .setIn(
          ['form', 'defaultValues', 'unitCode'],
          action.data.unitCode[0] ? action.data.unitCode[0].value : '0',
        );

    case constants.SUBMIT_FORM_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData);

    default:
      return state;
  }
}

export default totalWeightFileListPage;
