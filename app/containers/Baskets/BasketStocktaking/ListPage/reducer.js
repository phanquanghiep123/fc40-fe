import { fromJS } from 'immutable';
import * as constants from './constants';
import { formDataSchema } from './FormSection/formats';
import { initialSchema } from './FormSection/schema';

export const initialState = fromJS({
  form: {
    data: formDataSchema,
    defaultValues: { ...initialSchema },
    submittedValues: { ...initialSchema },
    submittedValuesBasket: { ...initialSchema },
    isSubmitted: false,
  },
  table: {
    data: [],
    totalRowData: [],
    tableBasketData: [],
    totalRowBasketData: [],
  },
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData } = action;
      const defaultValues = {
        ...initialSchema,
      };
      return state
        .setIn(['form', 'data'], formData)
        .setIn(['form', 'defaultValues'], defaultValues);
    }
    case constants.GET_FORM_DATA_SUCCESS:
      return state
        .setIn(['form', 'data'], action.formData)
        .setIn(['form', 'defaultValues'], action.formValues)
        .setIn(['form', 'submittedValues'], action.formValues)
        .setIn(['form', 'submittedValuesBasket'], action.formValues);

    case constants.SUBMIT_FORM_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.submittedValues)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'totalRowData'], action.totalRow);
    case constants.SUBMIT_FORM_BASKET_SUCCESS:
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValuesBasket'], action.submittedValuesBasket)
        .setIn(['table', 'tableBasketData'], action.tableBasketData)
        .setIn(['table', 'totalRowBasketData'], action.totalRowBasketData);
    default:
      return state;
  }
}

export default reducer;
