/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-template-curly-in-string */
import * as Yup from 'yup';

import { validateDuplicate } from './section4Utils';

import { TYPE_BBGH } from './constants';

export const initSchema = {
  baseUoM: '', // Đơn vị sp
  isInScale: false, // Sp đang cân
  receivingStockFlag: 0, // Sp hoàn thành cân nhập kho [0, 1]
  productionOrder: null, // Lệnh sản xuất
  productionSupervior: 0, // [0: Mặc định, 1: Chuyển mã, 2: Byproduct]
  isTranscoding: false, // Chuyển mã
  originalCode: null, // Mã đi hàng ứng với LSX
  originalType: 0, // Loại sp ứng với LSX
  originalTypeName: '', // Tên loại sp ứng với LSX
  originalDescription: '', // Tên sp ứng với LSX
  doConnectingId: null, // Mã đi hàng
  productType: 0, // Loại sp
  productTypeName: '', // Tên loại sp
  finishProductCode: null, // Mã tp
  finishProductName: '', // Tên tp
  pvCode: null,
  slotCode: null, // Lô, batch
  materialDescription: '', // Tên sp
  processingType: 0, // Phân loại xử lý
  processingTypeName: '',
  plannedTotalQuatity: null, // Tổng lượng dự kiến
  totalReceivingWeight: null, // Khối lượng thực tế
  basketCode1: 0, // Mã khay sọt
  basketShortName1: '', // Tên khay sọt
  deliverQuantity1: null, // Số lượng khay sọt
  basketCode2: 0,
  basketShortName2: '',
  deliverQuantity2: null,
  basketCode3: 0,
  basketShortName3: '',
  deliverQuantity3: null,
  farmQcRecoveryRate: null, // Tỉ lệ thu hồi QC Farm
  processorQcRecoveryRate: null, // Tỷ lệ thu hồi QC NSC
  notes: '', // Ghi chú
};

export const productSchema = Yup.object().shape({
  doConnectingId: Yup.string()
    .nullable()
    .default(undefined), // Mã đi hàng

  productType: Yup.number()
    .nullable()
    .default(0), // Loại sp

  productTypeName: Yup.string()
    .nullable()
    .default(''), // Tên loại sp

  materialDescription: Yup.string()
    .nullable()
    .default(''), // Tên sp
});

export const originalProductSchema = Yup.object().shape({
  originalCode: Yup.string()
    .nullable()
    .default(undefined), // Mã đi hàng

  originalType: Yup.number()
    .nullable()
    .default(0), // Loại sp

  originalTypeName: Yup.string()
    .nullable()
    .default(''), // Tên loại sp

  originalDescription: Yup.string()
    .nullable()
    .default(''), // Tên sp
});

export const section4Schema = Yup.array()
  .transform(values => {
    const results = [];

    for (let i = 0, len = values.length; i < len; i += 1) {
      const value = values[i];
      if (value === undefined) {
        results[i] = null;
      } else {
        results[i] = value;
      }
    }

    return results;
  })
  .when('doType', (doType, schema) => {
    if (doType === TYPE_BBGH.NCC_TO_NSC) {
      return schema.of(
        Yup.object()
          .shape({
            doConnectingId: Yup.string()
              .typeError('Yêu cầu nhập đúng')
              .required('Không được trống'),
            processingType: Yup.number().required('Không được trống'),
            productTypeName: Yup.string().required('Nhập lại Mã đi hàng'),
            plannedTotalQuatity: Yup.number()
              .typeError('Yêu cầu nhập đúng')
              .required('Không được trống')
              .moreThan(0, 'Giá trị phải lớn hơn ${more}'),
            notes: Yup.string()
              .nullable()
              .max(50, 'Giới hạn chỉ ${max} ký tự'),
          })
          .nullable(),
      );
    }
    if (doType === TYPE_BBGH.BASKET_DELIVERY_ORDER) {
      return schema.of(
        Yup.object()
          .shape({
            deliverQuantity: Yup.string()
              .required('Không được trống')
              .nullable(),
          })
          .nullable(),
      );
    }

    return schema.of(
      Yup.object()
        .shape({
          doConnectingId: Yup.string()
            .typeError('Yêu cầu nhập đúng')
            .required('Không được trống'),
          processingType: Yup.number().required('Không được trống'),
          productTypeName: Yup.string().required(
            'Nhập lại LSX hoặc Mã đi hàng',
          ),
          plannedTotalQuatity: Yup.number()
            .typeError('Yêu cầu nhập đúng')
            .required('Không được trống')
            .moreThan(0, 'Giá trị phải lớn hơn ${more}'),
          deliverQuantity1: Yup.number()
            .typeError('')
            .min(0, 'Giá trị phải lớn hơn hoặc bằng ${min}'),
          deliverQuantity2: Yup.number()
            .typeError('')
            .min(0, 'Giá trị phải lớn hơn hoặc bằng ${min}'),
          deliverQuantity3: Yup.number()
            .typeError('')
            .min(0, 'Giá trị phải lớn hơn hoặc bằng ${min}'),
          farmQcRecoveryRate: Yup.number()
            .nullable()
            .integer('Giá trị phải là số nguyên')
            .min(0, 'Giá trị phải lớn hơn hoặc bằng ${min}')
            .max(100, 'Giá trị phải nhỏ hơn hoặc bằng ${max}')
            .when('doType', (doType1, schema1) => {
              if (
                doType === TYPE_BBGH.FARM_POST_HARVEST ||
                doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4
              ) {
                return schema1.typeError('');
              }
              return schema1
                .typeError('Không được trống')
                .required('Không được trống');
            }),
          notes: Yup.string()
            .nullable()
            .max(50, 'Giới hạn chỉ ${max} ký tự'),
        })
        .nullable(),
    );
  })
  .test('testDuplicate', '', function test(values) {
    if (values && values.length > 0) {
      const { doType } = this.parent;

      if (
        [
          TYPE_BBGH.FARM_POST_HARVEST,
          TYPE_BBGH.FARM_TO_PLANT_CODE_1,
          TYPE_BBGH.FARM_TO_PLANT_CODE_2,
        ].includes(doType)
      ) {
        const errors = [];

        validateDuplicate(values, (value, i) => {
          errors.push(
            this.createError({
              path: `${this.path}[${i}].productionOrder`,
              message: 'Không được trùng',
            }),
            this.createError({
              path: `${this.path}[${i}].doConnectingId`,
              message: 'Không được trùng',
            }),
            this.createError({
              path: `${this.path}[${i}].processingType`,
              message: 'Không được trùng',
            }),
          );
        });

        if (errors.length > 0) {
          return new Yup.ValidationError(errors);
        }
      }
    }
    return true;
  });

export const section4BasketSchema = Yup.array()
  .transform(values => {
    const results = [];

    for (let i = 0, len = values.length; i < len; i += 1) {
      const value = values[i];
      if (value === undefined) {
        results[i] = null;
      } else {
        results[i] = value;
      }
    }

    return results;
  })
  .when('doType', (doType, schema) => {
    if (doType === TYPE_BBGH.BASKET_DELIVERY_ORDER) {
      return schema.of(
        Yup.object().shape({
          deliverQuantity: Yup.number()
            .min(1, 'Yêu cầu lớn hơn 0')
            .nullable()
            .typeError('Yêu cầu nhập số')
            .default(0),
        }),
      );
    }

    return schema;
  });

export default function Schema(init = {}) {
  this.baseUoM = init.baseUoM;
  this.productionOrder = init.productionOrder;
  this.productionSupervior = init.productionSupervior;
  this.isTranscoding = init.isTranscoding;
  this.originalCode = init.originalCode;
  this.originalType = init.originalType;
  this.originalTypeName = init.originalTypeName;
  this.originalDescription = init.originalDescription;
  this.doConnectingId = init.doConnectingId;
  this.productType = init.productType;
  this.productTypeName = init.productTypeName;
  this.finishProductCode = init.finishProductCode;
  this.finishProductName = init.finishProductName;
  this.pvCode = init.pvCode;
  this.slotCode = init.slotCode;
  this.materialDescription = init.materialDescription;
  this.processingType = init.processingType;
  this.processingTypeName = init.processingTypeName;
  this.plannedTotalQuatity = init.plannedTotalQuatity;
  this.totalReceivingWeight = init.totalReceivingWeight;
  this.basketCode1 = init.basketCode1;
  this.basketShortName1 = init.basketShortName1;
  this.deliverQuantity1 = init.deliverQuantity1;
  this.basketCode2 = init.basketCode2;
  this.basketShortName2 = init.basketShortName2;
  this.deliverQuantity2 = init.deliverQuantity2;
  this.basketCode3 = init.basketCode3;
  this.basketShortName3 = init.basketShortName3;
  this.deliverQuantity3 = init.deliverQuantity3;
  this.farmQcRecoveryRate = init.farmQcRecoveryRate;
  this.processorQcRecoveryRate = init.processorQcRecoveryRate;
  this.notes = init.notes;
}

export function BasketSchema(init = {}) {
  return {
    basketCode: init.basketCode,
    basketName: init.basketName,
    basketUom: init.basketUom,
    deliverQuantity: init.deliverQuantity,
    receiverQuantity: init.receiverQuantity,
    note: init.note,
  };
}
