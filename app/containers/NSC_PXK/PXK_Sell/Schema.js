import * as Yup from 'yup';
// cast
export const productSchema = Yup.object().shape({
  locatorId: Yup.string(),
  locatorName: Yup.string(),
  stt: Yup.number(),
  productCode: Yup.string()
    .default(undefined)
    .nullable(),
  exportedQuantity: Yup.number()
    .max(
      Yup.ref('inventoryQuantity'),
      'Số lượng xuất không được lớn hơn số lượng tồn',
    )
    .required('Cần nhập giá trị')
    .nullable()
    .default(null),
  inventoryQuantity: Yup.number()
    .nullable()
    .default(null),
  productName: Yup.string(),
  batch: Yup.string().nullable(),
  processingType: Yup.number()
    .nullable()
    .default(null),
  processingTypeName: Yup.string()
    .nullable()
    .default(null),
  quantity: Yup.number(),
  uom: Yup.string(),
  basketName1: Yup.string().nullable(),
  basketName2: Yup.string().nullable(),
  basketQuantity2: Yup.number().nullable(),
  basketName3: Yup.string().nullable(),
  basketQuantity3: Yup.number().nullable(),
  statusName: Yup.string(),
  isEnterQuantity: Yup.bool().default(true),
  isNotSaved: Yup.bool().default(true),
});

export default Yup.object().shape({
  stt: Yup.number(),
  // Số lượng xuất
  exportedQuantity: Yup.number()
    .required('Cần nhập giá trị')
    .nullable()
    .default(null),
  productCode: Yup.string()
    .required('Không được bỏ trống')
    .default(undefined)
    .nullable(),
  productName: Yup.string(),
  slotCode: Yup.number(),
  processingType: Yup.number()
    .nullable()
    .default(null),
  locatorName: Yup.string(),
  inventoryQuantity: Yup.number()
    .nullable()
    .default(null),
  quantity: Yup.number().nullable(),
  uom: Yup.string(),
  basketName1: Yup.string().nullable(),
  basketQuantity1: Yup.number().nullable(),
  basketName2: Yup.string().nullable(),
  basketQuantity2: Yup.number().nullable(),
  basketName3: Yup.string().nullable(),
  basketQuantity3: Yup.number().nullable(),
  statusName: Yup.string(),
  turnToScaleIds: Yup.array()
    .default([])
    .nullable(),
});
export const initSchema = {
  detailsCommands: [],
};
