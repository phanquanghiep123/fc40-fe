import {
  // take,
  call,
  put,
  select,
  // takeLatest,
  all,
  takeLeading,
} from 'redux-saga/effects';
import {
  loadingError,
  setLoading,
  showSuccess,
  showWarning,
} from 'containers/App/actions';
import find from 'lodash/find';
import { localstoreUtilites } from 'utils/persistenceData';
import * as selectors from './selectors';
import request, {
  checkStatus,
  METHOD_REQUEST,
  // responseCode,
  requestAuth,
  optionReq,
  PATH_GATEWAY,
  // checkStatus,
} from '../../../utils/request';

import * as constants from './constants';
import * as actions from './actions';
import { serializeQueryParams, convertDateString } from '../../App/utils';

const APIs = {
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getCauseAsset: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/cancellationrequestreceipt/baskets/reason-asset`,
  getById: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/adjust`,
  fetchPopupTable: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/palletbasketinfo/asset-inventories`, // POST
  getBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/palletbasketinfo/plant-baskets`, // POST - /{plantCode}
  submit: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/save`,
  getBigImageBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/adjust/image-basket-detail`, // /{id}
};

const auth = localstoreUtilites.getAuthFromLocalStorage();

export function* getValueFormSaga(action) {
  const formData = {};
  try {
    yield put(setLoading());
    const GETOption = optionReq({
      method: 'GET',
      authReq: true,
    });

    const [userRes, causeRes] = yield all([
      call(request, `${APIs.getUsers}`, GETOption),
      call(request, `${APIs.getCauseAsset}?reasonCode=4`, GETOption),
    ]);
    if (userRes.statusCode !== 200 || !causeRes.data) {
      yield put(
        showWarning(
          causeRes.message || 'Không lấy được thông tin người điều chỉnh',
        ),
      );
    }
    if (causeRes.statusCode !== 200 || !causeRes.data) {
      yield put(
        showWarning(
          causeRes.message || 'Không lấy được thông tin nguyên nhân hủy',
        ),
      );
    }

    formData.users = userRes.data.map(item => ({
      value: item.id,
      label: `${item.lastName} ${item.firstName}`,
    }));
    formData.cause = causeRes.data.map(item => ({
      value: item.id,
      label: item.name,
    }));

    yield put(actions.getValueFormSuccess(formData));

    yield getBasketById(action.payload, formData.cause);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getBasketById(payload, cause) {
  const { id } = payload;
  const currentDate = new Date();
  const GETOption = optionReq({
    method: 'GET',
    authReq: true,
  });
  try {
    const res = yield call(
      request,
      `${APIs.getById}/${id}` /* id */,
      GETOption,
    );
    checkStatus(res);
    const initValues = res.data;
    const formOption = yield select(selectors.formOptions());

    initValues.unitKK = {
      label: initValues.plantName,
      value: initValues.plantCode,
    };
    initValues.adjustmentDate = currentDate;
    const cancelBaskets = initValues.cancelBaskets.map(item => {
      let imageFiles = [];
      if (item.images) {
        imageFiles = item.images.map(img => ({
          id: img.id,
          fileName: img.fileName || '',
          previewData: img.image,
        }));
      }
      return {
        ...item,
        locator: `${item.locatorCode} ${item.locatorName}`,
        isAdjusted: item.isAdjusted,
        images: imageFiles,
      };
    });

    const newBaskets = initValues.newBaskets.map(item => ({
      ...item,
      locator: `${item.locatorCode} ${item.locatorName}`,
      isAdjusted: item.isAdjusted,
    }));

    const waitingCancelBaskets = initValues.waitingCancelBaskets.map(item => ({
      ...item,
      locator: `${item.locatorCode} ${item.locatorName}`,
      isAdjusted: item.isAdjusted,
      isAdjustedBefore: item.isAdjusted,
    }));
    if (initValues.adjustmentUserId) {
      initValues.adjustmentUserId = find(formOption.toJS().users, {
        value: initValues.adjustmentUserId,
      });
    } else
      initValues.adjustmentUserId = find(formOption.toJS().users, {
        value: auth.meta.userId,
      });

    const cancelBasketAdjusteds = initValues.cancelBasketAdjusteds.map(item => {
      let imageFiles = [];
      let adjustUser = '';
      if (item.images) {
        imageFiles = item.images.map(img => ({
          id: img.id,
          fileName: img.fileName || '',
          previewData: img.image,
        }));
      }
      if (item.adjustmentUserId) {
        adjustUser = find(formOption.toJS().users, {
          value: item.adjustmentUserId,
        }).label;
      }
      return {
        ...item,
        locator: `${item.locatorCode} ${item.locatorName}`,
        images: imageFiles,
        adjustmentUser: adjustUser,
        adjustmentDate: convertDateString(item.adjustmentDate),
      };
    });
    const newBasketAdjusteds = initValues.newBasketAdjusteds.map(item => {
      let adjustUser = '';
      if (item.adjustmentUserId) {
        adjustUser = find(formOption.toJS().users, {
          value: item.adjustmentUserId,
        }).label;
      }
      return {
        ...item,
        locator: `${item.locatorCode} ${item.locatorName}`,
        adjustmentUser: adjustUser,
        adjustmentDate: convertDateString(item.adjustmentDate),
      };
    });

    initValues.cancelBaskets = cancelBaskets;
    initValues.newBaskets = newBaskets;
    initValues.waitingCancelBaskets = waitingCancelBaskets;
    initValues.assetInfo = initValues.assetInfo || [];
    initValues.cancelBasketAdjusteds = cancelBasketAdjusteds;
    initValues.assetCancelAdjusteds = initValues.assetCancelAdjusteds || [];
    initValues.newBasketAdjusteds = newBasketAdjusteds;
    initValues.waitingCancelBasketAdjusteds = [];
    initValues.initAssetTable = {
      cause: cause[1],
      basketLocatorCode: null,
      org: null,
      palletBasket: null,
      palletBasketName: null,
      cancelValue: 0,
      inventoryQuantity: null,
      cancelQuantity: null,
      uoM: null,
      assetInfo: [],
      isSubmit: false, // true => when click buttons select baskets
    };
    yield put(actions.initValue(initValues));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchPopupTableDataSaga(action) {
  try {
    yield put(setLoading());
    const { filters, assetsTable } = action.payload;
    const checked = find(assetsTable, {
      basketStocktakingDetailId: filters.id,
    });
    const queryParams = {
      quantityCancellation: filters.expectAdjustQuantity
        ? Math.abs(filters.expectAdjustQuantity)
        : 0,
      quantityInventory: filters.inventoryQuantity,
      palletBasketCode: filters.basketCode,
      idBasket: filters.id,
      isAdjust: checked ? true : null,
      isFirstClick: true,
    };
    let body = [];
    if (assetsTable) {
      body = assetsTable.filter(item => !!item).map(item => ({
        assetCode: item.assetCode,
        palletBasketCode: item.palletBasketCode,
        quantity: item.cancelQuantity ? parseInt(item.cancelQuantity, 10) : 0,
        idBasket: item.basketStocktakingDetailId,
        id: item.id,
      }));
    }
    const queryStr = serializeQueryParams(queryParams);
    const res = yield call(
      request,
      `${APIs.fetchPopupTable}?${queryStr}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );
    if (res.statusCode !== 200 || !res.data) {
      throw Object({
        message: res.message || 'Không lấy được thông tin tài sản',
      });
    }

    const mappedData = res.data.map(item => ({
      assetCode: item.assetCode,
      ownerCode: item.ownerCode,
      ownerName: item.ownerName,
      unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : 0,
      currentUnitPrice: item.currentUnitPrice
        ? parseFloat(item.currentUnitPrice)
        : 0,
      ownQuantity: item.quantity ? parseInt(item.quantity, 10) : 0,
      cancelQuantity: item.quantityCancellation
        ? parseInt(item.quantityCancellation, 10)
        : 0,
      difference:
        parseInt(item.quantity, 10) - parseInt(item.quantityCancellation, 10),
      seqFC: item.seqFC,
      depreciationRemaining: item.depreciationRemaining,
      inventoryQuantity: item.inventoryQuantity,
    }));
    yield put(actions.fetchPopupTableDataSuccess(mappedData));
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* fetchPopupBasketSaga(action) {
  try {
    const {
      formik,
      basketLocatorCode,
      isEdit,
      data,
      callback,
    } = action.payload;
    if (!basketLocatorCode) {
      throw Object({
        message: 'Thiếu thông tin kho nguồn. Vui lòng thử lại.',
      });
    }
    const queryParams = {
      plantCode: formik.values.plantCode,
      basketLocatorId: basketLocatorCode,
      isEdit,
      isAdjust: true,
      idBasket: data.id,
    };
    const queryStr = serializeQueryParams(queryParams);

    const baskets = formik.values.cancelBaskets;
    const body = baskets.map(item => ({
      basketLocatorId: item.locatorId,
      palletBasketCode: item.basketCode,
      quantity: item.expectAdjustQuantity
        ? Math.abs(item.expectAdjustQuantity)
        : 0,
      // quantity: item.differenceBeforeStocktalking
      //   ? Math.abs(item.differenceBeforeStocktalking)
      //   : 0,
      idBasket: item.id,
    }));

    const res = yield call(
      request,
      `${APIs.getBasket}?${queryStr}`,
      optionReq({ method: 'POST', body, authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      const dataAsset = {
        org: formik.values.unitKK,
        basketLocatorCode: { label: data.locatorName, value: data.locatorId },
        palletBasket: {
          value: data.basketCode,
          label: data.basketName,
        },
        palletBasketName: data.basketName,
        cancelValue: 0,
        inventoryQuantity: data.inStockOriginal,
        cancelQuantity: Math.abs(data.expectAdjustQuantity),
        uoM: data.uoM,
        cause: { value: data.reasonCode, label: data.reasonName },
      };
      yield put(actions.changeValueAsset(dataAsset));
      throw Object({
        message: res.message || 'Không lấy được thông tin mã khay sọt',
      });
    }
    const mappedData = res.data.map(item => ({
      value: item.palletBasketCode,
      label: `${item.palletBasketCode} ${item.palletBasketShortName}`,
      palletBasketCode: item.palletBasketCode,
      palletBasketName: item.palletBasketShortName,
      inStock: item.quantity,
      inStockOriginal: item.stockQuantity,
      uom: item.uoM || item.uom,
    }));
    const palletBasket = find(mappedData, {
      palletBasketCode: data.basketCode,
    });
    const dataAsset = {
      org: formik.values.unitKK,
      basketLocatorCode: { label: data.locatorName, value: data.locatorId },
      palletBasket: {
        value: palletBasket.palletBasketCode,
        label: palletBasket.palletBasketName,
      },
      palletBasketName: palletBasket.palletBasketName,
      cancelValue: 0,
      inventoryQuantity: palletBasket.inStockOriginal,
      cancelQuantity: Math.abs(data.expectAdjustQuantity),
      uoM: palletBasket.uom,
      cause: { value: data.reasonCode, label: data.reasonName },
    };
    yield put(actions.changeValueAsset(dataAsset));
    yield put(actions.fetchPopupTableData(data, formik.values.assetCancels));
    yield put(actions.fetchPopupBasketSuccess(mappedData));
    if (callback) yield callback(mappedData);
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export function* submitSaveAdjust(action) {
  try {
    const { actionType, data, callback } = action || {};
    yield put(setLoading());
    let hasMess = false;
    const notExport = [];
    if (data.documents.length > 0) {
      data.documents.forEach(item => {
        // Nếu là phiếu yêu cầu hủy và có trạng thái khác đã xuất
        if (item.check === 2 && item.status === 0) {
          notExport.push(item.code);
        }
      });
    }
    if (data.cancelBaskets.length === 0 && data.newBaskets.length === 0) {
      if (notExport.length > 0) {
        throw Object({
          message: `Không còn khay sọt cần điều chỉnh. Cần thực hiện xuất hủy ở PYCH ${notExport.join(
            ',',
          )}`,
        });
      } else {
        throw Object({
          message: 'Không còn khay sọt cần điều chỉnh',
        });
      }
    }
    if (data.cancelBaskets.length > 0) {
      data.cancelBaskets.forEach(item => {
        if (item.isAdjusted) {
          hasMess = true;
        }
      });
    }
    if (hasMess) {
      let mess =
        'Chưa nhập thông tin tài sản sở hữu tương ứng Mã kho_mã khay sọt :';
      const listMess = [];
      let itemsProcessed = 0;
      data.cancelBaskets.forEach((item, index, array) => {
        if (item.isAdjusted) {
          if (data.assetCancels.length === 0) {
            listMess.push(`${item.locatorId}_${item.basketCode}`);
          } else {
            const check = find(data.assetCancels, {
              basketStocktakingDetailId: item.id,
            });
            if (!check) {
              listMess.push(`${item.locatorId}_${item.basketCode}`);
            }
          }
        }
        // eslint-disable-next-line no-plusplus
        itemsProcessed++;
        if (itemsProcessed === array.length) {
          if (listMess.length > 0) {
            listMess.forEach((str, ind) => {
              if (ind === 0) {
                mess += ` ${str}`;
              } else {
                mess += `, ${str}`;
              }
            });
          } else {
            mess = ``;
          }
        }
      });
      if (mess) {
        throw Object({
          message: mess,
        });
      }
    }
    const requestURL = `${APIs.submit}`;
    const cancelBaskets = data.cancelBaskets.map(item => {
      let imageFiles = [];
      if (item.images && item.images.length > 0) {
        imageFiles = item.images.map(img => ({
          ...(img.id ? { id: img.id } : {}),
          fileName:
            img.newlyUploaded && img.file ? img.file.name : img.fileName || '',
          file: img.previewData,
          isDelete: img.markedDelete,
        }));
      }
      return {
        ...item,
        expectAdjustQuantity: Math.abs(item.expectAdjustQuantity),
        images: imageFiles,
      };
    });
    const dataSubmit = {
      id: data.id,
      basketStocktakingCode: data.basketStocktakingCode,
      adjustmentDate: data.adjustmentDate,
      adjustmentUserId: data.adjustmentUserId.value,
      type: actionType,
      cancelBaskets,
      newBaskets: data.newBaskets,
      waitingCancelBaskets: data.waitingCancelBaskets,
      assetCancels: data.assetCancels,
    };
    const response = yield call(
      requestAuth,
      requestURL,
      optionReq({
        method: METHOD_REQUEST.POST,
        authReq: true,
        body: dataSubmit,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));

    const payload = {
      data,
    };
    yield put(actions.saveAdjustSubmitSuccess(payload));
    if (callback) {
      yield callback();
    }
  } catch (error) {
    yield put(loadingError(error.message));
  }
}

export function* fetchBigImageBasketSaga(action) {
  try {
    yield put(setLoading());
    const { id, callback } = action;
    const res = yield call(
      request,
      `${APIs.getBigImageBasket}/${id}`,
      optionReq({ method: 'GET', authReq: true }),
    );

    if (res.statusCode !== 200 || !res.data) {
      throw Object({ message: res.message || 'Lấy thông tin ảnh thất bại' });
    }

    yield callback(res.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* adjustStocktakingSaga() {
  yield takeLeading(constants.GET_VALUE_FORM, getValueFormSaga);
  yield takeLeading(constants.FETCH_POPUP_TABLE_DATA, fetchPopupTableDataSaga);
  yield takeLeading(constants.FETCH_POPUP_BASKET, fetchPopupBasketSaga);
  yield takeLeading(constants.SAVE_ADJUST_BASKET_STOCKTAKING, submitSaveAdjust);
  yield takeLeading(constants.FETCH_BIG_IMAGE_BASKET, fetchBigImageBasketSaga);
}
