import { fromJS } from 'immutable';
import * as constants from './constants';
const date = new Date();
const values = {
  plantCode: [],
  basketCode: [],
  // dateFrom: new Date(date.getFullYear(), date.getMonth() - 1),
  dateTo: date,
  dateFrom: date,
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
  total: 0,
};
export const initialState = fromJS({
  paramsSearch: values,
  paramsSearchPopup: {
    plantCode: [],
    date: new Date(),
    pageSize: 10,
    pageIndex: 0,
  },
  formData: {},
  table: [],
  tablePopup: [],
});

function basketUsingFrequenceReportReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_SUCCESS: {
      return state.set('formData', fromJS(action.payload.formData));
    }
    case constants.SEARCH_SUCCESS: {
      action.res.basketFrequencyReportDtos.push({
        total: true,
        uoM: 'Tổng',
        date: '',
        plantName: '',
        inventoryQuantity: action.res.totalInventoryQuantity,
        basketCode: '',
        basketName: '',
        bywayQuantity: action.res.totalBywayQuantity,
        lendQuantity: action.res.totalLendQuantity,
        averageQuantity: action.res.totalAverageQuantity,
        maxUseQuantity: action.res.totalMaxUseQuantity,
        cancelQuantity: action.res.totalCancelQuantity,
        cancelQuantityInMonth: action.res.totalCancelQuantityInMonth,
        totalInPlantQuantity: action.res.totalInPlantQuantity,
        frequencyOfUse: action.res.totalFrequencyOfUse,
        totalAllPlantQuantity: action.res.totalAllPlantQuantity,
      });
      return state
        .set('table', fromJS(action.res.basketFrequencyReportDtos))
        .set('paramsSearch', fromJS(action.paramsSearch));
    }
    case constants.DELETE_EXPORT_BASKET_SUCCESS: {
      return state.update('table', arr => arr.splice(action.res, 1));
    }

    // case constants.RESET_PARAMS_POPUP: {
    //   return state.set('tablePopup', fromJS([])).set(
    //     'paramsSearchPopup',
    //     fromJS({
    //       plant: '',
    //       date: new Date(),
    //       pageSize: 10,
    //       pageIndex: 0,
    //     }),
    //   );
    // }
    default:
      return state;
  }
}

export default basketUsingFrequenceReportReducer;
