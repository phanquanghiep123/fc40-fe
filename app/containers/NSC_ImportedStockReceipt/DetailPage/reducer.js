import { fromJS } from 'immutable';
import { initialSchema } from './Schema';
import { UPDATE_DETAIL, COMPLETE_SUCCESS } from './constants';
import { mappingSchema, mappingData } from './Utils';

export const initialState = fromJS({
  initialSchema,
  completeSuccess: 0,
  data: [],
});

function ImportedStockReceiptDetail(state = initialState, action) {
  switch (action.type) {
    case COMPLETE_SUCCESS:
      return state.set('completeSuccess', state.get('completeSuccess') + 1);
    case UPDATE_DETAIL:
      return state
        .set(
          'initialSchema',
          fromJS(
            mappingSchema(state.get('initialSchema').toJS(), action.schema),
          ),
        )
        .set('data', mappingData(action.data));
    default:
      return state;
  }
}

export default ImportedStockReceiptDetail;
