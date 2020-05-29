/*
 *
 * MasterBaskets reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';
const values = {
  palletBasketCode: '',
  palletBasketName: '',
  size: '',
  sort: '',
};

export const initialState = fromJS({
  form: {
    data: values,
    defaultValues: values,
  },
  paramSearch: values,
  uoms: [],
  size: [],
  table: {
    data: [],
    selectedRecords: [],
  },
  formDetail: {
    palletBasketCode: '',
    shortName: '',
    fullName: '',
    uoM: '',
    netWeight: '',
    weightUnit: '',
    size: 1,
    length: '',
    height: '',
    width: '',
  },
});

function masterBasketsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.GET_UOMS_SUCCESS: {
      return state.set('uoms', fromJS(action.res));
    }
    case constants.GET_SIZE_SUCCESS: {
      return state.set('size', fromJS(action.res));
    }
    case constants.SEARCH_MASTER_SUCCESS: {
      return state
        .setIn(['table', 'data'], fromJS(action.res))
        .set('paramSearch', fromJS(action.paramSearch));
    }
    case constants.DELETE_BASKET_SUCCESS: {
      return state.updateIn(['table', 'data'], arr =>
        arr.splice(action.idTable, 1),
      );
    }
    case constants.FORM_DETAIL: {
      return state.set('formDetail', fromJS(action.data));
    }
    case constants.SAVE_SUCCESS: {
      return state.setIn(
        ['table', 'data', action.res.tableData.id],
        fromJS(action.res),
      );
    }
    default:
      return state;
  }
}

export default masterBasketsReducer;
