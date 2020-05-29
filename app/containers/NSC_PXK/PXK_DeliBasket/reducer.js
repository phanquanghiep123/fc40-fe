import { fromJS } from 'immutable';
import * as constants from './constants';

const currentDate = new Date();

export const initialState = fromJS({
  fieldsData: {
    org: [],
  },
  defaultValues: {
    org: '',
    pickingDate: currentDate,
    routeFrom: null,
    routeTo: null,
    storeName: '',
    defaultBasket: null,
  },
  submittedValues: {},
  isSubmitted: false,
  tableData: [],
});

function PXKDeliBasketReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FIELDS_DATA_SUCCESS: {
      return state
        .set('fieldsData', fromJS(action.fieldsData))
        .setIn(
          ['defaultValues', 'org'],
          action.fieldsData.org && action.fieldsData.org[0]
            ? action.fieldsData.org[0].value
            : '',
        );
    }

    case constants.FETCH_TABLE_DATA_SUCCESS: {
      return state
        .set('isSubmitted', true)
        .set('submittedValues', fromJS(action.formValues))
        .set('tableData', fromJS(action.tableData));
    }

    case constants.UPDATE_TABLE_DATA: {
      return state.set('tableData', fromJS(action.tableData));
    }

    default:
      return state;
  }
}

export default PXKDeliBasketReducer;
