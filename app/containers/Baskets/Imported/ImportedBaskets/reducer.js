/*
 *
 * ImportedBaskets reducer
 *
 */
import { fromJS } from 'immutable';
import {
  CHANGE_SUBTYPE,
  ADD_ROW,
  UPDATE_DETAILS_COMMAND,
  CHANGE_FIELD,
  GET_INIT_FORM_DATA_SUCCESS,
  INIT_VALUE,
  CHANGE_DELIVERY_ORDER,
  GET_LOCATOR_TO_SUCCESS,
  CHANGE_GET_BASKETS_CODE,
  DELETE_ROW_SUCCESS,
  CHANGE_QUANTITY,
  GET_DO_BASKET_DETAIL_SUCCESS,
  CHANGE_DELIVER,
  CHANGE_BASKET_LOCATOR_TO,
  CHANGE_DELIVERY_ORDER_SUCCESS,
  GET_TO_IMPORT_RECEIPT_SUCCESS,
  REMOVE_TO_IMPORT_RECEIPT,
  TYPE_PNKS,
  SET_BTN_SUBMIT,
} from './constants';
import { config } from './Config';

export const initialState = fromJS({
  formData: {
    basketDocumentCode: '',
    assetDocumentCode: '',
    importSubType: null,
    importor: null,
    phoneNumber: '',
    email: '',
    deliveryOrder: null,
    deliver: '',
    receiver: '',
    note: '',
    date: '',
    deliverDate: '',
    supervisor: '',
    registerPlace: '',
    section2: [],
    section3: [],
    section4: [],
    assetDetails: [],
    fakeBasketDetail: [],
    fakeDoBasketDetail: [],
    originAdjust: '',
    originAdjustCode: '',
    btnSubmit: '',
    createFrom: '',
    documentCode: '',
    documentStatus: '',
    basketCancellReceiptCode: '',
    isChecked: false,
  },
  // basketDetails
  config: config[1],
  formOption: {
    receivers: [],
    users: [],
    subTypes: [],
    baskets: [],
    locatorTo: [],
    deliveryOrders: [],
  },
});

function importedBasketsReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DELIVERY_ORDER: {
      const items = [];
      for (let i = 0; i < 5; i += 1) {
        items.push({ stt: i + 1 });
      }
      if (action.payload.value != null) {
        const {
          deliverName,
          deliverCode,
          receiverName,
          receiverCode,
          value,
          label,
          doBasketDetails,
          basketDetails,
          deliverType,
          deliverDate,
          isForBasket,
        } = action.payload.value;
        const data = [];
        if (basketDetails.length > 0 && action.data.length > 0) {
          basketDetails.forEach(item => {
            if (!item.locatorReceiver) {
              data.push({
                ...item,
                locatorReceiver: action.data[0].basketLocatorId,
                locatorReceiverId: action.data[0].basketLocatorId,
                locatorReceiverName: action.data[0].basketLocatorName,
              });
            } else {
              data.push(item);
            }
          });
        }
        return state
          .setIn(
            ['formData', 'deliver'],
            fromJS({
              label: deliverName,
              value: deliverCode,
              deliverType,
            }),
          )
          .setIn(['formData', 'section2'], fromJS(doBasketDetails))
          .setIn(['formData', 'isForBasket'], fromJS(isForBasket))
          .setIn(['formData', 'section3'], fromJS(data))
          .setIn(['formData', 'deliverDate'], fromJS(deliverDate))
          .setIn(
            ['formData', 'receiver'],
            fromJS({ label: receiverName, value: receiverCode }),
          )
          .setIn(['formData', 'deliveryOrder'], fromJS({ value, label }));
      }
      return state
        .setIn(['formData', 'section2'], fromJS(''))
        .setIn(['formData', 'section3'], fromJS(items))
        .setIn(['formData', 'deliveryOrder'], fromJS(''));
    }

    case CHANGE_DELIVER: {
      return state.setIn(['formData', 'deliver'], fromJS(action.payload));
    }
    case CHANGE_DELIVERY_ORDER_SUCCESS: {
      if (action.data.length === 1) {
        const data = [];
        if (
          state.getIn(['formOption', 'locatorTo']).toJS().length > 0 &&
          action.data[0].basketDetails.length > 0
        ) {
          const locatorTo = state.getIn(['formOption', 'locatorTo']).toJS();
          action.data[0].basketDetails.forEach(item => {
            data.push({
              ...item,
              locatorReceiver: locatorTo[0].basketLocatorId,
              locatorReceiverId: locatorTo[0].basketLocatorId,
              locatorReceiverName: locatorTo[0].basketLocatorName,
            });
          });
          return state
            .setIn(['formData', 'deliveryOrder'], fromJS(action.data[0]))
            .setIn(
              ['formData', 'deliver'],
              fromJS({
                label: action.data[0].deliverName,
                value: action.data[0].deliverCode,
                deliverType: 1,
              }),
            )
            .setIn(
              ['formData', 'section2'],
              fromJS(action.data[0].doBasketDetails),
            )
            .setIn(['formData', 'section3'], fromJS(data))
            .setIn(
              ['formData', 'isForBasket'],
              fromJS(action.data[0].isForBasket),
            )
            .setIn(
              ['formData', 'receiver'],
              fromJS({
                label: action.data[0].receiverName,
                value: action.data[0].receiverCode,
              }),
            )
            .setIn(['formOption', 'deliveryOrders'], fromJS(action.data));
        }
        return state
          .setIn(['formData', 'deliveryOrder'], fromJS(action.data[0]))
          .setIn(
            ['formData', 'deliver'],
            fromJS({
              label: action.data[0].deliverName,
              value: action.data[0].deliverCode,
              deliverType: 1,
            }),
          )
          .setIn(
            ['formData', 'section2'],
            fromJS(action.data[0].doBasketDetails),
          )
          .setIn(
            ['formData', 'isForBasket'],
            fromJS(action.data[0].isForBasket),
          )
          .setIn(['formData', 'section3'], fromJS(action.data[0].basketDetails))
          .setIn(
            ['formData', 'receiver'],
            fromJS({
              label: action.data[0].receiverName,
              value: action.data[0].receiverCode,
            }),
          )
          .setIn(['formOption', 'deliveryOrders'], fromJS(action.data));
      }
      return state.setIn(['formOption', 'deliveryOrders'], fromJS(action.data));
    }

    case INIT_VALUE: {
      return state
        .set(
          'config',
          fromJS(
            config.find(
              item => action.initValues.importSubType.value === item.value,
            ),
          ),
        )
        .set('formData', fromJS(action.initValues));
    }
    case GET_INIT_FORM_DATA_SUCCESS: {
      return state
        .setIn(['formOption', 'subTypes'], fromJS(action.data))
        .setIn(['formOption', 'baskets'], fromJS(action.baskets))
        .setIn(['formOption', 'receivers'], fromJS(action.receivers))
        .setIn(['formOption', 'users'], fromJS(action.users));
    }

    case CHANGE_FIELD: {
      const { field, value } = action.payload;
      if (value !== null) {
        const items = [];
        for (let i = 0; i < 5; i += 1) {
          items.push({ stt: i + 1 });
        }
        if (field === 'importor') {
          return state
            .setIn(['formData', 'importor'], fromJS(value))
            .setIn(['formData', 'email'], fromJS(value.email))
            .setIn(['formData', 'phoneNumber'], fromJS(value.phoneNumber));
        }
        return state.setIn(['formData', field], fromJS(value));
      }
      return state
        .setIn(['formData', field], fromJS(''))
        .setIn(['formData', 'email'], fromJS(''))
        .setIn(['formData', 'phoneNumber'], fromJS(''));
    }
    case CHANGE_SUBTYPE: {
      if (action.payload.value != null) {
        if (action.payload.value === TYPE_PNKS.PNKS_MOI) {
          const items = [];
          for (let i = 0; i < 5; i += 1) {
            if (state.getIn(['formOption', 'locatorTo']).toJS().length > 0) {
              items.push({
                stt: i + 1,
              });
            }
          }
          return state
            .set(
              'config',
              fromJS(config.find(item => action.payload.value === item.value)),
            )
            .setIn(
              ['formData', 'importSubType'],
              fromJS(
                state
                  .getIn(['formOption', 'subTypes'])
                  .toJS()
                  .find(item => action.payload.value === item.value),
              ),
            )
            .setIn(['formData', 'deliver'], fromJS(null))
            .setIn(['formData', 'section3'], fromJS(items));
        }
        if (action.payload.value === TYPE_PNKS.PNKS_MUON) {
          const items = [];
          for (let i = 0; i < 5; i += 1) {
            if (state.getIn(['formOption', 'locatorTo']).toJS().length > 0) {
              items.push({
                stt: i + 1,
              });
            }
          }
          return state
            .set(
              'config',
              fromJS(config.find(item => action.payload.value === item.value)),
            )
            .setIn(
              ['formData', 'importSubType'],
              fromJS(
                state
                  .getIn(['formOption', 'subTypes'])
                  .toJS()
                  .find(item => action.payload.value === item.value),
              ),
            )
            .setIn(['formData', 'section2'], fromJS([]))
            .setIn(['formData', 'deliver'], fromJS(null))
            .setIn(['formData', 'section3'], fromJS(items));
        }
        return state
          .set(
            'config',
            fromJS(config.find(item => action.payload.value === item.value)),
          )
          .setIn(
            ['formData', 'importSubType'],
            fromJS(
              state
                .getIn(['formOption', 'subTypes'])
                .toJS()
                .find(item => action.payload.value === item.value),
            ),
          )
          .setIn(['formData', 'section2'], fromJS([]))
          .setIn(['formData', 'deliveryOrder'], fromJS(null))
          .setIn(['formData', 'deliver'], fromJS(null))
          .setIn(['formData', 'section3'], fromJS([]));
      }
      return state;
    }
    case ADD_ROW: {
      const items = [];
      for (let i = 0; i < 5; i += 1) {
        if (state.getIn(['formOption', 'locatorTo']).toJS().length > 0) {
          items.push({
            stt: i + 1,
          });
        }
      }
      if (state.getIn(['formData', 'section3'])) {
        return state.setIn(
          ['formData', 'section3'],
          fromJS([...state.getIn(['formData', 'section3']).toJS(), ...items]),
        );
      }
      return state.setIn(['formData', 'section3'], fromJS(items));
    }
    case UPDATE_DETAILS_COMMAND: {
      const { index, data } = action.payload;
      return state.setIn(['formData', 'section3', index], fromJS(data));
    }
    case GET_LOCATOR_TO_SUCCESS: {
      return state.setIn(['formOption', 'locatorTo'], fromJS(action.data));
    }
    case DELETE_ROW_SUCCESS: {
      const newData = state
        .getIn(['formData', 'section3'])
        .splice(action.rowIndex, 1);
      return state.setIn(['formData', 'section3'], newData);
    }
    case CHANGE_GET_BASKETS_CODE: {
      const { rowIndex, data } = action.payload;
      if (data != null) {
        if (
          !state.getIn(['formData', 'section3', rowIndex, 'locatorReceiver']) &&
          state.getIn(['formOption', 'locatorTo']).toJS().length > 0
        ) {
          return state
            .setIn(
              ['formData', 'section3', rowIndex, 'basketName'],
              fromJS(data.basketName),
            )
            .setIn(
              ['formData', 'section3', rowIndex, 'locatorReceiver'],
              fromJS(
                state.getIn(['formOption', 'locatorTo']).toJS()[0]
                  .basketLocatorId,
              ),
            )
            .setIn(
              ['formData', 'section3', rowIndex, 'locatorReceiverName'],
              fromJS(
                state.getIn(['formOption', 'locatorTo']).toJS()[0]
                  .basketLocatorName,
              ),
            )
            .setIn(
              ['formData', 'section3', rowIndex, 'locatorReceiverId'],
              fromJS(
                state.getIn(['formOption', 'locatorTo']).toJS()[0]
                  .basketLocatorId,
              ),
            )
            .setIn(['formData', 'section3', rowIndex, 'uoM'], fromJS(data.uoM));
        }
        return state
          .setIn(
            ['formData', 'section3', rowIndex, 'basketName'],
            fromJS(data.basketName),
          )
          .setIn(['formData', 'section3', rowIndex, 'uoM'], fromJS(data.uoM));
      }
      return state
        .setIn(['formData', 'section3', rowIndex, 'basketName'], fromJS(''))
        .setIn(['formData', 'section3', rowIndex, 'uoM'], fromJS(''));
    }
    case CHANGE_QUANTITY: {
      return state.setIn(['formData', 'section2'], fromJS(action.data));
    }
    case SET_BTN_SUBMIT: {
      return state.setIn(['formData', 'btnSubmit'], fromJS(action.payload));
    }
    case GET_TO_IMPORT_RECEIPT_SUCCESS: {
      return state
        .setIn(['formData', 'section3'], fromJS(action.data))
        .setIn(['formData', 'isChecked'], fromJS(true))
        .setIn(
          ['formData', 'fakeBasketDetail'],
          fromJS(state.getIn(['formData', 'section3']).toJS()),
        );
    }
    case REMOVE_TO_IMPORT_RECEIPT: {
      return state
        .setIn(
          ['formData', 'section3'],
          fromJS(state.getIn(['formData', 'fakeBasketDetail']).toJS()),
        )
        .setIn(['formData', 'fakeDoBasketDetail'], fromJS([]))
        .setIn(['formData', 'isChecked'], fromJS(false));
    }
    case CHANGE_BASKET_LOCATOR_TO: {
      const { basketLocatorId, basketLocatorName, rowIndex } = action.payload;
      return state
        .setIn(
          ['formData', 'section3', rowIndex, 'locatorReceiver'],
          fromJS(basketLocatorId),
        )
        .setIn(
          ['formData', 'section3', rowIndex, 'locatorReceiverId'],
          fromJS(basketLocatorId),
        )
        .setIn(
          ['formData', 'section3', rowIndex, 'locatorReceiverName'],
          fromJS(basketLocatorName),
        );
    }
    case GET_DO_BASKET_DETAIL_SUCCESS: {
      const { field, value, locator } = action.data;
      const items = [];
      if (value !== null) {
        if (action.response) {
          if (locator.length > 0 && action.response.data.length > 0) {
            action.response.data.forEach(item => {
              if (!item.locatorReceiver) {
                items.push({
                  ...item,
                  locatorReceiver: locator[0].basketLocatorId,
                  locatorReceiverId: locator[0].basketLocatorId,
                  locatorReceiverName: locator[0].basketLocatorName,
                });
              }
            });
          }
          return state
            .setIn(['formData', field], fromJS(value))
            .setIn(['formData', 'deliveryOrder'], fromJS(null))
            .setIn(['formData', 'section2'], fromJS(items))
            .setIn(['formData', 'section3'], fromJS(items));
        }
        for (let i = 0; i < 5; i += 1) {
          items.push({ stt: i + 1 });
        }
        return state
          .setIn(['formData', field], fromJS(value))
          .setIn(['formData', 'deliveryOrder'], fromJS(null))
          .setIn(['formData', 'section2'], fromJS([]))
          .setIn(['formData', 'section3'], fromJS(items));
      }
      if (value === null) {
        if (field === 'receiver') {
          return state
            .setIn(['formData', field], fromJS(''))
            .setIn(['formOption', 'locatorTo'], fromJS([]))
            .setIn(['formData', 'deliveryOrder'], fromJS(null))
            .setIn(['formData', 'section2'], fromJS([]))
            .setIn(['formData', 'section3'], fromJS([]));
        }
        return state
          .setIn(['formData', field], fromJS(''))
          .setIn(['formData', 'deliveryOrder'], fromJS(null))
          .setIn(['formData', 'section2'], fromJS([]))
          .setIn(['formData', 'section3'], fromJS([]));
      }
      return state;
    }
    default:
      return state;
  }
}

export default importedBasketsReducer;
