/*
 *
 * PostprocessKk reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_INIT_FORM_DATA_SUCCESS,
  GET_BASKET_DETAIL_SUCCESS,
  CHANGE_DATA,
  UPDATE_DETAILS_COMMAND,
  GET_DELIVERY_ORDER_SUCCESS,
  HANDLE_QUANTITY,
  TYPE_PROCESS,
} from './constants';

export const initialState = fromJS({
  formData: {
    typeProcess: '',
    date: new Date(),
    receiver: '',
    adjustmentUser: '',
    deliver: '',
    deliverBasketStocktakingCode: '',
    receiverBasketStocktakingCode: '',
    tableData: [],
    tableDataReceiver: [],
    tableDataDeliver: [],
    dataSubmit: [],
  },
  formOption: {
    users: [],
    plants: [],
    typeProcess: [],
    receiverBasketStocktakingCode: [],
    deliverBasketStocktakingCode: [],
  },
});

function postprocessKkReducer(state = initialState, action) {
  switch (action.type) {
    case GET_INIT_FORM_DATA_SUCCESS: {
      return state
        .set('formOption', fromJS(action.formOption))
        .set('formData', fromJS(action.initData));
    }

    case GET_BASKET_DETAIL_SUCCESS: {
      const { keyData, tableDataDeliver, tableDataReceiver } = action.data;
      return state
        .setIn(['formData', 'tableData'], fromJS(keyData))
        .setIn(['formData', 'tableDataReceiver'], fromJS(tableDataReceiver))
        .setIn(['formData', 'tableDataDeliver'], fromJS(tableDataDeliver));
    }

    case CHANGE_DATA: {
      const { data, field } = action.data;
      if (field === 'date') {
        return state
          .setIn(['formData', field], fromJS(data))
          .setIn(['formData', 'deliverBasketStocktakingCode'], fromJS(''))
          .setIn(['formData', 'receiverBasketStocktakingCode'], fromJS(''))
          .setIn(['formData', 'tableData'], fromJS([]))
          .setIn(['formData', 'tableDataReceiver'], fromJS([]))
          .setIn(['formData', 'tableDataDeliver'], fromJS([]));
      }
      if (field === 'deliver') {
        if (
          state.getIn(['formData', 'typeProcess']) === TYPE_PROCESS.INTERNAL
        ) {
          return state
            .setIn(['formData', field], fromJS(data))
            .setIn(['formData', 'tableData'], fromJS([]))
            .setIn(['formData', 'deliverBasketStocktakingCode'], fromJS(''))
            .setIn(['formData', 'receiverBasketStocktakingCode'], fromJS(''))
            .setIn(['formData', 'tableDataDeliver'], fromJS([]));
        }
        return state
          .setIn(['formData', field], fromJS(data))
          .setIn(['formData', 'tableData'], fromJS([]))
          .setIn(['formData', 'deliverBasketStocktakingCode'], fromJS(''))
          .setIn(['formData', 'tableDataDeliver'], fromJS([]));
      }
      if (field === 'receiver') {
        return state
          .setIn(['formData', field], fromJS(data))
          .setIn(['formData', 'receiverBasketStocktakingCode'], fromJS(''))
          .setIn(['formData', 'tableData'], fromJS([]))
          .setIn(['formData', 'tableDataReceiver'], fromJS([]));
      }

      if (field === 'typeProcess') {
        if (data === TYPE_PROCESS.INTERNAL) {
          return state
            .setIn(['formData', field], fromJS(data))
            .setIn(
              ['formData', 'receiverBasketStocktakingCode'],
              fromJS(
                state
                  .getIn(['formData', 'deliverBasketStocktakingCode'])
                  .toJS(),
              ),
            )
            .setIn(['formData', 'tableData'], fromJS([]))
            .setIn(['formData', 'tableDataReceiver'], fromJS([]))
            .setIn(['formData', 'tableDataDeliver'], fromJS([]));
        }
        return state
          .setIn(['formData', field], fromJS(data))
          .setIn(['formData', 'receiverBasketStocktakingCode'], fromJS(''))
          .setIn(['formData', 'receiverBasketStocktakingCode'], fromJS(''))
          .setIn(['formData', 'receiver'], fromJS(''))
          .setIn(['formData', 'tableData'], fromJS([]))
          .setIn(['formData', 'tableDataReceiver'], fromJS([]))
          .setIn(['formData', 'tableDataDeliver'], fromJS([]));
      }
      if (
        field === 'deliverBasketStocktakingCode' &&
        state.getIn(['formData', 'typeProcess']) === TYPE_PROCESS.INTERNAL
      ) {
        return state
          .setIn(['formData', 'deliverBasketStocktakingCode'], fromJS(data))
          .setIn(['formData', 'receiverBasketStocktakingCode'], fromJS(data));
      }

      if (data !== null) {
        return state.setIn(['formData', field], fromJS(data));
      }

      return state.setIn(['formData', field], fromJS(''));
    }

    case UPDATE_DETAILS_COMMAND: {
      const { index, data } = action.data;
      return state.setIn(['formData', 'tableData', index], fromJS(data));
    }

    case GET_DELIVERY_ORDER_SUCCESS: {
      const { fieldData, isDeliver } = action.data;
      if (fieldData.length === 1) {
        if (isDeliver) {
          if (
            state.getIn(['formData', 'typeProcess']) === TYPE_PROCESS.INTERNAL
          ) {
            return state
              .setIn(
                ['formOption', 'deliverBasketStocktakingCode'],
                fromJS(fieldData),
              )
              .setIn(
                ['formData', 'deliverBasketStocktakingCode'],
                fromJS(fieldData[0]),
              )
              .setIn(
                ['formOption', 'receiverBasketStocktakingCode'],
                fromJS(fieldData),
              )
              .setIn(
                ['formData', 'receiverBasketStocktakingCode'],
                fromJS(fieldData[0]),
              );
          }
          return state
            .setIn(
              ['formOption', 'deliverBasketStocktakingCode'],
              fromJS(fieldData),
            )
            .setIn(
              ['formData', 'deliverBasketStocktakingCode'],
              fromJS(fieldData[0]),
            );
        }

        return state
          .setIn(
            ['formOption', 'receiverBasketStocktakingCode'],
            fromJS(fieldData),
          )
          .setIn(
            ['formData', 'receiverBasketStocktakingCode'],
            fromJS(fieldData[0]),
          );
      }
      if (isDeliver) {
        return state.setIn(
          ['formOption', 'deliverBasketStocktakingCode'],
          fromJS(fieldData),
        );
      }
      return state.setIn(
        ['formOption', 'receiverBasketStocktakingCode'],
        fromJS(fieldData),
      );
    }

    case HANDLE_QUANTITY: {
      const length = [];
      const tableData = state.getIn(['formData', 'tableData']).toJS();
      tableData.forEach((item, i) => {
        if (item.basketCode === action.data[0].basketCode) {
          length.push(i);
        }
      });
      length.forEach((item, i) => {
        tableData[item] = action.data[i];
      });
      return state.setIn(['formData', 'tableData'], fromJS(tableData));
    }
    default:
      return state;
  }
}

export default postprocessKkReducer;
