/*
 * AppReducer
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

import { localstoreUtilites } from 'utils/persistenceData';
import mapping from 'authorize/mapping';
import ability from 'authorize/ability';

import { LOGIN_SUCCESS, SUBMIT_LOGIN } from 'containers/LoginPage/constants';
import {
  CREATE_BBGH_FARM,
  CREATE_BBGH_SUCCESS,
  GET_INIT_CREATED_BBGH,
  GET_INIT_CREATED_BBGH_SUCCESS,
  ALERT_INVALID_WHEN_SUBMIT,
} from 'containers/NSC_BBGH/BBGHCreatePage/constants';
import {
  GET_INIT_RECEIVING_DELIVERY_ORDER,
  SET_INIT_RECEIVING_DELEVERY_ORDER,
  UPDATE_RECEIVING_DELIVERY_ORDER_SUCCESS,
} from 'containers/NSC_ReciveBBGH/constants';
import {
  GET_INIT_BBGH,
  GET_INIT_BBGH_SUCCESS,
  UPDATE_BBGH_SUCCESS,
  UPDATE_BBGH,
} from 'containers/NSC_BBGH/BBGHEditPage/constants';

import { SAVE_PXK_SUCCESS } from 'containers/NSC_PXK/PXK/constants';
import { DEVICE_EXTERNAL } from 'utils/socketUtils';

import {
  OPEN_DIALOG,
  CLOSE_DIALOG,
  CLOSE_SNACK_BAR,
  LOADING_ERROR,
  SAVE_MENU,
  ALERT_INVALID,
  SET_LOADING,
  CONNEC_DEVICE,
  RECIVE_DATA,
} from './constants';
// import message from './messageGlobal';

const auth = localstoreUtilites.getAuthFromLocalStorage();
// refresh page update ability
if (auth.meta.accessToken) {
  ability.update(mapping(auth.meta.accessToken));
}

// The initial state of the App
const initialState = fromJS({
  device: {
    status: DEVICE_EXTERNAL.NOT_CONNECT_YET,
    weight: [], // khối lượng lần cân, array
  },
  system: {
    loading: false,
    /**
     * @status response from server or error is thrown from application
     * alert ui is given
     * success, error, warning, info
     *
     * @example
     * { type: 'error', message: 'some_error_happen' }
     * { type: 'success', message: 'request_success' }
     * type oneOfType: ['success', 'warning', 'error', 'info']
     */
    status: false,
  },
  ui: {
    openDialog: false,
    paging: {
      pageNumber: 10,
      pageSize: 10,
    },
    pagingOption1: {
      pageNumber: 10,
      pageSize: 10,
    },
  },
  auth: {
    isAuthenticated: auth.isAuthed,
    menu: auth.meta.leftMenu,
    header: auth.meta.topMenu,
    fullName: auth.meta.fullName,
    userIdLogin: auth.meta.userId,
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case RECIVE_DATA: {
      // if (action.data.unit === -1) {
      //   return state.setIn(
      //     ['system', 'status'],
      //     fromJS({
      //       type: 'warning',
      //       message: `${message.RESULT_SCALE_NOT_FOUND}`,
      //     }),
      //   );
      // }

      return (
        state
          // .setIn(
          //   ['system', 'status'],
          //   fromJS({
          //     type: 'success',
          //     message: `${message.RESULT_SCALE}${action.data.weight} ${
          //       action.data.unitString
          //     }`,
          //   }),
          // )
          .updateIn(['device', 'weight'], arr =>
            arr.push({ weight: action.data.weight, unit: action.data.unit }),
          )
      );
    }
    case CONNEC_DEVICE:
      return state.setIn(['device', 'status'], action.status);
    case SET_LOADING: {
      return state.setIn(['system', 'loading'], action.isLoading);
    }
    // BBGH details
    case ALERT_INVALID:
    case ALERT_INVALID_WHEN_SUBMIT:
      return state.setIn(
        ['system', 'status'],
        fromJS({ type: 'warning', message: action.message }),
      );
    case GET_INIT_BBGH_SUCCESS:
    case SET_INIT_RECEIVING_DELEVERY_ORDER:
    case GET_INIT_CREATED_BBGH_SUCCESS:
      return state.setIn(['system', 'loading'], false);
    case GET_INIT_BBGH:
    case UPDATE_BBGH:
    case GET_INIT_CREATED_BBGH:
    case CREATE_BBGH_FARM:
    case GET_INIT_RECEIVING_DELIVERY_ORDER:
      return state.setIn(['system', 'loading'], true);
    case CREATE_BBGH_SUCCESS:
    case UPDATE_BBGH_SUCCESS:
    case SAVE_PXK_SUCCESS:
    case UPDATE_RECEIVING_DELIVERY_ORDER_SUCCESS:
      return state
        .setIn(['system', 'loading'], false)
        .setIn(
          ['system', 'status'],
          fromJS({ type: 'success', message: action.res.message }),
        );
    // login
    case SUBMIT_LOGIN:
      return state.setIn(['system', 'loading'], true);
    case LOGIN_SUCCESS:
      // mapping function to each screen
      ability.update(mapping(action.res.accessToken));
      return state.withMutations(map => {
        map
          .setIn(['system', 'loading'], false)
          .setIn(['system', 'status'], false)
          .setIn(['auth', 'isAuthenticated'], true)
          .setIn(['auth', 'fullName'], fromJS(action.res.fullName))
          .setIn(['auth', 'userIdLogin'], action.res.userId);
      });
    case SAVE_MENU:
      return state
        .setIn(['auth', 'menu'], fromJS(action.menu.leftMenu))
        .setIn(['auth', 'header'], fromJS(action.menu.topMenu));
    case OPEN_DIALOG:
      return state.setIn(['ui', 'openDialog'], true);
    case CLOSE_DIALOG:
      return state.setIn(['ui', 'openDialog'], false);
    case CLOSE_SNACK_BAR:
      return state.setIn(['system', 'status'], false);
    case LOADING_ERROR:
      return state
        .setIn(['system', 'loading'], false)
        .setIn(['system', 'status'], fromJS(action.status));
    default:
      return state;
  }
}

export default appReducer;
