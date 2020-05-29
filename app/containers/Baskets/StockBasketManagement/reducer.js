/*
 *
 * StockBasketManagement reducer
 *
 */
import { fromJS } from 'immutable';
import * as constants from './constants';

const values = {
  plantCode: [],
  basketCode: [],
  date: new Date(),
  filterLocator: [],
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
  total: 0,
};
export const initialState = fromJS({
  paramsSearch: values,
  formData: {},
  table: [],
});

function stockBasketManagementReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_SUCCESS: {
      return state.set('formData', fromJS(action.payload.formData));
    }
    case constants.SEARCH_SUCCESS: {
      action.res.push({
        total: true,
        uoM: 'Tổng',
        quantity: action.paramsSearch.total,
      });
      return state
        .set('table', fromJS(action.res))
        .set('paramsSearch', fromJS(action.paramsSearch));
    }
    case constants.DELETE_EXPORT_BASKET_SUCCESS: {
      return state.update('table', arr => arr.splice(action.res, 1));
    }

    case constants.GET_LOCATOR_SUCCESS: {
      return state.setIn(['formData', 'locators'], fromJS(action.data));
    }
    default:
      return state;
  }
}

export default stockBasketManagementReducer;
