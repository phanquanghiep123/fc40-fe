/**
 * Gets the repositories of the user from Github
 */

import {
  call,
  put,
  all,
  select,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';

import {
  basketGroup,
  transformStockList,
} from 'containers/NSC_BBGH/BBGHCreatePage/section4Utils';
import { loadingError } from 'containers/App/actions';
import { isArray } from 'lodash';
import request, {
  optionReq,
  METHOD_REQUEST,
  PATH_GATEWAY,
  responseCode,
} from 'utils/request';
import {
  GET_USERS_AUTO,
  GET_SHIPPER_AUTO,
  GET_INIT_BBGH,
  UPDATE_BBGH,
} from './constants';
import { getInitBBGHSuccess, updateBBGHSuccess } from './actions';
import { makeSelectIsQLNH } from './selectors';
import { initSchema } from './Schema';
import { resetCurrentTime } from '../../../utils/datetimeUtils';

export function* getInitPage(action) {
  try {
    // call api get BBGH by id
    const resEditBBGH = yield call(
      request,
      `${
        PATH_GATEWAY.BFF_SPA_API
      }/deliveryOrders/update-screen?deliveryOrderId=${action.idBBGH}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (
      resEditBBGH.statusCode !== undefined &&
      resEditBBGH.statusCode !== responseCode.ok
    ) {
      const message = { message: resEditBBGH.message };
      throw message;
    }

    // test case
    // resEditBBGH.deliveryOrder.shipperList[0].unregulatedLeadtime = false;
    // resEditBBGH.deliveryOrder.doType = 1; // loại BBGH
    // resEditBBGH.deliveryOrder.deliverOrReceiver = 1; // loại người giao/nhận/giao-nhận
    // resEditBBGH.deliveryOrder.status = 1; // BBGH chưa tiếp nhận, 2: đã tiếp nhận

    // Call typeBBGH and units by id of user have login
    const [
      resSuppliers,
      resLeadtimes,
      resVehicleRoute,
      resMasterCode,
    ] = yield all([
      // section 6
      call(
        request,
        `${
          PATH_GATEWAY.RESOURCEPLANNING_API
        }/transporters/zone-region?pageSize=-1`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${
          PATH_GATEWAY.MASTERDATA_API
        }/regulated-shipping-leadtime?deliveryCode=${
          resEditBBGH.deliveryOrder.deliverCode
        }&receiveCode=${
          resEditBBGH.deliveryOrder.receiverCode
        }&pageNumber=1&pageSize=100&sortColumn=0&sortDirection=desc`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${
          PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
        }/deliveryorders/vehicle-route`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
      call(
        request,
        `${PATH_GATEWAY.MASTERDATA_API}/master-code`,
        optionReq({
          method: METHOD_REQUEST.GET,
          body: null,
          authReq: true,
        }),
      ),
    ]);

    if (!resSuppliers) {
      throw Object({ message: 'Không lấy được danh sách bên vận chuyển' });
    }

    if (!(resLeadtimes && resLeadtimes.data)) {
      throw Object({ message: 'Không lấy được danh sách leadtime' });
    }

    if (!resVehicleRoute.data) {
      throw Object({ message: 'Không lấy được loại xe tuyến' });
    }

    const suppliers = resSuppliers.map(sup => ({
      value: sup.transporterCode,
      label: sup.fullName,
    }));

    const leadtimes = resLeadtimes.data.map(leadtime => ({
      value: leadtime.drivingDuration,
      label: leadtime.regulatedDepartureHour,
    }));

    // Nguyên nhân vận chuyển theo Leadtime
    const reasons = resMasterCode[19].childs.map(item => ({
      value: item.id,
      label: item.name,
    }));

    // Pallet lót sàn xe
    const vehiclePallets = resMasterCode[2].childs.map(item => ({
      value: item.id,
      label: item.name,
    }));

    // Trạng thái nhiệt độ
    const temperatureStatus = resMasterCode[6].childs.map(item => ({
      value: item.id,
      label: item.name,
    }));

    // Trạng thái nhiệt độ Chip
    const chipTemperatureStatus = resMasterCode[17].childs.map(item => ({
      value: item.id,
      label: item.name,
    }));

    // Vệ sinh xe
    const vehicleCleaning = resMasterCode[3].childs.map(item => ({
      value: item.id,
      label: item.name,
    }));

    // Leadtime vận chuyển
    const shippingLeadtime = resMasterCode[4].childs.map(item => ({
      value: item.id,
      label: item.name,
    }));

    const editBBGH = resEditBBGH.deliveryOrder;
    editBBGH.stockList = transformStockList(editBBGH.stockList);
    // caculate for section 5
    editBBGH.basketsTrays = basketGroup(editBBGH.stockList);
    editBBGH.dateCheck = editBBGH.deliveryDateTime;
    editBBGH.basketsInfor = resEditBBGH.basketInfo;
    // basketInforGroup(editBBGH.stockList);

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

    if (editBBGH.deliveryDateTime) {
      editBBGH.deliveryDateTime = new Date(
        editBBGH.deliveryDateTime,
      ).toISOString();
    }

    if (editBBGH.stockReceivingDateTime) {
      editBBGH.stockReceivingDateTime = new Date(
        editBBGH.stockReceivingDateTime,
      ).toISOString();
    }

    yield put(
      getInitBBGHSuccess({
        suppliers,
        leadtimes,
        reasons,
        vehiclePallets,
        chipTemperatureStatus,
        shippingLeadtime,
        vehicleCleaning,
        temperatureStatus,
        resEditBBGH: editBBGH,
        resVehicleRoute: resVehicleRoute.data.map(route => ({
          value: {
            id: route.vehicleRouteCode,
            minStandardTemperature: route.minStandardTemperature,
            maxStandardTemperature: route.maxStandardTemperature,
          },
          label: route.vehicleType,
        })),
      }),
    );
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getUserAutoComplete(action) {
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${PATH_GATEWAY.BFF_SPA_API}/user/get-by-org?orgId=${
        action.selectedUnitId
      }&filterName=${action.inputText}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (res && res.data.length !== 0) {
      action.callback(
        res.data.map(item => ({
          value: item.Id,
          label: `${item.lastName} ${item.firstName}`,
        })),
      );
    } else {
      action.callback([{ label: '', value: '' }]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* getShipperAuto(action) {
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${
        PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API
      }/deliveryOrders/shipper/auto-complete?search=${action.inputText}`,
      optionReq({
        method: METHOD_REQUEST.GET,
        body: null,
        authReq: true,
      }),
    );

    if (res.data && res.data.length !== 0) {
      // call callback of react-select
      action.callback(res.data);
    } else {
      action.callback([{ label: '', value: '' }]);
    }
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

export function* updateBBGH(action) {
  const isQLNH = yield select(makeSelectIsQLNH());
  const body = action.BBGH;
  const actionTime = new Date();
  body.basketsTrays = body.basketsInfor;
  body.stockReceivingDateTime = resetCurrentTime(
    action.BBGH.stockReceivingDateTime,
    actionTime,
  );
  body.deliveryDateTime = resetCurrentTime(
    action.BBGH.deliveryDateTime,
    actionTime,
  );
  try {
    // Call our request helper (see 'utils/request')
    const res = yield call(
      request,
      `${PATH_GATEWAY.COMMUNICATIONREQUIREMENT_API}/deliveryOrders/${
        action.BBGH.id
      }/${!isQLNH ? 'farm' : 'business-management'}`,
      optionReq({
        method: METHOD_REQUEST.PUT,
        body,
        authReq: true,
      }),
    );

    if (res.statusCode !== undefined && res.statusCode !== responseCode.ok) {
      const message = { message: res.message };
      throw message;
    }

    yield put(updateBBGHSuccess(res));
    yield put(action.callback());
  } catch (err) {
    yield put(loadingError(err.message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* githubData() {
  yield takeLatest(GET_USERS_AUTO, getUserAutoComplete);
  yield takeLatest(GET_SHIPPER_AUTO, getShipperAuto);

  yield takeLeading(GET_INIT_BBGH, getInitPage);
  yield takeLeading(UPDATE_BBGH, updateBBGH);
}
