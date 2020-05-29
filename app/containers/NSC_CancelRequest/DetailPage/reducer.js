import { fromJS } from 'immutable';
import * as constants from './constants';
import { localstoreUtilites } from '../../../utils/persistenceData';

const { meta } = localstoreUtilites.getAuthFromLocalStorage();

export const initialState = fromJS({
  // data to render select boxes
  selectBoxData: {
    status: [],
    org: [],
    basketLocatorCode: [], // kho nguồn theo đơn vị
    reason: [], // lý do hủy
    cause: [], // nguyên nhân hủy của sản phẩm
    causeAsset: [], // nguyên nhân huỷ của tài sản
    popupBasket: [], // mã khay sọt ở popup chọn tài sản
  },
  [constants.GENERAL_INFO_SECTION]: {
    defaultValues: {
      code: '',
      status: '',
      createdAt: null,
      org: '',
      reason: '',
      accumulatedValue: '',
      estValue: '0',
      totalCancelValue: '0', // giá trị huỷ tạm tính
      totalCurrentCancelValue: '0', // giá trị huỷ hiện tại
      indexLink: 0,
      requester: {
        value: meta.userId,
        label: meta.fullName,
      },
      approver1: null,
      approver2: null,
      approver3: null,
      note: '',
    },
  },
  receiptData: {},
  isDraftSelected: false, // check xem status được chọn có phải là nháp không
});

function CancelRequestDetailPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_FORM_DATA_SUCCESS: {
      const { formData: fd } = action;
      const { GENERAL_INFO_SECTION } = constants;
      const values = {
        status: fd.status && fd.status.length > 0 ? fd.status[0].value : '',
        org: fd.org && fd.org[0],
        reason: fd.reason && fd.reason.length > 0 ? fd.reason[0].value : '',
        cause: fd.cause && fd.cause.length > 0 ? fd.cause[0].value : '',
      };
      return state
        .set('selectBoxData', fromJS(fd))
        .setIn([GENERAL_INFO_SECTION, 'defaultValues', 'status'], values.status)
        .setIn([GENERAL_INFO_SECTION, 'defaultValues', 'org'], values.org)
        .setIn([GENERAL_INFO_SECTION, 'defaultValues', 'reason'], values.reason)
        .setIn(
          [GENERAL_INFO_SECTION, 'defaultValues', 'accumulatedValue'],
          fd.accumulatedValue,
        );
    }

    case constants.FETCH_RECEIPT_DATA_SUCCESS:
      return state.set('receiptData', fromJS(action.receiptData));

    case constants.FETCH_CAUSE_ASSET_SUCCESS:
      return state.setIn(
        ['selectBoxData', 'causeAsset'],
        fromJS(action.payload.data),
      );

    case constants.FETCH_POPUP_BASKET_SUCCESS:
      return state.setIn(
        ['selectBoxData', 'popupBasket'],
        fromJS(action.payload.data),
      );

    case constants.FETCH_BASKET_LOCATORS_SUCCESS:
      return state.setIn(
        ['selectBoxData', 'basketLocatorCode'],
        fromJS(action.payload.data),
      );

    case constants.FETCH_STATUS_DATA_SUCCESS: {
      const { data } = action.payload;
      return state.setIn(['selectBoxData', 'status'], fromJS(data));
    }

    case constants.CHECK_IS_DRAFT_SELECTED:
      return state.set('isDraftSelected', action.payload.isDraftSelected);

    default:
      return state;
  }
}

export default CancelRequestDetailPageReducer;
