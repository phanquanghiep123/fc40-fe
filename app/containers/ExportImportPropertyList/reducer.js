/*
 *
 * ExportImportPropertyList reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

const values = {
  assetDocumentCode: '',
  assetDocumentType: '',
  status: '',
  basketDocumentCode: '',
  userId: '',
  filterBasket: '',
  plantCode: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  stockTakingCode: '',
  basketCancellReceiptCode: '',
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
};
export const initialState = fromJS({
  paramsSearch: values,
  formData: {},
  table: [],
});
function exportImportPropertyListReducer(state = initialState, action) {
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

export default exportImportPropertyListReducer;
