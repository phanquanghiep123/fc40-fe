/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import * as constants from './constants';

// The initial state of the App
export const initialState = fromJS({
  processingType: [],
  inventories: [],
  organizations: [],

  // popup suggestion from deli
  deliPopup: {
    formData: {
      exportingOrg: [],
      importingOrg: [],
    },
    formDefaultValues: {
      exportingOrg: '',
      importingOrg: '',
      pickingDate: null,
      fromStock: '',
      productCode: null,
      productName: '',
    },
    tableData: [],
    selectedRows: [],
  },
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SAVE_INVENTORIES:
      return state.set('inventories', action.inventories);
    case constants.SET_ORGANIZATIONS:
      return state.set('organizations', action.organizations);
    case constants.SET_PROCESSING_TYPE:
      return state.set('processingType', action.processingType);

    case constants.GET_DELI_FORM_DATA_SUCCESS: {
      return state
        .setIn(['deliPopup', 'formData'], fromJS(action.formData))
        .setIn(
          ['deliPopup', 'formDefaultValues'],
          fromJS(action.formDefaultValues),
        );
    }

    case constants.GET_DELI_TABLE_DATA:
      return state
        .setIn(['deliPopup', 'tableData'], [])
        .setIn(['deliPopup', 'selectedRows'], []);

    case constants.GET_DELI_TABLE_DATA_SUCCESS: {
      return state
        .setIn(['deliPopup', 'tableData'], action.tableData)
        .setIn(['deliPopup', 'selectedRows'], action.tableData);
    }

    case constants.DELI_CHANGE_SELECTION: {
      return state.setIn(['deliPopup', 'selectedRows'], action.selectedRows);
    }

    default:
      return state;
  }
}

export default homeReducer;
