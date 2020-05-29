import { all, call, put, select, takeLeading } from 'redux-saga/effects';
import { loadingError, setLoading, showSuccess } from 'containers/App/actions';
import request, {
  optionReq,
  requestAuth,
  PATH_GATEWAY,
  checkStatus,
  METHOD_REQUEST,
} from 'utils/request';
import { localstoreUtilites } from 'utils/persistenceData';
import dateFns from 'date-fns';
import { groupBy } from 'lodash';
import * as actions from './actions';
import {
  GET_INIT_FORM_DATA,
  TYPE_FORM,
  CREATE,
  COMPLETE,
  REMOVE_RECORD_SECTION3,
  REMOVE_RECORD_SECTION4,
  GET_LOCATOR,
  GET_SECTION4,
  GET_SECTION5,
  GET_QUANTITY,
  CANCEL,
  COMPLETE_INVENTORY,
  GET_LOCATOR_BY_BASKET,
  PRINT,
} from './constants';
import { convertDateTimeString, serializeQueryParams } from '../App/utils';
import { selectFormData } from './selectors';

const APIs = {
  getPlant: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
  getBasket: `${PATH_GATEWAY.RESOURCEPLANNING_API}/pallet-baskets`,
  create: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/basket-stocktaking-save`,
  complete: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/basket-stocktaking-complete`,
  deleteBasketSection4: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/stocktaking-detail-delete`,
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getSection4: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/stocktaking-locator`,
  getSection5: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/basket-stocktaking-by-way`,
  getTypeStocktaking: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/stocktaking-type`,
  getLocator: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/stocktaking-locator-type`,
  getQuantity: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/exportedstockreceipts-basket/get-data-pallet-basket`,
  getDetail: `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/basket-stocktaking`,
  cancel: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/cancel`,
  completeInventory: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/basket-stocktaking-detail-complete`,
  getLocatorByBasket: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/get-basket-locator`,
  print: `${PATH_GATEWAY.BFF_SPA_API}/basket-stocktaking/print`,
};

function* getInitFormData(action) {
  const { userId } = localstoreUtilites.getAuthFromLocalStorage().meta;
  try {
    yield put(setLoading());
    const [baskets, plants, users, stocktakingType] = yield all([
      call(requestAuth, APIs.getBasket),
      call(requestAuth, `${APIs.getPlant}?userId=${userId}`),
      call(requestAuth, APIs.getUsers),
      call(requestAuth, APIs.getTypeStocktaking),
    ]);
    const data = {
      stocktakingType: stocktakingType.data.map(item => ({
        value: item.id,
        label: item.name,
      })),
      baskets: baskets.data.map(item => ({
        basketCode: item.palletBasketCode,
        basketName: item.shortName,
        weight: item.netWeight,
        uoM: item.uoM,
      })),
      plants: plants.data.map(item => ({
        value: item.value,
        label: item.name,
        regionName: item.region.name,
      })),
      users: users.data.map(item => ({
        value: item.id,
        phoneNumber: item.phoneNumber,
        label: `${item.lastName} ${item.firstName}`,
      })),
    };
    if (action.data.form === TYPE_FORM.CREATE) {
      yield initForm(plants.data, stocktakingType.data);
      yield put(actions.initFormDataSuccess(data));
      yield getLocator(
        { data: { plantCode: plants.data[0].value } },
        action.data.form,
      );
      yield getSection5({ data: plants.data[0].value });
    } else {
      yield put(actions.initFormDataSuccess(data));
      yield getDetail(action.data, users, action.data.form);
    }

    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* initForm(plants, type) {
  const {
    userId,
    fullName,
    phoneNumber,
  } = localstoreUtilites.getAuthFromLocalStorage().meta;
  const items = [];
  for (let i = 0; i < 5; i += 1) {
    items.push({ stt: i + 1 });
  }
  const initValues = {};
  initValues.doWorkingUnitCode = {
    value: plants[0].value,
    label: plants[0].name,
  };
  initValues.regionName = plants[0].region.name;
  // section1
  initValues.status = '';
  initValues.statusName = '';
  initValues.stocktakingType = type[0].id;
  initValues.stocktakingRound = dateFns.format(new Date(), 'yyyyMM');
  initValues.reason = '';
  initValues.createDate = new Date();
  initValues.date = new Date();
  initValues.userId = {
    value: userId,
    label: fullName,
  };
  initValues.plantUnitCode = {
    value: plants[0].value,
    label: plants[0].name,
  };
  initValues.note = '';

  // section2
  initValues.plantName = plants[0].name;
  initValues.plantCode = plants[0].value;
  initValues.delegateId = {
    value: userId,
    label: fullName,
  };
  initValues.phoneNumber = phoneNumber;

  initValues.infoImplementStocktaking = [
    {
      userName: fullName,
      userId,
      phoneNumber,
    },
  ]; // section3
  initValues.infoBasketStocktaking = []; // section4
  initValues.infoBasketByWayStocktaking = []; // section5
  initValues.resultStocktakingByBasket = []; // section6
  initValues.handleAfterStocktaking = []; // section7
  initValues.locatorCode = []; // lưu kho nguồn hiển thị lên màn hình
  initValues.locatorCode1 = []; // lưu kho nguồn để so sánh và gọi api
  initValues.locatorCode2 = []; // lưu kho nguồn disable
  yield put(actions.initValue(initValues));
}

// gọi api chi tiết và khởi tạo giá trị màn xem, sửa, hủy kết quả
function* getDetail(action, users, form) {
  const response = yield call(
    request,
    `${APIs.getDetail}/${action.id}`,
    optionReq(),
  );
  checkStatus(response);
  // Người Tạo BB
  const user = users.data.find(item => item.id === response.data.userId);
  let userName = '';
  if (user) {
    userName = user.lastName ? `${user.lastName} ${user.firstName}` : '';
  }

  const delegate = users.data.find(
    item => item.id === response.data.delegateId,
  );
  let delegateName = '';
  let phoneNumber = '';
  if (delegate) {
    delegateName = delegate.lastName
      ? `${delegate.lastName} ${delegate.firstName}`
      : '';
    phoneNumber = delegate.phoneNumber ? delegate.phoneNumber : '';
  }
  const arrLocator = [];

  const initValues = {
    basketStocktakingCode: response.data.basketStocktakingCode,
    status: response.data.status,
    afterStatus: response.data.afterStatus,
    // section1
    statusName: response.data.statusName,
    stocktakingType: response.data.stocktakingType,
    stocktakingTypeName: response.data.stocktakingTypeName,

    stocktakingRound: response.data.stocktakingRound,
    reason: response.data.reason,
    createDate: new Date(response.data.createDate),
    date: new Date(response.data.date),
    userId: {
      value: response.data.userId,
      label: userName,
    },
    plantUnitCode: {
      value: response.data.plantUnitCode,
      label: response.data.plantUnitName,
    },
    note: response.data.note,

    // section2
    plantName: response.data.plantName,
    plantCode: response.data.plantCode,
    delegateId: {
      value: response.data.delegateId,
      label: delegateName,
    },
    phoneNumber,

    // section3
    infoImplementStocktaking: response.data.infoImplementStocktaking.map(
      item => {
        const mainUser = users.data.find(e => e.id === item.userId);
        return {
          ...item,
          phoneNumber: mainUser.phoneNumber,
          userName: `${mainUser.lastName} ${mainUser.firstName}`,
        };
      },
    ),

    // section4
    infoBasketStocktaking: response.data.infoBasketStocktaking.map(item => {
      arrLocator.push({
        ...item,
        value: item.basketLocatorId,
        label: `${item.basketLocatorCode} ${item.basketLocatorName}`,
      });
      return {
        ...item,
        basketLocator: `${item.basketLocatorCode} ${item.basketLocatorName}`,
        basketStocktakingCode: response.data.basketStocktakingCode,
        disable: true,
      };
    }),

    // section5
    infoBasketByWayStocktaking: response.data.infoBasketByWayStocktaking.map(
      item => ({
        ...item,
      }),
    ),

    // section6
    resultStocktakingByBasket: response.data.resultStocktakingByBasket.map(
      item => ({
        ...item,
      }),
    ),

    // section7
    handleAfterStocktaking: response.data.handleAfterStocktaking.map(item => ({
      ...item,
      date: convertDateTimeString(item.date),
    })),
  };

  const locators = [];
  const locators2 = [];
  const getKey = value =>
    `${value.basketLocatorCode}_${value.basketLocatorName}`;
  const grouped = groupBy(arrLocator, value => getKey(value));

  Object.keys(grouped).forEach(item => {
    const itemDisable = [];
    grouped[item].forEach(subItem => {
      if (subItem.stocktakingQuantity > 0) {
        itemDisable.push(item);
      }
    });
    const locatorCodeArr = {
      basketLocatorCode: grouped[item][0].basketLocatorCode,
      label: `${grouped[item][0].basketLocatorCode}_${
        grouped[item][0].basketLocatorName
      }`,
      locatorName: grouped[item][0].basketLocatorName,
      value: grouped[item][0].basketLocatorId,
      disable: true,
    };
    locators.push(locatorCodeArr);
    locators2.push(locatorCodeArr);
    // if (itemDisable.length === 0) {
    //   locators.push({
    //     basketLocatorCode: grouped[item][0].basketLocatorCode,
    //     label: `${grouped[item][0].basketLocatorCode}_${
    //       grouped[item][0].basketLocatorName
    //     }`,
    //     locatorName: grouped[item][0].basketLocatorName,
    //     value: grouped[item][0].basketLocatorId,
    //   });
    // } else {
    //   const locatorCodeArr = {
    //     basketLocatorCode: grouped[item][0].basketLocatorCode,
    //     label: `${grouped[item][0].basketLocatorCode}_${
    //       grouped[item][0].basketLocatorName
    //     }`,
    //     locatorName: grouped[item][0].basketLocatorName,
    //     value: grouped[item][0].basketLocatorId,
    //     disable: true,
    //   };
    //   locators.push(locatorCodeArr);
    //   locators2.push(locatorCodeArr);
    // }
  });
  initValues.locatorCode = locators;
  initValues.locatorCode1 = [];
  initValues.locatorCode2 = locators2;
  yield put(actions.initValue(initValues));
  yield getLocator(
    {
      data: {
        plantCode: response.data.plantCode,
      },
    },
    form,
    response.data.id,
  );
}

function* complete(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      APIs.complete,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.data,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* create(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      APIs.create,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.data,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* deleteRecordSection3(action) {
  try {
    yield put(actions.removeRecordSection3Success(action.data));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// api xóa dòng vùng 4
function* deleteRecordSection4(action) {
  const { rowData, rowIndex, basketStocktakingId, form } = action.data;
  try {
    if (form === TYPE_FORM.EDIT && rowData.id) {
      const response = yield call(
        request,
        `${
          APIs.deleteBasketSection4
        }?basketStocktakingId=${basketStocktakingId}&basketStocktakingDetailId=${
          rowData.id
        }`,
        optionReq({
          method: METHOD_REQUEST.DELETE,
          authReq: true,
        }),
      );
      checkStatus(response);
      yield put(showSuccess(response.message));
    }

    yield put(actions.removeRecordSection4Success(rowIndex));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// api get danh sách các kho hiển thị ở trường Đối tượng kho kiểm kê, gọi khi thay đổi đơn vị
function* getLocator(action, form) {
  const queryStr = serializeQueryParams(action.data);

  try {
    const res = yield call(
      request,
      `${APIs.getLocator}?${queryStr}`,
      optionReq(),
    );
    checkStatus(res);
    const arr = [];
    res.data.forEach(item => {
      arr.push({
        value: item.basketLocatorId,
        label: `${item.basketLocatorCode} ${item.description}`,
        basketLocatorCode: item.basketLocatorCode,
        locatorName: item.description,
      });
    });
    yield put(actions.getLocatorSuccess({ arr, form }));
    if (form === TYPE_FORM.CREATE) {
      yield getSection4(
        {
          data: {
            plantCode: action.data.plantCode,
          },
        },
        form,
      );
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// api get section4 mỗi khi thay đổi Đối tượng kho kiểm kế vùng 4
function* getSection4(action, form) {
  const params = yield select(selectFormData());
  const paramsParse = params.toJS();
  const payload = {
    plantCode: action.data.plantCode,
    stocktakingId: action.data.stocktakingId,
    locatorId: action.data.locatorId,
  };
  const queryStr = serializeQueryParams(payload);
  try {
    const res = yield call(
      request,
      `${APIs.getSection4}?${queryStr}`,
      optionReq(),
    );
    checkStatus(res);
    const data = [];
    const infoBasketStocktaking = [];
    res.data.forEach(item => {
      const subItem = {
        ...item,
        basketLocator: `${item.locatorCode} ${item.locatorName}`,
        documentQuantity: item.quantity,
        disable: true,
      };
      data.push(subItem);
      if (
        action.data.value &&
        !action.data.value.includes(item.basketLocatorId)
      ) {
        infoBasketStocktaking.push(subItem);
      }
    });

    let mainData;
    if (paramsParse.locatorCode && paramsParse.locatorCode.length === 1) {
      mainData = data;
    } else if (!action.data.locatorId) {
      if (action.data.infoBasketStocktaking) {
        mainData = infoBasketStocktaking.concat(
          action.data.infoBasketStocktaking,
        );
      } else {
        mainData = data;
      }
    } else {
      const section4 = [];
      paramsParse.infoBasketStocktaking.forEach(item => {
        if (item.basketCode) {
          section4.push(item);
        }
      });
      mainData = section4.concat(data);
    }
    const keyData = [];
    const grouped = groupBy(mainData, subValue => `${subValue.locatorCode}`);
    Object.keys(grouped).forEach(item => {
      grouped[item].sort((a, b) => (a.basketCode > b.basketCode ? 1 : -1));
      grouped[item].forEach(subItem => {
        keyData.push(subItem);
      });
    });
    yield put(actions.getSection4Success(keyData, form));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// api get section 5 mỗi khi thay đổi đơn vị
function* getSection5(action) {
  try {
    const res = yield call(
      request,
      `${APIs.getSection5}?plantCode=${action.data}`,
      optionReq(),
    );
    checkStatus(res);
    const data = [];
    res.data.forEach(item => {
      data.push({
        ...item,
      });
    });
    yield put(actions.getSection5Success(data));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* getQuantity(action) {
  const queryStr = serializeQueryParams(action.data);
  try {
    const res = yield call(
      request,
      `${APIs.getQuantity}?${queryStr}`,
      optionReq(),
    );
    checkStatus(res);
    if (action.callback) {
      yield action.callback(res.data);
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// api hủy phiếu màn hủy BBKK
function* cancel(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      APIs.cancel,
      optionReq({
        method: METHOD_REQUEST.POST,
        body: action.data,
        authReq: true,
      }),
    );
    yield put(setLoading(false));
    checkStatus(response);
    yield put(showSuccess(response.message));
    if (action.callback) {
      yield action.callback(response.data);
    }
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// api button kiểm kê xong
function* completeInventory(action) {
  const { data, rowIndex, stocktakingId } = action.data;
  try {
    const body = {
      stocktakingId,
      id: data.id ? data.id : 0,
      basketCode: data.basketCode,
      basketStocktakingDetail: {
        id: data.id ? data.id : 0,
        basketStocktakingCode: data.basketStocktakingCode,
        basketCode: data.basketCode,
        status: data.status,
        locatorId: data.basketLocatorId,
        uoM: data.uoM,
        documentQuantity: data.documentQuantity ? data.documentQuantity : 0,
        stocktakingQuantity: data.stocktakingQuantity
          ? data.stocktakingQuantity
          : 0,
        note: data.note,
      },
    };

    yield put(setLoading());
    const response = yield call(
      request,
      APIs.completeInventory,
      optionReq({
        method: METHOD_REQUEST.POST,
        body,
        authReq: true,
      }),
    );
    checkStatus(response);
    yield put(showSuccess(response.message));
    yield put(
      actions.completeInventorySuccess({
        rowIndex,
        res: response.data,
      }),
    );
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// gọi api khi chọn mã khay sọt vùng 4
function* getLocatorByBasket(action) {
  const queryStr = serializeQueryParams(action.data);

  try {
    const res = yield call(
      request,
      `${APIs.getLocatorByBasket}?${queryStr}`,
      optionReq(),
    );
    checkStatus(res);
    const mainData = res.data.map(item => ({
      ...item,
      value: item.basketLocatorId,
      label: `${item.basketLocatorCode} ${item.basketLocatorName}`,
    }));
    if (action.callback) {
      yield action.callback(mainData);
    }

    yield put(actions.getLocatorByBasketSuccess(mainData));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// api in trong màn xem BBKK
export function* print(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      `${APIs.print}?ids=${action.data}&isRePrint=false`,
      optionReq(),
    );
    if (response.statusCode !== 200) {
      throw Object({
        message: response.message || 'Có lỗi xảy ra khi xuất file',
      });
    }
    const wnd = window.open('', '', '_blank');
    if (wnd === null)
      throw Object({
        message:
          'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
      });
    wnd.document.write(response.data);
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

export default function* inventoryBasketSaga() {
  yield takeLeading(GET_INIT_FORM_DATA, getInitFormData);
  yield takeLeading(CREATE, create);
  yield takeLeading(COMPLETE, complete);
  yield takeLeading(REMOVE_RECORD_SECTION3, deleteRecordSection3);
  yield takeLeading(REMOVE_RECORD_SECTION4, deleteRecordSection4);
  yield takeLeading(GET_LOCATOR, getLocator);
  yield takeLeading(GET_SECTION4, getSection4);
  yield takeLeading(GET_SECTION5, getSection5);
  yield takeLeading(GET_QUANTITY, getQuantity);
  yield takeLeading(CANCEL, cancel);
  yield takeLeading(COMPLETE_INVENTORY, completeInventory);
  yield takeLeading(GET_LOCATOR_BY_BASKET, getLocatorByBasket);
  yield takeLeading(PRINT, print);
}
