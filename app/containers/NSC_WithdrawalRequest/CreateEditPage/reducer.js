import { fromJS } from 'immutable';
// import { times } from 'lodash';

import {
  IN_PROGRESS,
  DEFAULT_BUSINESS_OBJECT,
  DEFAULT_PAYMENT_TYPE,
} from './constants';
// import { ProductSchema } from './Schema';

// ***************************************
// #region constants

export const SET_GENERAL_INFO = 'fc40/WithdrawalRequest/SET_GENERAL_INFO';
export const RESET_FORM = 'fc40/WithdrawalRequest/RESET_FORM';

// #endregion

// ***************************************
// #region actions

export function setGeneralInfo(info) {
  return {
    type: SET_GENERAL_INFO,
    info,
  };
}

export function resetForm() {
  return {
    type: RESET_FORM,
  };
}

// #endregion

export const initialState = fromJS({
  generalInfo: {
    retailRequestCode: '',
    status: IN_PROGRESS,
    level: 0,

    businessObject: DEFAULT_BUSINESS_OBJECT,
    date: new Date(),
    retailRequestCreateDate: new Date(),

    deliverCode: '',
    customerCode: '',
    customerName: '',

    retailCustomerId: 0,
    retailCustomerPhoneNumber: '',
    retailCustomerName: '',
    retailCustomerAddress: '',

    userId: '',
    userName: '',

    approverLevel1: '',
    approverLevelName1: '',
    approverLevel2: '',
    approverLevelName2: '',
    note: '',

    paymentType: DEFAULT_PAYMENT_TYPE,
    detailsCommands: [],
    approvalDetail: [],
  },
});

export const DETAILS_COMMANDS_KEY = 'detailsCommands';
export const APPROVAL_DETAIL_KEY = 'approvalDetail';

export default function WithdrawalRequestReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_FORM:
      return state.merge(initialState);

    case SET_GENERAL_INFO:
      return state.mergeDeepIn(['generalInfo'], action.info);
    // .setIn(['generalInfo', 'date'], new Date());
    default:
      return state;
  }
}
