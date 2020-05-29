/*
 *
 * InventoryBasket reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  formData: {
    doWorkingUnitCode: '',
    regionName: '',
    locatorCode: [], // lưu kho nguồn hiển thị lên màn hình
    locatorCode1: [], // lưu kho nguồn để so sánh và gọi api
    locatorCode2: [], // lưu kho nguồn disable
    btnSumit: '',
    // section1
    status: '',
    statusName: '',
    stocktakingType: '',
    stocktakingRound: new Date(),
    reason: '',
    createDate: new Date(),
    userId: '',
    plantUnitCode: '',
    note: '',

    // section2
    plantName: '',
    plantCode: '',
    delegateId: '',
    phoneNumber: '',

    infoImplementStocktaking: [], // section3
    infoBasketStocktaking: [], // section4
    // infoBasketStocktaking2: [], // section4 lưu thêm 1 mảng để filter
    infoBasketByWayStocktaking: [], // section5
    resultStocktakingByBasket: [], // section6
    handleAfterStocktaking: [], // section7
  },
  formOption: {
    stocktakingType: [], // Loại Kiểm kê
    users: [],
    plants: [],
    locators: [],
    baskets: [],
    locatorByBasket: [],
  },
});

function inventoryBasketReducer(state = initialState, action) {
  switch (action.type) {
    case constants.GET_INIT_FORM_DATA_SUCCESS: {
      return state.set('formOption', fromJS(action.data));
    }

    case constants.INIT_VALUE: {
      return state.set('formData', fromJS(action.data));
    }

    case constants.REMOVE_RECORD_SECTION3_SUCCESS: {
      const newData = state
        .getIn(['formData', 'infoImplementStocktaking'])
        .splice(action.data.rowIndex, 1);
      return state.setIn(['formData', 'infoImplementStocktaking'], newData);
    }

    case constants.REMOVE_RECORD_SECTION4_SUCCESS: {
      const newData = state
        .getIn(['formData', 'infoBasketStocktaking'])
        .splice(action.data, 1);

      return state.setIn(['formData', 'infoBasketStocktaking'], newData);
    }

    case constants.COMPLETE_INVENTORY_SUCCESS: {
      const { res } = action.data;
      const newData = state.getIn(['formData', 'infoBasketStocktaking']).toJS();
      newData[action.data.rowIndex].status = res.status;
      newData[action.data.rowIndex].id = res.id;
      newData[action.data.rowIndex].statusName = res.statusName;

      return state.setIn(
        ['formData', 'infoBasketStocktaking', action.data.rowIndex],
        newData[action.data.rowIndex],
      );
    }

    case constants.ADD_USER: {
      const newData = state
        .getIn(['formData', 'infoImplementStocktaking'])
        .push({});
      return state.setIn(['formData', 'infoImplementStocktaking'], newData);
    }

    case constants.ADD_BASKET: {
      const newData = state
        .getIn(['formData', 'infoBasketStocktaking'])
        .push({}, {}, {}, {}, {});
      return state.setIn(['formData', 'infoBasketStocktaking'], newData);
    }

    case constants.CHANGE_FIELD: {
      const { data, field } = action;

      if (field === 'userName') {
        return state.setIn(
          ['formData', 'infoImplementStocktaking', data.rowIndex],
          fromJS(data.data),
        );
      }

      if (field === 'basketCode' || field === 'basketLocator') {
        return state.setIn(
          ['formData', 'infoBasketStocktaking', data.rowIndex],
          fromJS(data.data),
        );
      }
      return state;
    }

    case constants.UPDATE_DETAILS_COMMAND: {
      const { index, data } = action.data;
      if (action.field === 'infoBasketStocktaking') {
        return state.setIn(['formData', action.field, index], fromJS(data));
      }
      return state.setIn(['formData', action.field, index], fromJS(data));
    }

    case constants.CHANGE_PLANT: {
      return state
        .setIn(['formData', 'doWorkingUnitCode'], fromJS(action.data))
        .setIn(['formData', 'plantUnitCode'], fromJS(action.data))
        .setIn(['formData', 'plantName'], fromJS(action.data.label))
        .setIn(['formData', 'plantCode'], fromJS(action.data.value))
        .setIn(['formData', 'locatorCode'], fromJS([]))
        .setIn(['formData', 'regionName'], fromJS(action.data.regionName));
    }

    case constants.CHANGE_FORM: {
      const { field, value } = action.data;
      if (field === 'reason' || field === 'note') {
        return state.setIn(['formData', field], fromJS(value));
      }

      if (field === 'delegateId') {
        if (value !== null) {
          return state
            .setIn(['formData', 'delegateId'], fromJS(value))
            .setIn(['formData', 'phoneNumber'], fromJS(value.phoneNumber));
        }
        return state
          .setIn(['formData', 'delegateId'], fromJS(''))
          .setIn(['formData', 'phoneNumber'], fromJS(''));
      }

      if (field === 'stocktakingType') {
        if (value !== null) {
          return state.setIn(
            ['formData', 'stocktakingType'],
            fromJS(value.value),
          );
        }
        return state
          .setIn(['formData', 'delegateId'], fromJS(''))
          .setIn(['formData', 'phoneNumber'], fromJS(''));
      }

      if (field === 'plantUnitCode' || field === 'userId') {
        if (value !== null) {
          return state.setIn(['formData', field], fromJS(value));
        }
        return state.setIn(['formData', field], fromJS(''));
      }
      if (field === 'locatorCode') {
        if (value !== null) {
          return state
            .setIn(['formData', 'locatorCode'], fromJS(value))
            .setIn(['formData', 'locatorCode1'], fromJS(value));
        }
        return state
          .setIn(['formData', 'locatorCode'], fromJS([]))
          .setIn(['formData', 'locatorCode1'], fromJS([]));
      }
      return state;
    }
    case constants.GET_LOCATOR_SUCCESS: {
      if (
        action.data.arr.length ===
        state.getIn(['formData', 'locatorCode']).toJS().length
      ) {
        return state
          .setIn(['formOption', 'locators'], fromJS(action.data.arr))
          .setIn(['formData', 'locatorsDisable'], fromJS(true))
          .setIn(['formData', 'locatorCode'], fromJS([]));
      }
      return state.setIn(['formOption', 'locators'], fromJS(action.data.arr));
    }

    case constants.GET_SECTION4_SUCCESS: {
      return state.setIn(
        ['formData', 'infoBasketStocktaking'],
        fromJS(action.data),
      );
    }
    case constants.GET_SECTION5_SUCCESS: {
      return state.setIn(
        ['formData', 'infoBasketByWayStocktaking'],
        fromJS(action.data),
      );
    }

    case constants.SET_BTN_SUBMIT: {
      return state.setIn(['formData', 'btnSumit'], fromJS(action.data));
    }

    // Khi xóa 1 kho trong trường Đối tượng kho kiểm kê
    case constants.FILTER_SECTION4: {
      if (action.data.length > 0) {
        action.data.sort((a, b) => (a.value > b.value ? 1 : -1));
        const result = [];
        action.data.forEach(item => {
          const data = state
            .getIn(['formData', 'infoBasketStocktaking'])
            .toJS()
            .filter(subItem => subItem.basketLocatorId === item.value);
          data.forEach(subItem => {
            result.push(subItem);
          });
        });

        return state.setIn(
          ['formData', 'infoBasketStocktaking'],
          fromJS(result),
        );
      }
      return state;
    }

    case constants.GET_LOCATOR_BY_BASKET_SUCCESS: {
      return state.setIn(
        ['formOption', 'locatorByBasket'],
        fromJS(action.data),
      );
    }
    default:
      return state;
  }
}

export default inventoryBasketReducer;
