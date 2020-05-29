/* eslint-disable indent */
import { put, call, takeLeading } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import {
  optionReq,
  requestAuth,
  checkStatus,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';

import { setLoading, showSuccess, loadingError } from 'containers/App/actions';

import { bbgnhhRoutine } from './routines';
import { leadtimeRoutine } from '../CreatePage/routines';

import { sortStockList, transformDeliveryReceipt } from '../CreatePage/utils';

import { TYPE_BBGNHH } from '../CreatePage/constants';

// Đường dẫn Gateway
const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const CAPACITYCONTROL_URL = PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API;

// Init màn hình
export function* getInitMaster(action) {
  try {
    yield put(setLoading());

    const { id, type } = action.payload || {};

    const response = yield call(
      requestAuth,
      type !== TYPE_BBGNHH.ICD
        ? `${BFF_SPA_URL}/delivery-receipt/${id}`
        : `${BFF_SPA_URL}/delivery-receipt/icd/${id}`,
    );
    checkStatus(response);

    if (!response.data) {
      throw Error('Không lấy được thông tin Biên bản giao nhận hàng hóa');
    }

    const payload = {
      initialSchema: {
        ...response.data,
        // CR #9150
        deliveryReceiptTransports:
          response.data.deliveryReceiptTransports &&
          response.data.deliveryReceiptTransports.length
            ? [
                {
                  ...response.data.deliveryReceiptTransports[0],
                  transporterCodeLoadedFromServer: !!response.data
                    .deliveryReceiptTransports[0].transporterCode, // check if transporterCode is loaded from server
                },
              ]
            : [],
        deliveryReceiptStocks:
          type !== TYPE_BBGNHH.ICD
            ? response.data.deliveryReceiptStocks
            : sortStockList(response.data.deliveryReceiptStocks),
        deliveryReceiptBaskets:
          response.data.deliveryReceiptBaskets &&
          response.data.deliveryReceiptBaskets,

        deliverCode: {
          value: response.data.deliverCode,
          label: response.data.deliverName,
        },
        deliverCode1: response.data.deliverCode,
      },
    };
    yield put(bbgnhhRoutine.success(payload));

    const { deliverCode, customerCode } = response.data;
    if (deliverCode && customerCode) {
      yield put(leadtimeRoutine.request({ deliverCode, customerCode }));
    }

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Cập nhật BBGNHH
export function* performUpdateBBGNHH(action) {
  try {
    yield put(setLoading());

    const { id, data } = action.payload || {};
    data.deliverCode = data.deliverCode.value;
    const requestURL =
      data.deliveryReceiptType !== TYPE_BBGNHH.ICD
        ? `${CAPACITYCONTROL_URL}/delivery-receipt/${id}`
        : `${CAPACITYCONTROL_URL}/delivery-receipt/icd/${id}`;

    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.PUT,
        body: transformDeliveryReceipt(data),
      }),
    );
    checkStatus(response);

    yield put(push('/danh-sach-bien-ban-giao-nhan-hang-hoa'));
    yield put(showSuccess(response.message));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

/**
 * Saga watcher
 */
export default function* sagaWatcher() {
  yield takeLeading(bbgnhhRoutine.REQUEST, getInitMaster);
  yield takeLeading(bbgnhhRoutine.EDITING_REQUEST, performUpdateBBGNHH);
}
