import * as Yup from 'yup';
import { startOfDay } from 'date-fns';
import {
  section4Schema,
  section4BasketSchema,
} from '../BBGHCreatePage/section4Schema';
import { TYPE_USER_EDIT } from './constants';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';

const validNCC = Yup.string()
  .when(
    ['doType', 'deliverOrReceiver'],
    (doType, deliverOrReceiver, schema) => {
      if (
        doType === TYPE_BBGH.NCC_TO_NSC ||
        deliverOrReceiver === TYPE_USER_EDIT.DELIVER
      ) {
        return schema;
      }

      return schema.required('Trường không được bỏ trống');
    },
  )
  .nullable();

const validWhenInputSupplier = Yup.string()
  .nullable()
  .when(['doType', 'shipper'], (doType, shipper, schemas) => {
    if (shipper) {
      return schemas.required('Cần nhập giá trị');
    }

    return schemas;
  });

export default Yup.object().shape({
  // I. Thông tin biên bản (mục 1)
  // sealNumber: Yup.string()
  //   .when('doType', (doType, schema) => {
  //     if (
  //       [
  //         TYPE_BBGH.NCC_TO_NSC,
  //         TYPE_BBGH.FARM_POST_HARVEST,
  //         TYPE_BBGH.FARM_TO_PLANT_CODE_2,
  //       ].includes(doType)
  //     ) {
  //       return schema;
  //     }

  //     return schema.required('Trường không được bỏ trống');
  //   })
  //   .nullable(),
  vehicleNumbering: Yup.string()
    .when(['doType', 'shipperList'], (doType, shipperList, schema) => {
      if (
        [
          TYPE_BBGH.NCC_TO_NSC,
          TYPE_BBGH.FARM_POST_HARVEST,
          TYPE_BBGH.FARM_TO_PLANT_CODE_2,
          TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN,
        ].includes(doType)
      ) {
        return Yup.string();
      }

      if (!shipperList || !shipperList[0].shipper) {
        return Yup.string();
      }

      return schema.required('Trường không được bỏ trống');
    })
    .nullable(),

  // II. thong tin bên giao hàng (mục 2)
  deliveryDateTime: Yup.date()
    .when('doType', (doType, schema) => {
      if (doType === TYPE_BBGH.NCC_TO_NSC) {
        return schema
          .required('Trường không được bỏ trống')
          .when('stockReceivingDateTime', (stockReceivingDateTime, newSchema) =>
            newSchema.test(
              'stockReceivingDateTime',
              'Ngày giao không được lớn hơn ngày nhận',
              value =>
                startOfDay(value).getTime() <=
                startOfDay(stockReceivingDateTime).getTime(),
            ),
          );
      }

      return schema.required('Trường không được bỏ trống');
    })
    .nullable(), // ngay giao
  deliveryPersonName: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(), // tên đại diện giao hàng
  deliveryName: Yup.string()
    .required('Trường không được bỏ trống')
    .nullable(),

  // III. Thông tin bên nhận hàng (mục 3)
  receivingPersonName: validNCC, // tên đại diện nhận hàng
  stockReceivingDateTime: Yup.date()
    .when('deliverOrReceiver', (deliverOrReceiver, schema) => {
      if (
        [TYPE_USER_EDIT.RECIVER, TYPE_USER_EDIT.DELIVER_AND_RECIVER].includes(
          deliverOrReceiver,
        )
      ) {
        return schema
          .required('Trường không được bỏ trống')
          .when('deliveryDateTime', (deliveryDateTime, newSchema) =>
            newSchema.test(
              'deliveryDateTime',
              'Ngày nhận không được nhỏ hơn ngày giao',
              value =>
                startOfDay(value).getTime() >=
                startOfDay(deliveryDateTime).getTime(),
            ),
          );
      }

      return schema;
    })
    .nullable(), // ngày nhận
  receiverName: Yup.string().nullable(),

  // IV. Hàng Hóa
  stockList: section4Schema,
  // IV. Hàng hoá (khay sọt)
  basketList: section4BasketSchema,

  // VI. Thông tin bên vận chuyển
  shipperList: Yup.array().when('doType', (doType, schema) => {
    if (
      [
        TYPE_BBGH.NCC_TO_NSC,
        TYPE_BBGH.FARM_POST_HARVEST,
        TYPE_BBGH.FARM_TO_PLANT_CODE_2,
      ].includes(doType)
    ) {
      return schema;
    }

    return Yup.array().of(
      Yup.object().shape({
        vehicleNumbering: validWhenInputSupplier,
        driver: validWhenInputSupplier,
        drivingPlate: Yup.string().nullable(),
        vehicleWeight: validWhenInputSupplier,
        regulatedDepartureHour: validWhenInputSupplier,
        actualDepartureHour: validWhenInputSupplier,
        vehicleRouteType: Yup.number().nullable(),
        // vehicleRouteTypeName: validWhenInputSupplier,
        shipperName: Yup.string().when(
          [
            'driver',
            'phone',
            'drivingPlate',
            'vehicleWeight',
            'regulatedDepartureHour',
            'actualDepartureHour',
            // 'vehicleRouteTypeName',
            'minStandardTemperature',
            'maxStandardTemperature',
            'actualArrivalHour',
          ],
          (
            driver,
            phone,
            drivingPlate,
            vehicleWeight,
            regulatedDepartureHour,
            actualDepartureHour,
            // vehicleRouteTypeName,
            minStandardTemperature,
            maxStandardTemperature,
            actualArrivalHour,
            schemas,
          ) => {
            if (
              driver ||
              phone ||
              vehicleWeight ||
              regulatedDepartureHour ||
              actualDepartureHour ||
              // vehicleRouteTypeName ||
              minStandardTemperature ||
              maxStandardTemperature ||
              actualArrivalHour
            ) {
              return schemas.required('Cần nhập giá trị');
            }

            return schemas;
          },
        ),
      }),
    );
  }),
});

export const initSchema = {
  updatedTimes: 0,
  receiverType: '', // Loại plant bên nhận hàng (Farm hoặc NSC)
  deliverOrReceiver: null, // type user edit page (1/ giao /2 nhận / 3 giao nhận)
  statusName: '',
  doTypeName: '', // tên loại BBGH
  createdByName: '', // tên người tạo
  plantName: '', // tên đơn vị tạo
  zoneRegion: '', //  vùng miền nào để lấy list bên vận chuyển
  doCode: '', // Mã BBGH
  doType: 0, // Loại BBGH
  status: 1, // Trạng thái 1: chưa tiếp nhận 2: đã tiếp nhận
  sealNumber: '', // Số seal --- [api]
  sealStatus: 0, // Trạng thái seal --- [api]
  doWorkingUnitCode: 0, // Mã  đơn vị tạo BBGH
  deliverCode: 0, // Mã bên giao hàng
  deliveryName: '', // Tên bên giao hàng
  deliveryPersonCode: '', // Mã đại diện giao hàng --- [api]
  deliveryPersonName: '', // Tên đại diện giao hàng ---[api]
  deliveryPersonPhone: '', // Điện thoại đại diện giao ---[api]
  deliveryDateTime: '', // Ngày giờ giao hàng
  receiverCode: 0, // Mã bên nhận hàng
  receiverName: '', // Tên bên nhận hàng
  receivingPersonCode: '', // Mã đại diện nhận hàng ---[api]
  receivingPersonName: '', // Tên đại diện nhận hàng ---[api]
  receivingPersonPhone: '', // Điện thoại đại diện nhận ---[api]
  stockReceivingDateTime: '', // Ngày giờ nhận hàng ---[api]
  receivingOrderFlag: 0, // Flag đã tiếp nhận
  stockExportReceiptCode: null, // Khi tạo BBGH từ Phiếu xuất kho/Phiếu điều chuyển
  vehicleNumbering: '', // Số thứ tự xe trong ngày --- [api]
  stockList: [],
  shipperList: [
    // {
    //   vehicleRouteTypeName: '',
    //   shipperName: '', // Tên shipper
    //   deliveryOrderId: 0,
    //   vehicleNumbering: 1, // Số thứ tự xe trong ngày ---[api]
    //   shipper: '', // Nhà vận chuyển ---[api]
    //   driver: '', // Lái xe ---[api]
    //   phone: '', // Số điện thoại ---[api]
    //   drivingPlate: '', // Bằng lái ---[api]
    //   vehicleWeight: '', // Trọng lượng xe ---[api]
    //   regulatedDepartureHour: '', // Giờ xuất phát quy định ---[api]
    //   actualDepartureHour: '', // Giờ xuất phát thực tế ---[api]
    //   drivingDuration: '', // Thời gian di chuyển (giờ) ---[api]
    //   regulatedArrivalDate: '', // Ngày đến theo quy định ---[api]
    //   regulatedArrivalHour: '', // Giờ đến theo quy định ---[api]
    //   plannedArrivalDate: '', // Ngày dự kiến đến
    //   plannedArrivalHour: '', // Giờ dự kiến đến
    //   actualArrivalDate: '', // Ngày đến thực tế
    //   actualArrivalHour: '', // Giờ đến thực tế
    //   deliveryTime: '', // Thời gian trả hàng xong
    //   coolingVehicleTime: 0, // TG nổ xe lạnh trả hàng
    //   actualTemperature: null, // Nhiệt độ thực tế
    //   vehicleRouteType: null, // Loại xe, tuyến
    //   temperatureStatus: 0, // Trạng thái nhiệt độ
    //   minStandardTemperature: '', // Nhiệt độ tiêu chuẩn (Min)
    //   maxStandardTemperature: '', // Nhiệt độ tiêu chuẩn (Max)
    //   chipTemperature1: 0, // Nhiệt độ chíp 1
    //   chipTemperature2: 0, // Nhiệt độ chíp 2
    //   chipTemperatureStatus: 0, // Trạng thái nhiệt độ chip
    //   vehiclePallet: 0, // Pallet lót sàn xe
    //   vehicleCleaning: 0, // Vệ sinh xe
    //   shippingLeadtime: 0, // Leadtime vận chuyển
    //   unregulatedLeadtime: false,
    //   reason: 0, // Nguyên nhân
    //   notes: '',
    //   deliveryOrderTransportViolationList: [],
    //   id: 0, // ---[api]
    //   createdBy: null,
    //   createdAt: '',
    //   updatedBy: null,
    //   updatedAt: '',
    //   updateTimes: null,
    // },
  ],
  id: 0, // ---[api]
  createdBy: null,
  createdAt: '',
  updatedBy: null,
  updatedAt: '',
  // UI section 5
  basketsTrays: [
    {
      stt: '',
      name: '', // tên khay sọt
      amount: '', // số lượng
      amountReal: '', // số lượng thực tế
    },
  ],
  basketsInfor: [
    {
      stt: '',
      basketName: '',
      receiverQuantity: '',
      deliverQuantity: '',
    },
  ],
};

export const shipperListDefault = [
  {
    vehicleRouteTypeName: '',
    shipperName: '', // Tên shipper
    deliveryOrderId: 0,
    vehicleNumbering: 1, // Số thứ tự xe trong ngày ---[api]
    shipper: '', // Nhà vận chuyển ---[api]
    driver: '', // Lái xe ---[api]
    phone: '', // Số điện thoại ---[api]
    drivingPlate: '', // Bằng lái ---[api]
    vehicleWeight: '', // Trọng lượng xe ---[api]
    regulatedDepartureHour: '', // Giờ xuất phát quy định ---[api]
    actualDepartureHour: '', // Giờ xuất phát thực tế ---[api]
    drivingDuration: '', // Thời gian di chuyển (giờ) ---[api]
    regulatedArrivalDate: '', // Ngày đến theo quy định ---[api]
    regulatedArrivalHour: '', // Giờ đến theo quy định ---[api]
    plannedArrivalDate: '', // Ngày dự kiến đến
    plannedArrivalHour: '', // Giờ dự kiến đến
    actualArrivalDate: '', // Ngày đến thực tế
    actualArrivalHour: '', // Giờ đến thực tế
    deliveryTime: '', // Thời gian trả hàng xong
    coolingVehicleTime: 0, // TG nổ xe lạnh trả hàng
    actualTemperature: null, // Nhiệt độ thực tế
    vehicleRouteType: null, // Loại xe, tuyến
    temperatureStatus: 0, // Trạng thái nhiệt độ
    minStandardTemperature: '', // Nhiệt độ tiêu chuẩn (Min)
    maxStandardTemperature: '', // Nhiệt độ tiêu chuẩn (Max)
    chipTemperature1: 0, // Nhiệt độ chíp 1
    chipTemperature2: 0, // Nhiệt độ chíp 2
    chipTemperatureStatus: 0, // Trạng thái nhiệt độ chip
    vehiclePallet: 0, // Pallet lót sàn xe
    vehicleCleaning: 0, // Vệ sinh xe
    shippingLeadtime: 0, // Leadtime vận chuyển
    unregulatedLeadtime: false,
    reason: 0, // Nguyên nhân
    notes: '',
    deliveryOrderTransportViolationList: [],
    id: 0, // ---[api]
    createdBy: null,
    createdAt: '',
    updatedBy: null,
    updatedAt: '',
    updateTimes: null,
  },
];
