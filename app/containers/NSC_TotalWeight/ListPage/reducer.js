import { fromJS } from 'immutable';

import {
  getDefaultScale,
  getTotalQuantity,
} from 'components/GoodsWeight/utils';

import * as constants from './constants';
import { formDataSchema } from './schema';
import { localstoreUtilites } from '../../../utils/persistenceData';

import { masterRoutine, productRoutine } from './routines';

import GoodsWeightSchema from './WeightPopup/Schema';

const currentDate = new Date();

const auth = localstoreUtilites.getAuthFromLocalStorage();
const userIdLogin = auth.meta.userId;
const userFullName = auth.meta.fullName;

export const initialState = fromJS({
  form: {
    data: {
      ...formDataSchema,
    },
    defaultValues: {
      org: '',
      farms: '',
      semiFinishedProducts: null,
      batchSemiFinishedProducts: '',
      ngayThucHienCan: currentDate,
      nguoiThucHien: userFullName,
      nguoiThucHienId: userIdLogin,
    },
    submittedValues: {},
    isSubmitted: false,
  },
  table: {
    data: [],
    originalData: [], // will NOT be modified
  },
  master: {
    loading: false,
    error: false,
    baskets: [], // Danh sách basket
    pallets: [], // Danh sách pallet
    locators: [], // Danh sách kho
  },
  product: {
    loading: false,
    error: false,
    data: GoodsWeightSchema.cast(),
  },
});

function totalWeightReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_ORG_LIST_SUCCESS: {
      return state
        .setIn(['form', 'data', 'org'], action.orgList)
        .setIn(
          ['form', 'defaultValues', 'org'],
          JSON.stringify(action.orgList[0]),
        );
    }

    case constants.FETCH_TABLE_DATA_SUCCESS: {
      return state
        .setIn(['form', 'isSubmitted'], true)
        .setIn(['form', 'submittedValues'], action.formValues)
        .setIn(['form', 'data', 'farms'], action.formData.farms)
        .setIn(['table', 'data'], action.tableData)
        .setIn(['table', 'originalData'], action.tableData);
    }

    case constants.UPDATE_TABLE_DATA: {
      if (action.formValues) {
        return state
          .setIn(['form', 'submittedValues'], action.formValues)
          .setIn(['table', 'data'], action.tableData);
      }
      return state.setIn(['table', 'data'], action.tableData);
    }
    case constants.UPDATE_LOCATORS:
      return state.setIn(['master', 'locators'], action.locators);
    case constants.UPDATE_FORM_DATA:
      return state
        .setIn(['form', 'data', 'farms'], action.formData.farms)
        .setIn(
          ['form', 'data', 'semiFinishedProducts'],
          action.formData.semiFinishedProducts,
        )
        .setIn(
          ['form', 'data', 'batchSemiFinishedProducts'],
          action.formData.batchSemiFinishedProducts,
        );

    case constants.SET_INIT_WEIGHT_DATA: {
      const baskets = state.getIn(['master', 'baskets']);
      const pallets = state.getIn(['master', 'pallets']);

      const weightData = GoodsWeightSchema.cast(action.weightData, {
        stripUnknown: true,
      });

      return state
        .setIn(['product', 'data'], fromJS(weightData))
        .setIn(
          ['product', 'data', 'basketPallet'],
          fromJS(getDefaultScale(null, baskets.toJS(), pallets.toJS())),
        );
    }

    case masterRoutine.SUCCESS:
      return state
        .setIn(['master', 'baskets'], fromJS(action.payload.baskets))
        .setIn(['master', 'pallets'], fromJS(action.payload.pallets));

    case productRoutine.SUCCESS: {
      const baskets = state.getIn(['master', 'baskets']);
      const pallets = state.getIn(['master', 'pallets']);

      return state
        .setIn(
          ['product', 'data', 'quantity'],
          getTotalQuantity(action.payload.data),
        )
        .setIn(
          ['product', 'data', 'basketPallet'],
          fromJS(
            getDefaultScale(
              action.payload.data,
              baskets.toJS(),
              pallets.toJS(),
            ),
          ),
        )
        .setIn(
          ['product', 'data', 'turnToScales'],
          fromJS(action.payload.data),
        );
    }

    default:
      return state;
  }
}

export default totalWeightReducer;
