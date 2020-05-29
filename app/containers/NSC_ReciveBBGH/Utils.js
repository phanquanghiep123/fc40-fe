import { getDatetimeNow, splitTimes } from 'utils/datetimeUtils';
import { isEmpty } from 'lodash';

import { localstoreUtilites } from 'utils/persistenceData';
import { addHours, addMinutes, format, startOfDay } from 'date-fns';
import {
  VEHICLE_ROUTE_TYPE_1,
  VEHICLE_ROUTE_TYPE_2,
  VEHICLE_ROUTE_TYPE_3,
  VEHICLE_ROUTE_TYPE_5,
} from './constants';
import { initialSchema } from './ReceivingDeliveryOrderSchema';
import {
  MASTER_CODE_DELIVERY_ORDER_SEAL_STATUS,
  MASTER_CODE_DELIVERY_ORDER_SHIPPING_LEADTIME,
  MASTER_CODE_DELIVERY_ORDER_STATUS,
  MASTER_CODE_DELIVERY_ORDER_TEMPERATURE_STATUS,
  MASTER_CODE_DELIVERY_ORDER_VEHICLE_CLEANING,
  MASTER_CODE_DELIVERY_ORDER_VEHICLE_PALLET,
  MASTER_CODE_DELIVERY_ORDER_REASON,
  DELIVERY_ORDER_BUSSINES,
} from '../App/constants';
const auth = localstoreUtilites.getAuthFromLocalStorage();
const now = getDatetimeNow();
const mappingFarmField = [
  'deliverOrReceiver',
  'receiverCode',
  'doType',
  'deliveryPersonPhone',
  'stockReceivingDateTime',
  'sealNumber',
  'status',
  'deliveryPersonName',
  'doCode',
  'receiverName',
  'deliveryName',
  'deliveryDateTime',
  'shipperId',
  'receivingPersonName',
  'receivingPersonPhone',
  'receivingPersonCode',
  'sealStatus',
];

const mappingFarmShippingField = [
  'shippingLeadtime',
  'vehicleRouteType',
  'temperatureStatus',
  'notes',
  'reason',
  'actualTemperature',
  'coolingVehicleTime',
  'regulatedArrivalHour',
  'plannedArrivalHour',
  'drivingDuration',
  'deliveryTime',
  'shipperName',
  'vehiclePallet',
  'drivingPlate',
  'chipTemperatureStatus',
  'unregulatedLeadtime',
  'regulatedDepartureHour',
  'vehicleCleaning',
  'driver',
  'chipTemperature1',
  'chipTemperature2',
  'deliveryOrderTransportViolationList',
  'maxStandardTemperature',
  'minStandardTemperature',
  'vehicleWeight',
  'actualDepartureHour',
  'actualArrivalHour',
  'phone',
];

const mappingBussinesField = [
  'deliverOrReceiver',
  'receiverCode',
  'doType',
  'deliveryPersonPhone',
  'stockReceivingDateTime',
  'sealNumber',
  'status',
  'deliveryPersonName',
  'doCode',
  'receiverName',
  'deliveryName',
  'deliveryDateTime',
  'receivingPersonName',
  'receivingPersonPhone',
  'receivingPersonCode',
  'sealStatus',
];

const mappingBussinesShippingField = [
  'shipperId',
  'temperatureStatus',
  'vehicleRouteType',
  'shippingLeadtime',
  'notes',
  'reason',
  'coolingVehicleTime',
  'regulatedArrivalHour',
  'plannedArrivalHour',
  'drivingDuration',
  'deliveryTime',
  'vehiclePallet',
  'drivingPlate',
  'chipTemperatureStatus',
  'unregulatedLeadtime',
  'regulatedDepartureHour',
  'vehicleCleaning',
  'driver',
  'actualTemperature',
  'chipTemperature1',
  'chipTemperature2',
  'deliveryOrderTransportViolationList',
  'vehicleWeight',
  'actualDepartureHour',
  'actualArrivalHour',
  'phone',
  'vehicleNumbering',
  'maxStandardTemperature',
  'minStandardTemperature',
];

export const setRegulatedArrivalHour = (deliveryOrder, leadTime) => {
  if (deliveryOrder.doType === DELIVERY_ORDER_BUSSINES && leadTime.length > 0) {
    return !isEmpty(deliveryOrder.regulatedArrivalHour)
      ? deliveryOrder.regulatedArrivalHour
      : leadTime[0].regulatedArrivalHour;
  }
  return deliveryOrder.shipperList[0].regulatedArrivalHour;
};

export const setShippingLeadtime = (
  actualArrivalHour,
  regulatedArrivalHour,
) => {
  if (
    new Date(`2019 ${actualArrivalHour}`).getTime() >
    new Date(`2019 ${regulatedArrivalHour}`).getTime()
  ) {
    return 0;
  }
  return 1;
};

function mapping(doField, shipperField, deliveryOrder, shipperId) {
  const deliveryOrderState = { deleteIds: [], imageFiles: [] };
  doField.forEach(item => {
    if (item === 'shipperId') {
      if (deliveryOrder.shipperList.length === 0) {
        throw Object({
          message:
            'Thiếu Thông tin vận chuyển để thực hiện tiếp nhận, vui lòng cập nhật thêm',
        });
      }
      deliveryOrderState[item] = deliveryOrder.shipperList[0].id;
    } else if (item === 'receivingPersonPhone') {
      deliveryOrderState[item] = `${auth.meta.phoneNumber}`;
    } else
      deliveryOrderState[item] =
        deliveryOrder[item] !== null && deliveryOrder[item] !== ''
          ? deliveryOrder[item]
          : initialSchema[item];
  });

  shipperField.forEach(item => {
    if (
      deliveryOrder.shipperList[0][item] !== null &&
      deliveryOrder.shipperList[0][item] !== ''
    ) {
      deliveryOrderState[item] = deliveryOrder.shipperList[0][item];
    } else if (item === 'actualArrivalHour' || item === 'deliveryTime') {
      deliveryOrderState[item] = `${format(new Date(), 'HH:mm')}`;
    } else if (item === 'shippingLeadtime') {
      deliveryOrderState[item] = calculateShippingLeadtime(
        {
          values: {
            deliveryDateTime:
              deliveryOrder.shipperList[0].deliveryDateTime ||
              format(new Date(), 'yyyy-MM-dd'),
          },
        },
        splitTimes(deliveryOrder.shipperList[0].regulatedDepartureHour), // '12:00' => {hours: 12, minutes: 00}
        splitTimes(deliveryOrder.shipperList[0].drivingDuration), // 2 => {hours: 2, minutes: 0}
        deliveryOrder.shipperList[0].actualArrivalHour ||
          `${format(new Date(), 'HH:mm')}`,
        deliveryOrder.shipperList[0].stockReceivingDateTime || now,
      );
    } else {
      deliveryOrderState[item] = initialSchema[item];
    }
  });
  if (shipperId && shipperId === '0') {
    deliveryOrderState.vehicleNumbering =
      Number.parseInt(deliveryOrderState.vehicleNumbering, 10) + 1;
    deliveryOrderState.drivingPlate = '';
    deliveryOrderState.vehicleWeight = '';
  }

  return deliveryOrderState;
}

export function mappingDeliveryOder(deliveryOrder, shipperId, leadTime) {
  let deliveryOrderState = { deleteIds: [], imageFiles: [] };
  // farm
  if (deliveryOrder.doType !== DELIVERY_ORDER_BUSSINES) {
    deliveryOrderState = mapping(
      mappingFarmField,
      mappingFarmShippingField,
      deliveryOrder,
      null,
    );
  } else {
    // chuyến xe phù hợp
    const shipper = deliveryOrder.shipperList.filter(
      // eslint-disable-next-line eqeqeq
      item => item.id == shipperId,
    );

    mappingBussinesField.forEach(item => {
      if (item === 'receivingPersonPhone') {
        deliveryOrderState[item] = `${auth.meta.phoneNumber}`;
      } else {
        deliveryOrderState[item] =
          deliveryOrder[item] !== null && deliveryOrder[item] !== ''
            ? deliveryOrder[item]
            : initialSchema[item];
      }
    });

    mappingBussinesShippingField.forEach(item => {
      if (shipperId && shipperId === '0') {
        if (item === 'vehicleNumbering') {
          deliveryOrderState[item] = deliveryOrder.shipperList.length + 1;
        } else if (item === 'regulatedArrivalHour') {
          deliveryOrderState[item] =
            leadTime.length > 0 ? leadTime[0].regulatedArrivalHour : '';
        } else if (item === 'shippingLeadtime') {
          deliveryOrderState[item] = setShippingLeadtime(
            initialSchema.actualArrivalHour,
            leadTime[0].regulatedArrivalHour,
          );
        } else if (item === 'actualArrivalHour' || item === 'deliveryTime') {
          deliveryOrderState[item] = `${format(new Date(), 'HH:mm')}`;
        } else {
          deliveryOrderState[item] = initialSchema[item];
        }
        deliveryOrderState.stockReceivingDateTime = now;
      } else if (shipperId !== '0') {
        if (shipper.length === 0) {
          throw Object({ message: 'Không tồn tại bản tiếp nhận' });
        }
        if (item === 'shipperId') {
          deliveryOrderState[item] = shipper[0].id;
        } else if (shipper[0][item] !== null && shipper[0][item] !== '') {
          deliveryOrderState[item] = shipper[0][item];
        } else if (item === 'actualArrivalHour' || item === 'deliveryTime') {
          deliveryOrderState[item] = `${format(new Date(), 'HH:mm')}`;
        } else {
          deliveryOrderState[item] = initialSchema[item];
        }
      }
    });
  }
  return deliveryOrderState;
}

export function mappingMasterCode(masterCode) {
  return {
    status:
      masterCode.filter(
        item => item.parentCode === MASTER_CODE_DELIVERY_ORDER_STATUS,
      )[0].childs || [],
    vehiclePallet:
      masterCode.filter(
        item => item.parentCode === MASTER_CODE_DELIVERY_ORDER_VEHICLE_PALLET,
      )[0].childs || [],
    vehicleCleaning:
      masterCode.filter(
        item => item.parentCode === MASTER_CODE_DELIVERY_ORDER_VEHICLE_CLEANING,
      )[0].childs || [],
    shippingLeadtime:
      masterCode.filter(
        item =>
          item.parentCode === MASTER_CODE_DELIVERY_ORDER_SHIPPING_LEADTIME,
      )[0].childs || [],
    reason:
      masterCode.filter(
        item => item.parentCode === MASTER_CODE_DELIVERY_ORDER_REASON,
      )[0].childs || [],
    temperatureStatus:
      masterCode.filter(
        item =>
          item.parentCode === MASTER_CODE_DELIVERY_ORDER_TEMPERATURE_STATUS,
      )[0].childs || [],
    sealStatus:
      masterCode.filter(
        item => item.parentCode === MASTER_CODE_DELIVERY_ORDER_SEAL_STATUS,
      )[0].childs || [],
  };
}

export const generatePreviewImgUrl = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => callback(reader.result);
};

export const addViolation = (e, prs) => {
  const { files } = e.target;
  const { deliveryOrderTransportViolationList, imageFiles } = prs.values;
  Array.from(files).forEach(file => {
    imageFiles.push(file);
    prs.setFieldValue('imageFiles', imageFiles);
    generatePreviewImgUrl(file, previewImgUrl => {
      deliveryOrderTransportViolationList.push({
        violationPicture: previewImgUrl,
        id: (Math.random() * 1000000000).toFixed(0),
      });
      prs.setFieldValue(
        'deliveryOrderTransportViolationList',
        deliveryOrderTransportViolationList,
      );
    });
  });
  e.target.files = null;
};

export const deleteViolation = (item, prs) => {
  const { deleteIds, deliveryOrderTransportViolationList } = prs.values;
  if (!deleteIds.includes(item.id)) {
    deleteIds.push(item.id);
    prs.setFieldValue('deleteIds', deleteIds);
  }

  prs.setFieldValue(
    'deliveryOrderTransportViolationList',
    deliveryOrderTransportViolationList.filter(
      violation => violation.id !== item.id,
    ),
  );
};

export const changeVehicleRoute = (event, prs, vehicleRoute) => {
  const { actualTemperature } = prs.values;
  const vehicle = vehicleRoute.filter(
    item => item.vehicleRouteCode === event.target.value,
  )[0];
  const isCoolingVehicle =
    // eslint-disable-next-line eqeqeq
    event.target.value == VEHICLE_ROUTE_TYPE_2 ||
    // eslint-disable-next-line eqeqeq
    event.target.value == VEHICLE_ROUTE_TYPE_3;
  const min = isCoolingVehicle ? vehicle.minStandardTemperature : '';
  const max = isCoolingVehicle ? vehicle.maxStandardTemperature : '';
  prs.setFieldValue('minStandardTemperature', min);
  prs.setFieldValue('maxStandardTemperature', max);
  if (
    // eslint-disable-next-line eqeqeq
    event.target.value == VEHICLE_ROUTE_TYPE_1 ||
    // eslint-disable-next-line eqeqeq
    event.target.value == VEHICLE_ROUTE_TYPE_5
  ) {
    // nếu là xe  bạt hoặc xe thùng thì mặc định là đạt
    prs.setFieldValue('temperatureStatus', 1);
    prs.setFieldValue('actualTemperature', '');
    prs.setFieldValue('coolingVehicleTime', '');
  } else if (event.target.value !== VEHICLE_ROUTE_TYPE_1) {
    setTemperatureStatus(min, max, actualTemperature, prs);
  }
};

export const setTemperatureStatus = (
  minStandardTemperature,
  maxStandardTemperature,
  actualTemperature,
  prs,
) => {
  // nhiệt độ trong khoảng cho phép là đạt, ngoài khoảng là không đạt
  if (
    Number.parseFloat(minStandardTemperature) <=
      Number.parseFloat(actualTemperature) &&
    Number.parseFloat(maxStandardTemperature) >=
      Number.parseFloat(actualTemperature)
  ) {
    prs.setFieldValue('temperatureStatus', 1);
  } else {
    prs.setFieldValue('temperatureStatus', 0);
  }
};

export const changeMinStandardTemperature = (event, prs) => {
  const {
    vehicleRouteType,
    actualTemperature,
    maxStandardTemperature,
  } = prs.values;
  if (vehicleRouteType !== VEHICLE_ROUTE_TYPE_1) {
    setTemperatureStatus(
      event.target.value,
      maxStandardTemperature,
      actualTemperature,
      prs,
    );
  }
};

export const changeMaxStandardTemperature = (event, prs) => {
  const {
    vehicleRouteType,
    actualTemperature,
    minStandardTemperature,
  } = prs.values;
  if (vehicleRouteType !== VEHICLE_ROUTE_TYPE_1) {
    setTemperatureStatus(
      minStandardTemperature,
      event.target.value,
      actualTemperature,
      prs,
    );
  }
};

export const changeActualTemperature = (event, prs) => {
  const {
    vehicleRouteType,
    minStandardTemperature,
    maxStandardTemperature,
  } = prs.values;
  if (vehicleRouteType !== VEHICLE_ROUTE_TYPE_1) {
    setTemperatureStatus(
      minStandardTemperature,
      maxStandardTemperature,
      event.target.value,
      prs,
    );
  }
};

export const changeReceivingPerson = (option, prs) => {
  prs.setFieldValue('receivingPersonName', option.value.name);
  prs.setFieldValue('receivingPersonPhone', option.value.phone);
  prs.setFieldValue('receivingPersonCode', option.value.id);
};

export const changeShippingLeadtime = (event, prs) => {
  if (event.target.value === 1) {
    prs.setFieldValue('reason', '');
  }
};

export const calculateShippingLeadtime = (
  prs, // (mang thông tin ngày giao hàng (string))
  actualDepartureHour, // Giờ Xuất Phát Thực Tế (object {hours: xx, minutes: yy})
  drivingDurationTime, // thời gian di chuyển (object: {hours: xx, minutes: yy})
  actualArrivalTime, // Thời gian đến thực tế (string HH:mm)
  stockReceivingDateTime = prs.values.stockReceivingDateTime, // (Ngày nhận hàng)
) => {
  // tính ngày giờ đến theo quy định = ngày giao hàng + giờ xuất phát theo quy định(regulatedDepartureHour)  + thời gian di chuyển
  // debugger;
  const plannedArrival = addMinutes(
    addHours(
      startOfDay(new Date(prs.values.deliveryDateTime.substr(0, 10))),
      actualDepartureHour.hours + drivingDurationTime.hours,
    ),
    actualDepartureHour.minutes + drivingDurationTime.minutes,
  );
  // tính ngày giờ đến thực tế = ngày nhận hàng  +  giờ đến thực tế
  let actualArrivalString;
  if (stockReceivingDateTime instanceof Date) {
    actualArrivalString = `${stockReceivingDateTime.toLocaleDateString(
      'en-US',
    )} ${actualArrivalTime}`;
  } else {
    actualArrivalString = `${stockReceivingDateTime.substr(
      0,
      10,
    )} ${actualArrivalTime}`;
  }
  const actualArrival = new Date(actualArrivalString);
  // alert(actualArrival);
  // alert(plannedArrival);
  return actualArrival.getTime() <= plannedArrival.getTime() ? 1 : 0;
};

// thay đổi giờ đến thực tế
export const onChangeActualArrivalHour = (currentDate, prs) => {
  // tính lại vận chuyển theo leadtime
  const shippingLeadtime = calculateShippingLeadtime(
    prs,
    splitTimes(prs.values.regulatedDepartureHour),
    splitTimes(parseFloat(prs.values.drivingDuration || 0)),
    `${currentDate.getHours()}:${currentDate.getMinutes()}`,
  );
  prs.setFieldValue('shippingLeadtime', shippingLeadtime);
  if (shippingLeadtime === 1) {
    prs.setFieldValue('reason', '');
  }
};
