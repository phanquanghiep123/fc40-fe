import { fromJS } from 'immutable';
import { initialSchema } from './Schema';
import {
  SET_ORGANIZATIONS,
  CHANGE_IMPORT_SUB_TYPE,
  SET_IMPORT_SUBTYPE,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  UPDATE_SCHEMA,
} from './constants';
import { mappingData } from './Utils';

export const initialState = fromJS({
  openDl: false,
  itemId: null,
  initialSchema,
  organizations: [],
  importSubType: [],
});

function ImportedStockReceipt(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SCHEMA:
      return state.set(
        'initialSchema',
        fromJS(
          mappingData(
            state.get('initialSchema').toJS(),
            action.importStockId,
            action.schema,
          ),
        ),
      );
    case OPEN_DIALOG:
      return state.set('openDl', true).set('itemId', action.importStockId);
    case CLOSE_DIALOG:
      return state
        .set('openDl', false)
        .set('initialSchema', fromJS(initialSchema));
    case SET_ORGANIZATIONS:
      if (action.itemId == null && action.data.length >= 1) {
        return (
          state
            .set('organizations', action.data)
            .set('importSubType', action.data[0].importSubType)
            .setIn(['initialSchema', 'receiverCode'], action.data[0])
            // .setIn(['initialSchema', 'receiverCode'], action.data[0].value)
            .setIn(
              ['initialSchema', 'subType'],
              action.data[0].importSubType[0].id,
            )
        );
      }
      return state.set('organizations', []).set('importSubType', []);
    case SET_IMPORT_SUBTYPE: {
      // receiverCode
      const org = state.get('organizations');
      if (org.length > 1) {
        let subType = [];
        org.forEach(item => {
          if (item.value === action.receiverCode) {
            subType = item.importSubType;
          }
        });
        action.callback(subType);
        return state.set('importSubType', subType);
      }
      return state;
    }
    case CHANGE_IMPORT_SUB_TYPE:
      return state.set('importSubType', []);
    default:
      return state;
  }
}

export default ImportedStockReceipt;
