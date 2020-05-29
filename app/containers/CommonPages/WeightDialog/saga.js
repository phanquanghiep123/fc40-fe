import { all, call, put, takeLeading } from '@redux-saga/core/effects';
import { requestAuth, PATH_GATEWAY } from 'utils/request';
import {
  transformBaskets,
  transformPallets,
} from 'components/GoodsWeight/utils';
import { loadingError, setLoading } from '../../App/actions';
import {
  GET_BASKETS_PALLETS,
  GET_BASKETS_PALLETS_SUCCESS,
  GET_CUSTOMER_AUTO,
} from './constants';

/**
 * Lấy dữ liệu khi mới vào page
 */
export function* getBasketsPalletsSaga() {
  try {
    yield put(setLoading());
    const [basketsResponse, palletsResponse] = yield all([
      call(
        requestAuth,
        `${
          PATH_GATEWAY.MASTERDATA_API
        }/pallet-baskets?pageSize=-1&sortDirection=asc`,
      ),
      call(
        requestAuth,
        `${PATH_GATEWAY.MASTERDATA_API}/pallets?pageSize=-1&sortDirection=asc`,
      ),
    ]);
    // checkStatus(basketsResponse);
    // checkStatus(palletsResponse);

    const payload = {
      baskets: transformBaskets(basketsResponse.data),
      pallets: transformPallets(palletsResponse.data),
    };
    yield put({ type: GET_BASKETS_PALLETS_SUCCESS, payload });

    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getCustomerAuto(action) {
  const { inputText, callback } = action;
  try {
    const requestURL = `${
      PATH_GATEWAY.RESOURCEPLANNING_API
    }/customer/autocomplete-distinct?filter=${inputText}`;
    const res = yield call(requestAuth, requestURL);
    yield callback(res.data);
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

// Individual exports for testing
export default function* weightDialogSaga() {
  yield takeLeading(GET_BASKETS_PALLETS, getBasketsPalletsSaga);
  yield takeLeading(GET_CUSTOMER_AUTO, getCustomerAuto);
}
