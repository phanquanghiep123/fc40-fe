import * as Yup from 'yup';
import { startOfDay } from 'date-fns';
import { localstoreUtilites } from 'utils/persistenceData';

import { section4Schema, section4BasketSchema } from './section4Schema';
import { TYPE_BBGH } from './constants';

const auth = localstoreUtilites.getAuthFromLocalStorage();
const now = new Date().toISOString();

const validNCC = Yup.string().when('doType', (doType, schema) => {
  if (doType === TYPE_BBGH.NCC_TO_NSC) {
    return schema.required('Trường không được bỏ trống');
  }

  return schema;
});

const validWhenInputSupplier = Yup.string()
  .nullable()
  .when('shipper', (shipper, schemas) => {
    if (shipper) {
      return schemas.required('Cần nhập giá trị');
    }

    return schemas;
  });

const validReciver = (schema, message) =>
  schema
    .notOneOf([Yup.ref('deliveryName'), null], message)
    .required('Trường không được bỏ trống');

export default Yup.object().shape({
  // I. Thông tin biên bản (mục 1)
  // sealNumber: Yup.string().when('doType', (doType, schema) => {
  //   if (
  //     [
  //       TYPE_BBGH.NCC_TO_NSC,
  //       TYPE_BBGH.FARM_POST_HARVEST,
  //       TYPE_BBGH.FARM_TO_PLANT_CODE_2,
  //     ].includes(doType)
  //   ) {
  //     return schema;
  //   }

  //   return schema.required('Trường không được bỏ trống');
  // }),
  vehicleNumbering: Yup.string().when(
    ['doType', 'shipperList'],
    (doType, shipperList, schema) => {
      if (
        [
          TYPE_BBGH.NCC_TO_NSC,
          TYPE_BBGH.FARM_POST_HARVEST,
          TYPE_BBGH.FARM_TO_PLANT_CODE_2,
        ].includes(doType)
      ) {
        return Yup.string();
      }

      if (!shipperList || !shipperList[0].shipper) {
        return Yup.string();
      }

      return schema.required('Trường không được bỏ trống');
    },
  ),

  // II. Thông tin bên giao hàng (mục 2)
  deliveryDateTime: Yup.date().when('doType', (doType, schema) => {
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
  }), // ngay giao
  deliveryPersonName: Yup.string().required('Trường không được bỏ trống'), // tên đại diện giao hàng
  deliveryName: Yup.string().required('Trường không được bỏ trống'),

  // III. Thông tin bên nhận hàng (mục 3)
  receivingPersonName: validNCC, // tên đại diện nhận hàng
  stockReceivingDateTime: Yup.date().when('doType', (doType, schema) => {
    if (doType === TYPE_BBGH.NCC_TO_NSC) {
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
  }), // ngày nhận
  receiverName: Yup.string().when('doType', (doType, schema) => {
    if (doType === TYPE_BBGH.NCC_TO_NSC) {
      return schema;
    }

    switch (doType) {
      case TYPE_BBGH.FARM_TO_PLANT_CODE_1:
        return validReciver(
          schema,
          'BBGH Từ Farm tới plant (khác địa điểm) không được nhập bên giao trùng bên nhận',
        );
      case TYPE_BBGH.FARM_TO_PLANT_CODE_2:
        return validReciver(
          schema,
          'BBGH Từ Farm tới plant (cùng địa điểm) không được nhập bên giao trùng bên nhận',
        );
      case TYPE_BBGH.PLANT_TO_PLANT_CODE_4:
        return validReciver(
          schema,
          'BBGH Từ plant tới plant (có PXK - trong ngày) không được nhập bên giao trùng bên nhận',
        );
      case TYPE_BBGH.PLANT_TO_PLANT_CODE_5:
        return validReciver(
          schema,
          'BBGH Từ plant tới plant (có PXK - khác ngày) không được nhập bên giao trùng bên nhận',
        );
      default:
        return schema.required('Trường không được bỏ trống');
    }
  }),

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
        vehicleRouteTypeName: validWhenInputSupplier,
        shipperName: Yup.string().when(
          [
            'driver',
            'phone',
            'drivingPlate',
            'vehicleWeight',
            'regulatedDepartureHour',
            'actualDepartureHour',
            'vehicleRouteTypeName',
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
            vehicleRouteTypeName,
            minStandardTemperature,
            maxStandardTemperature,
            actualArrivalHour,
            schemas,
          ) => {
            if (
              driver ||
              phone ||
              drivingPlate ||
              vehicleWeight ||
              regulatedDepartureHour ||
              actualDepartureHour ||
              vehicleRouteTypeName ||
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

export const initialSchema = {
  // ui
  doWorkingUnitName: '',
  regionName: '',
  plantType: '', // Loại plant bên nhận hàng (Farm hoặc NSC)
  // api
  doType: '', // loại BBGH
  doWorkingUnitCode: '', // Mã đơn vị tạo BB
  deliverCode: '', // Mã bên giao hàng
  deliveryName: '', // Tên bên giao hàng
  deliveryDateTime: now, // Ngày giờ giao hàng
  receiverCode: '', // Mã bên nhận hàng
  receiverName: '', // Tên bên nhận hàng
  sealNumber: '', // Số seal ---
  deliveryPersonCode: `${auth.meta.userId}`, // Mã đại diện giao hàng
  deliveryPersonName: `${auth.meta.fullName}`, // Tên đại diện giao hàng
  deliveryPersonPhone: `${auth.meta.phoneNumber}`, //  số điện thoại đại diện giao hàng
  receivingPersonCode: '', // Mã đại diện nhận hàng
  receivingPersonName: '', // Tên đại diện nhận hàng
  receivingPersonPhone: '', // Số điện thoại đại diện nhận hàng
  stockReceivingDateTime: now, // ngày nhận hàng
  vehicleNumbering: '', // Số thứ tự xe trong ngày
  stockList: [
    // hàng hóa IV
  ],
  shipperList: [
    // VI. thông tin bên vận chuyển
    {
      // UI
      shipperName: '',
      vehicleRouteTypeName: '',
      // api
      vehicleNumbering: 1, // stt (number)
      shipper: '', // Nhà vận chuyển (number)
      driver: '', // Lái xe
      phone: '', // Điện thoại
      drivingPlate: '', // Biển số xe
      vehicleWeight: '', // Tải trọng xe
      regulatedDepartureHour: '', // Giờ xuất phát theo qui định - string
      actualDepartureHour: '', // Giờ xuất phát thực tế - string
      drivingDuration: '', // Thời gian di chuyển (giờ) - number
      regulatedArrivalDate: '', // Ngày đến theo qui định : 2019-04-22T11:56:46.101Z
      regulatedArrivalHour: '', // Giờ đến theo qui định - string
      plannedArrivalDate: '', // ngày dự kiến đến : 2019-04-26T10:49:38.423Z
      plannedArrivalHour: '', // giờ dự kiến đến - string
      unregulatedLeadtime: false, // field checkbox trên table vận chuyển
      vehicleRouteType: null, // Loại xe, tuyến
      minStandardTemperature: '', // Nhiệt độ tiêu chuẩn (Min)
      maxStandardTemperature: '', // Nhiệt độ tiêu chuẩn (Max)
    },
  ],
  // UI section 5
  basketsTrays: [
    {
      stt: '',
      code: '',
      name: '', // tên khay sọt
      amount: '', // số lượng
      amountReal: '', // số lượng thực tế
    },
  ],
  // BBGH loại dành cho khay sọt
  basketList: [],
  basketsInfor: [
    {
      stt: '',
      basketCode: '',
      basketName: '',
      receiverQuantity: '',
      basketUom: '',
      deliverQuantity: '',
    },
  ],
};
