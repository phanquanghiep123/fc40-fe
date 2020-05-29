/*
 *
 * ExportedBaskets reducer
 *
 */

import { fromJS } from 'immutable';
import { find } from 'lodash';
import * as constants from './constants';
import { columnDefsOptions } from './Config';

export const initialState = fromJS({
  form: {
    values: {
      basketDocumentDetails: [],
      doBasketDetails: [],
    },
  },
  config: columnDefsOptions[0],
  typeForm: null,
  formOption: {
    orgs: [],
    users: [],
    subTypes: [],
    baskets: [],
    basketLocators: [],
  },
  isDisabled: false,
});

function exportedBasketsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.DEFAULT_ACTION:
      return state;
    case constants.INIT_VALUE: {
      const dataConfig = find(columnDefsOptions, {
        value: action.payload.subType.value,
      });
      return state
        .setIn(['form', 'values'], fromJS(action.payload))
        .set('config', fromJS(dataConfig));
    }
    case constants.GET_VALUE_FORM_SUCCESS: {
      return (
        state
          // .set([''])
          .setIn(['formOption', 'subTypes'], fromJS(action.payload.data))
          .setIn(['formOption', 'orgs'], fromJS(action.payload.orgs))
          .setIn(['formOption', 'users'], fromJS(action.payload.users))
          .setIn(['formOption', 'baskets'], fromJS(action.payload.baskets))
      );
    }
    case constants.GET_BASKETS:
      return state.setIn(['table', 'data'], action.data);
    case constants.GET_BASKET_LOCATORS_SUCCESS:
      return state.setIn(['formOption', 'basketLocators'], action.payload.data);
    case constants.CHANGE_FIELD: {
      const { field, value, deliverType, receiverType } = action.payload;
      if (field === 'deliver') {
        if (
          [
            constants.TYPE_PXKS.PXKS_DIEU_CHUYEN,
            constants.TYPE_PXKS.PXKS_MUON,
          ].includes(state.getIn(['form', 'values']).toJS().subType.value)
        ) {
          const basketLocators = state.getIn([
            'formOption',
            'basketLocators',
          ])[0];
          const basketDetail = [];
          state
            .getIn(['form', 'values', 'basketDocumentDetails'])
            .toJS()
            .forEach(() => {
              basketDetail.push({
                locatorDeliver:
                  basketLocators && basketLocators.basketLocatorId,
                locatorDeliverName:
                  basketLocators && basketLocators.basketLocatorName,
              });
            });
          return state
            .setIn(
              ['form', 'values', 'basketDocumentDetails'],
              fromJS(basketDetail),
            )
            .setIn(['form', 'values', field], fromJS(value))
            .setIn(['form', 'values', 'deliverType'], deliverType);
        }
        return state
          .setIn(['form', 'values', field], fromJS(value))
          .setIn(['form', 'values', 'deliverType'], deliverType);
      }
      if (field === 'receiver') {
        const basketDetail = [];
        if (
          [constants.TYPE_PXKS.PXKS_MUON].includes(
            state.getIn(['form', 'values']).toJS().subType.value,
          )
        ) {
          const basketLocators = state.getIn([
            'formOption',
            'basketLocators',
          ])[0];
          state
            .getIn(['form', 'values', 'basketDocumentDetails'])
            .toJS()
            .forEach(() => {
              basketDetail.push({
                locatorDeliver:
                  basketLocators && basketLocators.basketLocatorId,
                locatorDeliverName:
                  basketLocators && basketLocators.basketLocatorName,
              });
            });
          if (value !== null) {
            return state
              .setIn(
                ['form', 'values', 'basketDocumentDetails'],
                fromJS(basketDetail),
              )
              .setIn(['form', 'values', field], fromJS(value))
              .setIn(['form', 'values', 'receiverType'], receiverType);
          }
          return state
            .setIn(['form', 'values', field], fromJS(null))
            .setIn(
              ['form', 'values', 'basketDocumentDetails'],
              fromJS(basketDetail),
            );
        }
        if (value !== null) {
          return state
            .setIn(['form', 'values', field], fromJS(value))
            .setIn(['form', 'values', 'receiverType'], receiverType);
        }
        return state.setIn(['form', 'values', field], fromJS(null));
      }
      return state.setIn(['form', 'values', field], fromJS(value));
    }
    case constants.CHANGE_TYPE: {
      if (action.payload !== null) {
        const currentDate = new Date();
        const dataConfig = find(columnDefsOptions, {
          value: action.payload.value,
        });
        if (
          [
            constants.TYPE_PXKS.PXKS_DIEU_CHUYEN,
            constants.TYPE_PXKS.PXKS_MUON,
          ].includes(action.payload.value)
        ) {
          const basketLocators = state.getIn([
            'formOption',
            'basketLocators',
          ])[0];
          const basketDetail = [];
          state
            .getIn(['form', 'values', 'basketDocumentDetails'])
            .toJS()
            .forEach(() => {
              basketDetail.push({
                locatorDeliver:
                  basketLocators && basketLocators.basketLocatorId,
                locatorDeliverName:
                  basketLocators && basketLocators.basketLocatorName,
              });
            });
          return state
            .setIn(
              ['form', 'values', 'basketDocumentDetails'],
              fromJS(basketDetail),
            )
            .set('config', fromJS(dataConfig))
            .setIn(['form', 'values', 'subType'], fromJS(action.payload))
            .setIn(['form', 'values', 'note'], fromJS(''))
            .setIn(['form', 'values', 'date'], currentDate)
            .setIn(['form', 'values', 'receiver'], fromJS(null));
        }
        return state
          .set('config', fromJS(dataConfig))
          .setIn(['form', 'values', 'subType'], fromJS(action.payload))
          .setIn(
            ['form', 'values', 'doBasketDetails'],
            fromJS(action.payload.data),
          )
          .setIn(['form', 'values', 'note'], fromJS(''))
          .setIn(['form', 'values', 'date'], currentDate)
          .setIn(['form', 'values', 'receiver'], fromJS(null));
      }
      return state;
    }

    case constants.ADD_ROWS: {
      const basketLocators = state.getIn(['formOption', 'basketLocators']);
      const subType = state.getIn(['form', 'values', 'subType', 'value']);
      const primaryLocator = find(basketLocators, { locatorType: 1 });
      const items = [];
      if (
        primaryLocator !== undefined &&
        [
          constants.TYPE_PXKS.PXKS_DIEU_CHUYEN,
          constants.TYPE_PXKS.PXKS_MUON,
        ].includes(subType)
      ) {
        for (let i = 0; i < 5; i += 1) {
          items.push({
            basketCode: null,
            locatorDeliver: primaryLocator.basketLocatorId,
            locatorDeliverName: primaryLocator.basketLocatorName,
          });
        }
      } else {
        for (let i = 0; i < 5; i += 1) {
          items.push({});
        }
      }
      return state.setIn(
        ['form', 'values', 'basketDocumentDetails'],
        fromJS([
          ...state.getIn(['form', 'values', 'basketDocumentDetails']),
          ...items,
        ]),
      );
    }

    case constants.RESET_BASKETS_DETAIL: {
      const basketLocators = state.getIn(['formOption', 'basketLocators']);
      const subType = state.getIn(['form', 'values', 'subType', 'value']);
      const primaryLocator = find(basketLocators, { locatorType: 1 });
      const items = [];
      const { field } = action.payload;
      if (
        [constants.TYPE_PXKS.PXKS_MUON].includes(subType) &&
        field !== 'subType'
      ) {
        for (let i = 0; i < 5; i += 1) {
          items.push({
            basketCode: null,
            locatorDeliver: primaryLocator
              ? primaryLocator.basketLocatorId
              : null,
            locatorDeliverName: primaryLocator
              ? primaryLocator.basketLocatorName
              : null,
          });
        }
      } else
        for (let i = 0; i < 5; i += 1) {
          items.push({});
        }
      if ([constants.TYPE_PXKS.PXKS_TRA].includes(subType)) {
        return state
          .setIn(
            ['form', 'values', 'basketDocumentDetails'],
            fromJS([...items]),
          )
          .setIn(['form', 'values', 'doBasketDetails'], fromJS(null));
      }
      return state
        .setIn(['form', 'values', 'basketDocumentDetails'], fromJS([...items]))
        .setIn(['form', 'values', 'receiver'], null);
    }

    case constants.RESET_DELIVERY_ORDER:
      return state
        .setIn(['form', 'values', 'deliveryOrderCode'], null)
        .setIn(['form', 'values', 'note'], null);

    case constants.RESET_DOCUMENT_SELL:
      return state
        .setIn(['form', 'values', 'documentCode'], fromJS(null))
        .setIn(['form', 'values', 'pxbCode'], fromJS(null));

    case constants.DELETE_ROW: {
      const newData = state
        .getIn(['form', 'values', 'basketDocumentDetails'])
        .splice(action.rowIndex, 1);
      return state.setIn(['form', 'values', 'basketDocumentDetails'], newData);
    }
    case constants.UPDATE_BASKET_DOCUMENT_DETAILS: {
      return state.setIn(
        ['form', 'values', 'basketDocumentDetails', action.payload.index],
        fromJS(action.payload.data),
      );
    }

    case constants.CHANGE_DELIVERY_ORDER: {
      if (action.payload !== null) {
        const {
          deliveryName,
          deliverCode,
          receiverName,
          receiverCode,
          value,
          label,
          date,
        } = action.payload;
        const basketLocators = state.getIn(['formOption', 'basketLocators'])[0];
        const basketDetail = [];
        state
          .getIn(['form', 'values', 'basketDocumentDetails'])
          .toJS()
          .forEach(() => {
            basketDetail.push({
              locatorDeliver: basketLocators.basketLocatorId,
              locatorDeliverName: basketLocators.basketLocatorName,
            });
          });
        return state
          .setIn(
            ['form', 'values', 'deliveryOrderCode'],
            fromJS({ value, label }),
          )
          .setIn(
            ['form', 'values', 'deliver'],
            fromJS({ value: deliverCode, label: deliveryName }),
          )
          .setIn(
            ['form', 'values', 'receiver'],
            fromJS({ value: receiverCode, label: receiverName }),
          )
          .setIn(['form', 'values', 'date'], fromJS(date))
          .setIn(
            ['form', 'values', 'basketDocumentDetails'],
            fromJS(basketDetail),
          )
          .setIn(['form', 'values', 'note'], fromJS(value));
      }
      return state
        .setIn(['form', 'values', 'deliveryOrderCode'], fromJS(null))
        .setIn(['form', 'values', 'note'], fromJS(''));
    }

    case constants.CHANGE_SELL_DOCUMENT: {
      if (action.payload !== null) {
        const {
          deliveryName,
          deliverCode,
          receiverName,
          receiverCode,
          value,
          label,
          date,
          doBasketDetails,
        } = action.payload;
        const basketLocators = state.getIn(['formOption', 'basketLocators']);
        const primaryLocator = find(basketLocators, { locatorType: 1 });
        const doBaskets = doBasketDetails.map(item => ({
          ...item,
          locatorDeliver: primaryLocator.basketLocatorId,
          locatorDeliverName: primaryLocator.basketLocatorName,
          deliveryQuantity: item.quantity,
        }));
        return state
          .setIn(['form', 'values', 'documentCode'], fromJS({ value, label }))
          .setIn(['form', 'values', 'pxbCode'], fromJS({ value, label }))
          .setIn(
            ['form', 'values', 'deliver'],
            fromJS({ value: deliverCode, label: deliveryName }),
          )
          .setIn(
            ['form', 'values', 'receiver'],
            fromJS({ value: receiverCode, label: receiverName }),
          )
          .setIn(['form', 'values', 'date'], fromJS(date))
          .setIn(
            ['form', 'values', 'basketDocumentDetails'],
            fromJS(doBaskets),
          );
      }
      return state
        .setIn(['form', 'values', 'documentCode'], fromJS(null))
        .setIn(['form', 'values', 'pxbCode'], fromJS(null))
        .setIn(['form', 'values', 'receiver'], fromJS(null));
    }
    case constants.CHANGE_USER: {
      if (action.payload !== null) {
        const { value, label, phoneNumber, email } = action.payload;
        return state
          .setIn(['form', 'values', 'user'], fromJS({ value, label }))
          .setIn(['form', 'values', 'phone'], fromJS(phoneNumber))
          .setIn(['form', 'values', 'email'], fromJS(email));
      }
      return state;
    }

    case constants.GET_LOAN_BASKET_SUCCESS: {
      if (action.payload !== null) {
        const doBasketDetails = action.payload.data.vendorDetailsDto.map(
          item => ({
            ...item,
            doQuantity: item.loanQuantity,
            deliveryQuantity: 0,
          }),
        );
        const basketLocators = state.getIn(['formOption', 'basketLocators']);
        const primaryLocator = find(basketLocators, { locatorType: 1 });
        const doBaskets = action.payload.data.inventoryDto.map(item => ({
          ...item,
          locatorDeliver: primaryLocator.basketLocatorId,
          locatorDeliverName: primaryLocator.basketLocatorName,
          deliveryQuantity: 0,
        }));
        return state
          .setIn(['form', 'values', 'doBasketDetails'], fromJS(doBasketDetails))
          .setIn(
            ['form', 'values', 'basketDocumentDetails'],
            fromJS(doBaskets),
          );
      }
      return state;
    }

    default:
      return state;
  }
}

export default exportedBasketsReducer;
