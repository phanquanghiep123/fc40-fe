import { fromJS } from 'immutable';

import {
  masterRoutine,
  locatorRoutine,
  receiptsRoutine,
  detailsRoutine,
} from './routines';

import { FormSearchSchema } from './Schema';
import Schema from './Popup/Schema';

// Initial state
export const initialState = fromJS({
  master: {
    // Danh sách đơn vị
    organizations: [],
  },

  // Tìm kiếm
  formSearch: FormSearchSchema.cast(),

  // Danh sách dữ liệu điều chỉnh
  receipts: {
    data: [],
    total: {},
    isAllowModify: false,
  },

  // Danh sách điêu chỉnh chi tiết
  details: Schema.cast(),
});

// Define reducer
export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    case masterRoutine.SUCCESS:
      return state
        .setIn(['formSearch', 'plantCode'], action.payload.formSearch.plantCode)
        .setIn(['formSearch', 'plantName'], action.payload.formSearch.plantName)
        .setIn(
          ['master', 'organizations'],
          fromJS(action.payload.organizations),
        );

    case locatorRoutine.REQUEST:
      return state
        .setIn(['formSearch', 'plantCode'], action.payload.params.plantCode)
        .setIn(['formSearch', 'plantName'], action.payload.params.plantName)
        .setIn(['formSearch', 'locatorCode'], '')
        .setIn(['formSearch', 'locatorName'], '');

    case locatorRoutine.SUCCESS:
      return state
        .setIn(['formSearch', 'locatorCode'], action.payload.locatorCode)
        .setIn(['formSearch', 'locatorName'], action.payload.locatorName);

    case receiptsRoutine.SUCCESS: {
      const {
        plantCode,
        plantName,
        locatorCode,
        locatorName,
        ...formValues
      } = action.payload.formSearch;

      return state
        .setIn(['receipts', 'isAllowModify'], action.payload.isAllowModify)
        .setIn(['receipts', 'data'], fromJS(action.payload.data))
        .setIn(['receipts', 'total'], fromJS(action.payload.total))
        .update('formSearch', formSearch => formSearch.concat(formValues));
    }

    case detailsRoutine.REQUEST:
      return state
        .set('details', fromJS(action.payload.params))
        .setIn(['details', 'modificationDetails'], fromJS([]));

    case detailsRoutine.SUCCESS:
      return state.setIn(
        ['details', 'modificationDetails'],
        fromJS(action.payload.data),
      );

    default:
      return state;
  }
}
