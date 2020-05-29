/*
 *
 * ListOwnerBasket reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  initValue: {
    plantOwner: '',
    codeAsset: '',
    palletBasketCode: '',
    status: '',
    boughtDate: new Date(),
    importedDateTo: new Date(),
  },
  selectedRows: [],
  organizations: [],
  baskets: [],
  history: {
    table: [
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
    ],
    form: {
      plantOwner: 1,
      codeAsset: 1,
      palletBasketCode: 1,
      palletBasketName: 1,
      status: 1,
      quantity: 1,
    },
  },
});

function listOwnerBasketReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SEARCH_BASKET_SUCCESS: {
      return state.setIn(
        ['initValue', 'listPalletBasket'],
        fromJS(action.response),
      );
    }

    case constants.FETCH_FORM_SUCCESS: {
      const listBasket = [];
      action.response.baskets.forEach(item => {
        listBasket.push({
          label: `${item.palletBasketCode} - ${item.palletBasketName}`,
          value: item.palletBasketCode,
          basketWeight: item.basketWeight,
        });
      });
      const listOrgs = [];
      action.response.organizations.forEach(item => {
        listOrgs.push({
          label: item.name,
          value: item.value,
        });
      });
      if (action.response.organizations.length === 1) {
        return state
          .setIn(['initValue', 'plantOwner'], fromJS(listOrgs[0]))
          .setIn(['organizations'], fromJS(listOrgs))
          .setIn(['baskets'], fromJS(listBasket));
      }
      return state
        .setIn(['organizations'], fromJS(listOrgs))
        .setIn(['baskets'], fromJS(listBasket));
    }

    case constants.GET_HISTORY_SUCCESS: {
      return state.setIn(['history', 'table'], fromJS(action.response));
      // .setIn(['history', 'form'], fromJS(action.response));
    }
    default:
      return state;
  }
}

export default listOwnerBasketReducer;
