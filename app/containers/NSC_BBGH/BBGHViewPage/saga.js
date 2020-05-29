/**
 * Gets the repositories of the user from Github
 */

import { all, call, put, takeLeading } from 'redux-saga/effects';

import {
  basketGroup,
  transformStockList,
} from 'containers/NSC_BBGH/BBGHCreatePage/section4Utils';
import { loadingError, setLoading } from 'containers/App/actions';
import { isArray } from 'lodash';
import request, {
  optionReq,
  METHOD_REQUEST,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import {
  GET_INIT_BBGH,
  PRINT_BBGH,
  DELETE_IMAGE,
  EXPORT_EXCEL,
} from './constants';
import { getInitBBGHSuccess } from './actions';
import { initSchema } from './Schema';
import { makeSaveFileFunc } from '../../App/utils';

export function* getInitPage(action) {
  try {
    // call api get BBGH by id
    const [resEditBBGH] = yield all([
      call(
        request,
        `${
          PATH_GATEWAY.BFF_SPA_API
        }/deliveryOrders/update-screen?deliveryOrderId=${
          action.idBBGH
        }&includeImages=true`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
    ]);

    if (!resEditBBGH.deliveryOrder) {
      throw Object({ message: resEditBBGH.message });
    }

    // test case
    // resEditBBGH.deliveryOrder.shipperList[0].unregulatedLeadtime = false;
    // resEditBBGH.deliveryOrder.doType = 4; // loại BBGH
    // resEditBBGH.deliveryOrder.deliverOrReceiver = 1; // loại người giao/nhận/giao-nhận
    // resEditBBGH.deliveryOrder.status = 1; // BBGH chưa tiếp nhận, 2: đã tiếp nhận

    // resEditBBGH.deliveryOrder.stockList[0].receivingStockFlag = 0; // đã cân nhập kho
    // resEditBBGH.deliveryOrder.shipperList = []; // list vận chuyển
    // Call typeBBGH and units by id of user have login

    // caculate for section 5
    resEditBBGH.deliveryOrder.basketsTrays = basketGroup(
      resEditBBGH.deliveryOrder.stockList,
    );
    const editBBGH = resEditBBGH.deliveryOrder;
    editBBGH.stockList = transformStockList(editBBGH.stockList);
    editBBGH.basketsInfor = resEditBBGH.basketInfo;

    if (isArray(editBBGH.shipperList) && editBBGH.shipperList.length === 0) {
      editBBGH.shipperList = initSchema.shipperList;
    }

    if (!editBBGH.receivingPersonPhone) {
      editBBGH.receivingPersonPhone = '';
    }

    if (!editBBGH.deliveryPersonPhone) {
      editBBGH.deliveryPersonPhone = '';
    }

    if (!editBBGH.updatedTimes) {
      editBBGH.updatedTimes = '';
    }

    if (!editBBGH.sealStatus) {
      editBBGH.sealStatus = '';
    }

    if (!editBBGH.receivingPersonName) {
      editBBGH.receivingPersonName = '';
    }

    yield put(
      getInitBBGHSuccess({
        resEditBBGH: editBBGH,
      }),
    );
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* printBBGH(action) {
  try {
    yield put(setLoading());
    // call api get BBGH by id
    const res = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/deliveryOrders/print?ids=${[action.id]}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );
    if (!res.data) {
      throw Object({ message: 'Không có thông tin in BBGH' });
    }
    // call print method
    action.callback(res.data);
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* deleteImage(action) {
  try {
    yield put(setLoading());
    // call api get BBGH by id
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/deliveryorders/${
        action.idBBGH
      }/violation/${action.idImage}`,
      optionReq({
        method: METHOD_REQUEST.DELETE,
        body: null,
        authReq: true,
      }),
    );
    if (res.statusCode !== responseCode.ok) {
      throw Object({ message: res.message });
    }
    // call print method
    action.callback();
    yield put(setLoading(false));
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* exportExcel(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/deliveryorders/export-excel-detail?id=${
        action.id
      }`,
      optionReq({
        method: 'GET',
        authReq: true,
      }),
      makeSaveFileFunc(),
    );

    if (response.status !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  yield takeLeading(GET_INIT_BBGH, getInitPage);
  yield takeLeading(PRINT_BBGH, printBBGH);
  yield takeLeading(EXPORT_EXCEL, exportExcel);
  yield takeLeading(DELETE_IMAGE, deleteImage);
}
