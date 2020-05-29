import { fromJS } from 'immutable';

import { withLoading } from 'utils/sagaUtils';

import {
  masterRoutine,
  productRoutine,
  receiptsRoutine,
  importedRoutine,
} from './routines';

import WeighedImportedSchema from './Schema';

// Initial state
export const initialState = fromJS({
  master: {
    loading: false,
    error: false,
    baskets: [], // Danh sách Khay sọt
    pallets: [], // Danh sách pallet
    recoveryRate: {}, // Tỷ lệ khấu trừ mặc định, giới hạn trên và giới hạn dưới
    importedType: [], // Phương thức xử lý nhập kho
    processingType: [], // Phân loại xử lý
    organizations: [], // Danh sách Đơn vị
  },
  // Danh sách phiếu cân
  receipts: {
    loading: false,
    error: false,
    data: [],
  },
  // Sản phâm cân
  product: {
    loading: false,
    error: false,
    data: WeighedImportedSchema.cast(),
    deliveryName: '',
    processingTypeName: '',
  },
});

// Define reducer
export const baseReducer = (state = initialState, action) => {
  switch (action.type) {
    case masterRoutine.SUCCESS:
      return state
        .setIn(['master', 'baskets'], fromJS(action.payload.baskets))
        .setIn(['master', 'pallets'], fromJS(action.payload.pallets))
        .setIn(['master', 'recoveryRate'], fromJS(action.payload.recoveryRate))
        .setIn(['master', 'importedType'], fromJS(action.payload.importedType))
        .setIn(
          ['master', 'organizations'],
          fromJS(action.payload.organizations),
        )
        .setIn(
          ['master', 'processingType'],
          fromJS(action.payload.processingType),
        );

    case productRoutine.REQUEST: {
      if (!action.payload.isSaved) {
        return state.setIn(
          ['product', 'data'],
          fromJS(WeighedImportedSchema.cast()),
        );
      }
      return state;
    }

    case productRoutine.SUCCESS: {
      const nextState = state
        .setIn(
          ['product', 'processingTypeName'],
          action.payload.processingTypeName,
        )
        .setIn(['product', 'deliveryName'], action.payload.deliveryName);

      if (action.payload.isSaved) {
        const { turnToScales, ...productData } = action.payload.data;

        return nextState.updateIn(['product', 'data'], product =>
          product.concat(productData),
        );
      }
      return nextState.setIn(
        ['product', 'data'],
        fromJS(WeighedImportedSchema.cast(action.payload.data)),
      );
    }

    case receiptsRoutine.SUCCESS:
      return state
        .setIn(['receipts', 'data'], fromJS(action.payload.data))
        .setIn(['product', 'data'], fromJS(WeighedImportedSchema.cast()));

    case importedRoutine.SUCCESS: {
      const { turnToScales } = action.payload.data;

      return state.setIn(
        ['product', 'data', 'turnToScales'],
        fromJS(turnToScales),
      );
    }

    default:
      return state;
  }
};

export default withLoading(baseReducer);
