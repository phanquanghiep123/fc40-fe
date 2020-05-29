/*
 *
 * ExportBaskets reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

const values = {
  basketDocumentCode: '',
  doCode: '',
  documentCode: '',
  status: [
    {
      description: null,
      label: 'Chưa hoàn thành',
      value: 1,
    },
  ],
  exportType: [],
  filterBasket: '',
  date: null,
  deliverCode: '',
  receiverCode: '',
  exportedDateFrom: null,
  exportedDateTo: new Date(),
  userId: '',
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
};
export const initialState = fromJS({
  paramsSearch: values,
  formData: {},
  table: [],
});

function exportBasketsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_SUCCESS: {
      return state.set('formData', fromJS(action.payload.formData));
    }
    case constants.SEARCH_SUCCESS: {
      return state
        .set('table', fromJS(action.res))
        .set('paramsSearch', fromJS(action.paramsSearch));
    }
    case constants.DELETE_EXPORT_BASKET_SUCCESS: {
      return state.update('table', arr => arr.splice(action.res, 1));
    }
    default:
      return state;
  }
}

export default exportBasketsReducer;
