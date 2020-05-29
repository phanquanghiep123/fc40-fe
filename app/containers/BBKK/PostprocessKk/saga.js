import { call, put, takeLeading, all, select } from 'redux-saga/effects';
import { localstoreUtilites } from 'utils/persistenceData';
import request, {
  optionReq,
  PATH_GATEWAY,
  requestAuth,
  checkStatus,
  METHOD_REQUEST,
} from 'utils/request';
import { groupBy } from 'lodash';
import { loadingError, setLoading, showSuccess } from '../../App/actions';
import {
  GET_INIT_FORM_DATA,
  GET_DELIVERY_ORDER,
  GET_BASKET_DETAIL,
  SUBMIT_ADJUST,
} from './constants';
import {
  getInitFormDataSuccess,
  getBasketDetailSuccess,
  getDeliveryOrderSuccess,
} from './actions';
import { serializeQueryParams } from '../../App/utils';
import { selectArr, formDataSelector } from './selectors';

const APIs = {
  getDeliveryOrderCode: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/auto-complete-stocktaking-code`,
  getBasketDetail: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/get-basket-document-detail`,
  postAdjust: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/adjust-after-stocktaking`,
  typeProcess: `${
    PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
  }/basket-stocktaking/process-after-status`,
  getUsers: `${PATH_GATEWAY.AUTHENTICATION_API}/Users?pageSize=-1`,
  getPlant: `${PATH_GATEWAY.AUTHORIZATION_API}/organizations/get-by-user`,
};

// hàm khởi tạo màn hình
export function* getInitFormData(action) {
  const {
    userId,
    fullName,
  } = localstoreUtilites.getAuthFromLocalStorage().meta;
  const [users, plants, typeProcess] = yield all([
    call(requestAuth, APIs.getUsers),
    call(requestAuth, `${APIs.getPlant}?userId=${userId}`),
    call(requestAuth, APIs.typeProcess),
  ]);
  const formOption = {
    users: users.data.map(item => ({
      value: item.id,
      phoneNumber: item.phoneNumber ? item.phoneNumber : '',
      email: item.email ? item.email : '',
      label: `${item.lastName} ${item.firstName}`,
    })),
    plants: plants.data.map(item => ({
      value: item.value,
      label: item.name,
    })),
    typeProcess: typeProcess.data.map(item => ({
      value: item.id,
      label: item.name,
    })),
  };
  const deliver = plants.data.find(
    item => item.value === action.data.plantCode,
  );
  const initData = {
    typeProcess: typeProcess.data[1].id,
    date: new Date(),
    receiver: '',
    adjustmentUser: {
      value: userId,
      label: fullName,
    },
    deliver: {
      value: deliver.value,
      label: deliver.name,
    },
    deliverBasketStocktakingCode: {
      value: action.data.basketStockTakingCode,
      label: action.data.basketStockTakingCode,
      isDeliver: true,
    },
    receiverBasketStocktakingCode: {
      value: action.data.basketStockTakingCode,
      label: action.data.basketStockTakingCode,
      isDeliver: false,
    },
    tableData: [],
    tableDataReceiver: [],
    tableDataDeliver: [],
  };
  yield put(getInitFormDataSuccess(formOption, initData));
  yield getDeliveryOrder({
    data: {
      params: {
        isDeliver: true,
        date: new Date().toISOString(),
        plantCode: action.data.plantCode,
      },
      basketStockTakingCode: action.data.basketStockTakingCode,
      detail: {
        typeProcess: typeProcess.data[1].id,
        hasData: true,
        isDeliver: true,
      },
    },
  });
}

// hàm lấy danh sách các mã BBKK
export function* getDeliveryOrder(action) {
  const { params, basketStockTakingCode, detail } = action.data;

  const formDataMain = yield select(formDataSelector());
  const formData = formDataMain.toJS();
  try {
    yield put(setLoading());
    const queryStr = serializeQueryParams(params);
    const res = yield call(
      request,
      `${APIs.getDeliveryOrderCode}?${queryStr}`,
      optionReq(),
    );
    checkStatus(res);
    const fieldData = [
      ...res.data.map(item => ({
        value: item,
        label: item,
        isDeliver: params.isDeliver,
      })),
    ];
    yield put(
      getDeliveryOrderSuccess({ fieldData, isDeliver: params.isDeliver }),
    );
    if (basketStockTakingCode) {
      yield getBasketDetail({
        data: {
          value: basketStockTakingCode,
          ...detail,
        },
      });
    }

    if (!basketStockTakingCode && res.data.length === 1) {
      yield getBasketDetail({
        data: {
          value: res.data[0],
          isDeliver: params.isDeliver,
          typeProcess: params.typeProcess,
          hasData: true,
        },
      });
    }

    if (!basketStockTakingCode && res.data.length > 1) {
      if (params.isDeliver) {
        yield getBasketDetail({
          data: {
            value: '',
            isDeliver: params.isDeliver,
            typeProcess: formData.typeProcess,
            hasData: false,
          },
        });
        // if (formData.receiverBasketStocktakingCode) {
        //   yield getBasketDetail({
        //     data: {
        //       value: formData.receiverBasketStocktakingCode.value,
        //       isDeliver: params.isDeliver,
        //       typeProcess: formData.typeProcess,
        //       hasData: true,
        //     },
        //   });
        // } else {
        //   yield getBasketDetail({
        //     data: {
        //       value: '',
        //       isDeliver: params.isDeliver,
        //       typeProcess: formData.typeProcess,
        //       hasData: false,
        //     },
        //   });
        // }
      }
      if (!params.isDeliver) {
        if (formData.deliverBasketStocktakingCode) {
          yield getBasketDetail({
            data: {
              value: formData.deliverBasketStocktakingCode.value,
              isDeliver: !params.isDeliver,
              typeProcess: formData.typeProcess,
              hasData: true,
            },
          });
        } else {
          yield getBasketDetail({
            data: {
              value: '',
              isDeliver: !params.isDeliver,
              typeProcess: formData.typeProcess,
              hasData: false,
            },
          });
        }
      }
    }
    if (action.callback) {
      yield action.callback();
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

// hàm lấy thông tin khay sọt trong vùng bảng
export function* getBasketDetail(action) {
  const { isDeliver, value } = action.data;
  const tableDataReceiver = yield select(
    selectArr(['formData', 'tableDataReceiver']),
  );
  const tableDataDeliver = yield select(
    selectArr(['formData', 'tableDataDeliver']),
  );

  try {
    yield put(setLoading());
    let res = {
      data: [],
    };
    if (action.data.hasData) {
      res = yield call(
        request,
        `${APIs.getBasketDetail}?stocktakingCode=${value}`,
        optionReq(),
      );
      checkStatus(res);
    }
    const mainData = [];
    let mainData1 = [];
    const fetchData = [];
    if (isDeliver) {
      mainData1 = tableDataReceiver.toJS();
    }
    if (!isDeliver) {
      mainData1 = tableDataDeliver.toJS();
    }

    const resData = [];
    if (res.data.length > 0) {
      res.data.forEach(item => {
        if (isDeliver) {
          if (item.expectAdjustQuantity < 0) {
            const element = {
              basketCode: item.basketCode,
              basketName: item.basketName,
              uoM: item.uoM,
              maxAdjustQuantity: '',
              basketLocatorDeliverId: item.basketLocatorId,
              locatorDeliver: `${item.basketLocatorCode} ${
                item.basketLocatorName
              }`,
              expectAdjustDeliverQuantity: item.expectAdjustQuantity,
              basketLocatorDeliverCode: item.basketLocatorCode,
              deliveryQuantity: '',
              // locatorReceiver: '',
              // basketLocatorReceiverId: '',
              // expectAdjustReceiverQuantity: '',
              receiverQuantity: '',
              note: '',
              isDeliver: action.data.isDeliver,
            };
            mainData.push(element);
            resData.push(element);
          }
          if (action.data.typeProcess === 2) {
            if (item.expectAdjustQuantity > 0) {
              const subElement = {
                basketCode: item.basketCode,
                basketName: item.basketName,
                uoM: item.uoM,
                maxAdjustQuantity: '',
                // locatorDeliver: '',
                // expectAdjustDeliverQuantity: '',
                deliveryQuantity: '',
                // basketLocatorDeliverId: '',
                locatorReceiver: `${item.basketLocatorCode} ${
                  item.basketLocatorName
                }`,
                basketLocatorReceiverId: item.basketLocatorId,
                basketLocatorReceiverCode: item.basketLocatorCode,
                expectAdjustReceiverQuantity: item.expectAdjustQuantity,
                receiverQuantity: '',
                note: '',
                isDeliver: !action.data.isDeliver,
              };
              fetchData.push(subElement);
            }
            mainData1 = fetchData;
          }
        }

        if (!isDeliver && item.expectAdjustQuantity > 0) {
          const element = {
            basketCode: item.basketCode,
            basketName: item.basketName,
            uoM: item.uoM,
            maxAdjustQuantity: '',
            // locatorDeliver: '',
            // expectAdjustDeliverQuantity: '',
            deliveryQuantity: '',
            // basketLocatorDeliverId: '',
            locatorReceiver: `${item.basketLocatorCode} ${
              item.basketLocatorName
            }`,
            basketLocatorReceiverId: item.basketLocatorId,
            basketLocatorReceiverCode: item.basketLocatorCode,
            expectAdjustReceiverQuantity: item.expectAdjustQuantity,
            receiverQuantity: '',
            note: '',
            isDeliver: action.data.isDeliver,
          };
          mainData.push(element);
          resData.push(element);
        }
      });
    }
    if (mainData1.length > 0 && mainData1[0].basketLocatorReceiverCode) {
      mainData1.sort(
        (a, b) =>
          a.basketLocatorReceiverCode > b.basketLocatorReceiverCode ? 1 : -1,
      );
    } else {
      mainData1.sort(
        (a, b) =>
          a.basketLocatorDeliverCode > b.basketLocatorDeliverCode ? 1 : -1,
      );
    }
    if (mainData.length > 0 && mainData[0].basketLocatorReceiverCode) {
      mainData.sort(
        (a, b) =>
          a.basketLocatorReceiverCode > b.basketLocatorReceiverCode ? 1 : -1,
      );
    } else {
      mainData.sort(
        (a, b) =>
          a.basketLocatorDeliverCode > b.basketLocatorDeliverCode ? 1 : -1,
      );
    }

    const keyData = [];
    let arrData1 = groupBy(mainData1, subValue => `${subValue.basketCode}`); // chứa obj các data của bên có length lớn hơn
    let arrData2 = groupBy(mainData, subValue => `${subValue.basketCode}`); // chứa obj các data của bên có length nhỏ hơn

    if (Object.keys(arrData1).length < Object.keys(arrData2).length) {
      arrData1 = groupBy(mainData, subValue => `${subValue.basketCode}`);
      arrData2 = groupBy(mainData1, subValue => `${subValue.basketCode}`);
    }

    Object.keys(arrData1).forEach(item => {
      if (arrData2[item]) {
        if (arrData1[item].length >= arrData2[item].length) {
          if (arrData1[item].length > 1) {
            arrData1[item].forEach((subItem, i) => {
              if (i !== arrData1[item].length - 1) {
                const data = {
                  ...arrData1[item][i],
                  ...arrData2[item][i],
                  indexRowMerge: i,
                  isLastRow: false,
                  isMergeRow: true,
                  isDeliver:
                    (arrData1[item][i] && arrData1[item][i].isDeliver) ||
                    (arrData2[item][i] && arrData2[item][i].isDeliver),
                };
                keyData.push(data);
              } else {
                keyData.push({
                  ...arrData1[item][i],
                  ...arrData2[item][i],
                  indexRowMerge: i,
                  isLastRow: true,
                  isMergeRow: true,
                  isDeliver:
                    (arrData1[item][i] && arrData1[item][i].isDeliver) ||
                    (arrData2[item][i] && arrData2[item][i].isDeliver),
                });
              }
            });
          } else {
            keyData.push({
              ...arrData1[item][0],
              ...arrData2[item][0],
              indexRowMerge: 0,
              isLastRow: true,
              isMergeRow: true,
              isDeliver:
                arrData1[item][0].isDeliver || arrData2[item][0].isDeliver,
            });
          }
        }

        if (arrData1[item].length < arrData2[item].length) {
          arrData2[item].forEach((subItem, i) => {
            if (i !== arrData2[item].length - 1) {
              const data = {
                ...arrData1[item][i],
                ...subItem,
                indexRowMerge: i,
                isLastRow: false,
                isMergeRow: true,
                isDeliver: false,
              };
              keyData.push(data);
            } else {
              const data = {
                ...arrData1[item][i],
                ...subItem,
                indexRowMerge: i,
                isLastRow: true,
                isMergeRow: true,
                isDeliver: false,
              };
              keyData.push(data);
            }
          });
        }
      } else {
        arrData1[item].forEach((subItem, i) => {
          if (subItem.basketLocatorDeliverId) {
            if (i !== arrData1[item].length - 1) {
              const data = {
                ...subItem,
                indexRowMerge: i,
                isLastRow: false,
                isMergeRow: true,
                isDeliver: subItem.isDeliver,
                isDisable: true,
              };
              keyData.push(data);
            } else {
              const data = {
                ...subItem,
                indexRowMerge: i,
                isLastRow: true,
                isMergeRow: true,
                isDeliver: subItem.isDeliver,
                isDisable: true,
              };
              keyData.push(data);
            }
          }
        });
      }
    });

    Object.keys(arrData2).forEach(item => {
      if (!arrData1[item]) {
        arrData2[item].forEach((subItem, i) => {
          if (subItem.basketLocatorDeliverId) {
            if (i !== arrData2[item].length - 1) {
              keyData.push({
                ...subItem,
                indexRowMerge: i,
                isLastRow: false,
                isMergeRow: true,
                isDisable: true,
                isDeliver: subItem.isDeliver,
              });
            } else {
              keyData.push({
                ...subItem,
                indexRowMerge: i,
                isLastRow: true,
                isMergeRow: true,
                isDisable: true,
                isDeliver: subItem.isDeliver,
              });
            }
          }
        });
      }
    });

    // const tableData = [];
    // keyData.forEach(item => {
    //   if (item.basketCode && item.basketLocatorDeliverId) {
    //     tableData.push(item);
    //   }
    // });
    // keyData.sort((a, b) => (a.basketCode > b.basketCode ? 1 : -1));
    if (isDeliver) {
      yield put(
        getBasketDetailSuccess({
          keyData,
          tableDataDeliver: resData,
          tableDataReceiver: tableDataReceiver.toJS(),
        }),
      );
    } else {
      yield put(
        getBasketDetailSuccess({
          keyData,
          tableDataDeliver: tableDataDeliver.toJS(),
          tableDataReceiver: resData,
        }),
      );
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(loadingError(e.message));
  }
}

function* submitAdjust(action) {
  try {
    yield put(setLoading());
    const response = yield call(
      request,
      APIs.postAdjust,
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

export default function* postprocessKkSaga() {
  yield takeLeading(GET_INIT_FORM_DATA, getInitFormData);
  yield takeLeading(GET_DELIVERY_ORDER, getDeliveryOrder);
  yield takeLeading(GET_BASKET_DETAIL, getBasketDetail);
  yield takeLeading(SUBMIT_ADJUST, submitAdjust);
}
