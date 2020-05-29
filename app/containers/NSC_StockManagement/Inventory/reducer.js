import { fromJS } from 'immutable';
import { findIndex } from 'lodash';
import * as constants from './constants';
export const initialState = fromJS({
  master: {
    baskets: [], // Danh sách Khay sọt
    pallets: [], // Danh sách pallet
    organizations: [], // Danh sách đơn vị
    products: [],
    warehouses: [],
  },
  initValue: {
    model: {
      id: 0,
      palletBasketCode: '',
      palletBasketName: '',
      basketQuantity: 0,
      basketWeight: 0,
      palletCode: '',
      palletName: '',
      palletQuantity: 0,
      palletWeight: 0,
      scalesWeight: '',
      realWeight: '',
    },
    product: {
      batch: '',
      date: new Date(),
      id: '',
      inventoryQuantity: '',
      locatorId: '',
      locatorName: '',
      plantCode: '',
      productCode: '',
      productName: '',
      rateDifference: '',
      reasonDifference: '',
      stockTakerId: '',
      stockTakingQuantity: '',
      uom: '',
      differentRatio: '',
    },
    plantCode: '',
    productId: '',
    warehouse: '',
    basket: {},
    pallet: {},
    turnToScales: [],
  },
});

function InventoryReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      return state
        .setIn(['master', 'baskets'], fromJS(action.response.baskets))
        .setIn(['master', 'pallets'], fromJS(action.response.pallets))
        .setIn(
          ['master', 'organizations'],
          fromJS(action.response.organizations),
        );
    }
    case constants.GET_LIST_PRODUCT_SUCCESS: {
      const arrProduct = [];
      action.response.data.forEach(item => {
        const product = {
          id: `${item.productCode} - ${item.batch}`,
          productName: `${item.productCode} - ${item.productName} - ${
            item.batch
          }`,
          productCode: item.productCode,
          batch: item.batch,
        };

        arrProduct.push(product);
      });
      return state.setIn(['master', 'products'], fromJS(arrProduct));
    }
    case constants.FILL_PRODUCT_SUCCESS: {
      const { product } = action;
      const index = findIndex(state.getIn(['master', 'products']).toJS(), {
        id: `${product.productCode} - ${product.batch}`,
      });
      if (index < 0) {
        return state.updateIn(['master', 'products'], products =>
          products.unshift(
            fromJS({
              id: `${product.productCode} - ${product.batch}`,
              productName: `${product.productCode} - ${product.productName} - ${
                product.batch
              }`,
              productCode: product.productCode,
              batch: product.batch,
              extend: true,
            }),
          ),
        );
      }
      return state;
    }
    case constants.GET_WAREHOUSES_SUCCESS: {
      return state.setIn(
        ['master', 'warehouses'],
        fromJS(action.response.data),
      );
    }
    default:
      return state;
  }
}

export default InventoryReducer;
