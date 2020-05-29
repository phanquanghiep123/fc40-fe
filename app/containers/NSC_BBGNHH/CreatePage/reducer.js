import { fromJS } from 'immutable';

import { PAGE_SIZE } from 'utils/constants';

import {
  masterRoutine,
  leadtimeRoutine,
  exportReceiptsRoutine,
} from './routines';

import Schema from './Schema';

import { TYPE_BBGNHH, CHANGE_TYPE_BBGNHH } from './constants';

export const initialState = fromJS({
  master: {
    // Đơn vị
    organizations: [],

    // Loại BBGNHH
    delivertReceiptTypes: [],

    // Loại xe tuyến
    vehicleRoutes: [],

    // Bên vận chuyển
    shippers: [],

    // Pallet lót sàn xe
    vehiclePallets: [],

    // Trạng thái nhiệt độ
    temperatureStatus: [],

    // Trạng thái nhiệt độ chip
    chipTemperatureStatus: [],

    // Vệ sinh xe
    vehicleCleanings: [],

    // Vận chuyển theo Leadtime
    shippingLeadtime: [],

    // Nguyên nhân
    shippingLeadtimeReasons: [],

    // Nguyên nhân xuất hàng
    shippingLeadtimeExportReasons: [],
  },

  // Leadtime phát sinh
  leadtime: {
    data: [],
  },

  // Danh sách Phiếu xuất kho
  exportReceipts: {
    data: [],
    pageSize: PAGE_SIZE,
    pageIndex: 0,
    totalCount: 0,
  },

  // Form BBGNHH
  initialSchema: Schema.cast(),
});

export default function baseReducer(state = initialState, action) {
  switch (action.type) {
    case masterRoutine.REQUEST:
      return state
        .setIn(['leadtime', 'data'], fromJS([]))
        .setIn(['initialSchema', 'createDate'], new Date())
        .setIn(['initialSchema', 'deliveryDate'], new Date())
        .setIn(['initialSchema', 'deliveryReceiptType'], TYPE_BBGNHH.ICD)
        .setIn(
          ['initialSchema', 'deliveryReceiptTransports', 'actualDepartureDate'],
          new Date(),
        );

    case masterRoutine.SUCCESS:
      return state
        .setIn(['master', 'shippers'], fromJS(action.payload.shippers))
        .setIn(
          ['master', 'organizations'],
          fromJS(action.payload.organizations),
        )
        .setIn(
          ['master', 'vehicleRoutes'],
          fromJS(action.payload.vehicleRoutes),
        )
        .setIn(
          ['master', 'vehiclePallets'],
          fromJS(action.payload.vehiclePallets),
        )
        .setIn(
          ['master', 'vehicleCleanings'],
          fromJS(action.payload.vehicleCleanings),
        )
        .setIn(
          ['master', 'temperatureStatus'],
          fromJS(action.payload.temperatureStatus),
        )
        .setIn(
          ['master', 'shippingLeadtime'],
          fromJS(action.payload.shippingLeadtime),
        )
        .setIn(
          ['master', 'delivertReceiptTypes'],
          fromJS(action.payload.delivertReceiptTypes),
        )
        .setIn(
          ['master', 'chipTemperatureStatus'],
          fromJS(action.payload.chipTemperatureStatus),
        )
        .setIn(
          ['master', 'shippingLeadtimeReasons'],
          fromJS(action.payload.shippingLeadtimeReasons),
        )
        .setIn(
          ['master', 'shippingLeadtimeExportReasons'],
          fromJS(action.payload.shippingLeadtimeExportReasons),
        )
        .update('initialSchema', initialSchema =>
          initialSchema.concat(action.payload.initialSchema),
        );

    case leadtimeRoutine.TRIGGER:
      return state.set('leadtime', initialState.get('leadtime'));

    case leadtimeRoutine.REQUEST:
      return state.setIn(['leadtime', 'data'], fromJS([]));

    case leadtimeRoutine.SUCCESS:
      return state.setIn(['leadtime', 'data'], fromJS(action.payload.data));

    case exportReceiptsRoutine.TRIGGER:
      return state.set('exportReceipts', initialState.get('exportReceipts'));

    case exportReceiptsRoutine.SUCCESS:
      return state
        .setIn(
          ['exportReceipts', 'pageSize'],
          fromJS(action.payload.formSearch.pageSize),
        )
        .setIn(
          ['exportReceipts', 'pageIndex'],
          fromJS(action.payload.formSearch.pageIndex),
        )
        .setIn(
          ['exportReceipts', 'totalCount'],
          fromJS(action.payload.formSearch.totalCount),
        )
        .setIn(['exportReceipts', 'data'], fromJS(action.payload.data));

    case CHANGE_TYPE_BBGNHH:
      return state
        .setIn(['initialSchema', 'createDate'], new Date())
        .setIn(['initialSchema', 'deliveryDate'], new Date())
        .setIn(['initialSchema', 'deliveryReceiptType'], action.typeBBGNHH)
        .setIn(
          ['initialSchema', 'deliveryReceiptTransports', 'actualDepartureDate'],
          new Date(),
        );

    default:
      return state;
  }
}
