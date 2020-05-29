import { all, call, put, select, takeLeading } from '@redux-saga/core/effects';
import { loadingError, setLoading } from 'containers/App/actions';
import { transformBasket } from 'utils/basket/transformUtils';
import { localstoreUtilites } from 'utils/persistenceData';
import request, {
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  METHOD_REQUEST,
} from 'utils/request';
import * as constants from './constants';
import * as actions from './actions';
import { makeSelectData } from './selectors';

export const BFF_SPA_URL = PATH_GATEWAY.BFF_SPA_API;
const APIs = {
  getOrganizations: `${
    PATH_GATEWAY.AUTHORIZATION_API
  }/organizations/get-by-user`,
  search: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  exportExcel: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  getHistory: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
};

// const options = optionReq({
//   method: METHOD_REQUEST.GET,
//   body: null,
//   authReq: true,
// });

function* fetchFormDataSaga() {
  try {
    const auth = localstoreUtilites.getAuthFromLocalStorage();
    const [organizationsRespon, basketsResponse] = yield all([
      call(requestAuth, `${APIs.getOrganizations}?userId=${auth.meta.userId}`),
      call(requestAuth, `${PATH_GATEWAY.MASTERDATA_API}/pallet-baskets`),
    ]);
    const payload = {
      baskets: transformBasket(basketsResponse.data),
      // plant
      organizations: organizationsRespon.data,
    };
    yield put(actions.fetchFormSuccess(payload));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* exportExcel() {
  const data = yield select(makeSelectData());
  try {
    yield put(setLoading());
    const res = yield call(
      request,
      `${APIs.exportExcel}`,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: data.toJS().listPalletBasket,
        authReq: true,
      }),
    );
    console.log(res);
    yield put(setLoading(false));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* searchBasketSaga() {
  try {
    // const res = yield call(
    //   request,
    //   `${APIs.search}`,
    //   optionReq({
    //     method: METHOD_REQUEST.POST,
    //     body: action.params,
    //     authReq: true,
    //   }),
    // );
    const response = [
      {
        Checkbox: 1,
        plantName: 1,
        status: 1,
        palletBasketCode: 1,
        palletBasketName: 1,
        quantity: 1,
        boughtDate: 1,
        price: 1,
        valueRemain: 1,
        importedDateTo: 1,
        statusName: 'Sở hữu',
      },
      {
        Checkbox: 22,
        plantName: 22,
        status: 22,
        palletBasketCode: 22,
        palletBasketName: 22,
        quantity: 22,
        boughtDate: 22,
        price: 22,
        valueRemain: 12,
        importedDateTo: 12,
        statusName: 'Đã Hủy',
      },
      {
        Checkbox: 1,
        plantName: 1,
        status: 1,
        palletBasketCode: 1,
        palletBasketName: 1,
        quantity: 1,
        boughtDate: 1,
        price: 1,
        valueRemain: 1,
        importedDateTo: 1,
        statusName: 'Sở hữu',
      },
      {
        Checkbox: 22,
        plantName: 22,
        status: 22,
        palletBasketCode: 22,
        palletBasketName: 22,
        quantity: 22,
        boughtDate: 22,
        price: 22,
        valueRemain: 12,
        importedDateTo: 12,
        statusName: 'Đã Hủy',
      },
      {
        Checkbox: 1,
        plantName: 1,
        status: 1,
        palletBasketCode: 1,
        palletBasketName: 1,
        quantity: 1,
        boughtDate: 1,
        price: 1,
        valueRemain: 1,
        importedDateTo: 1,
        statusName: 'Sở hữu',
      },
      {
        Checkbox: 22,
        plantName: 22,
        status: 22,
        palletBasketCode: 22,
        palletBasketName: 22,
        quantity: 22,
        boughtDate: 22,
        price: 22,
        valueRemain: 12,
        importedDateTo: 12,
        statusName: 'Đã Hủy',
      },
      {
        Checkbox: 1,
        plantName: 1,
        status: 1,
        palletBasketCode: 1,
        palletBasketName: 1,
        quantity: 1,
        boughtDate: 1,
        price: 1,
        valueRemain: 1,
        importedDateTo: 1,
        statusName: 'Sở hữu',
      },
      {
        Checkbox: 22,
        plantName: 22,
        status: 22,
        palletBasketCode: 22,
        palletBasketName: 22,
        quantity: 22,
        boughtDate: 22,
        price: 22,
        valueRemain: 12,
        importedDateTo: 12,
        statusName: 'Đã Hủy',
      },
    ];

    yield put(actions.searchBasketSuccess(response));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* getHistorySaga() {
  try {
    const response = [
      {
        plantName: 11,
        status: 33,
        palletBasketCode: 11,
        palletBasketName: 2222,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 33,
        palletBasketCode: 11,
        palletBasketName: 2222,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 33,
        palletBasketCode: 11,
        palletBasketName: 2222,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 33,
        palletBasketCode: 11,
        palletBasketName: 2222,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
      {
        plantName: 11,
        status: 11,
        palletBasketCode: 11,
        palletBasketName: 11,
        quantity: 11,
      },
    ];

    yield put(actions.getHistorySuccess(response));
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export default function* ListOwnerBasketSagaWatchers() {
  yield takeLeading(constants.FETCH_FORM_DATA, fetchFormDataSaga);
  yield takeLeading(constants.EXPORT_EXCEL, exportExcel);
  yield takeLeading(constants.SEARCH_BASKET, searchBasketSaga);
  yield takeLeading(constants.GET_HISTORY, getHistorySaga);
}
