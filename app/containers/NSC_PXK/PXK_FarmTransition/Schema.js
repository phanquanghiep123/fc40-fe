import * as Yup from 'yup';
// cast
export const productSchema = Yup.object().shape({
  stt: Yup.number(),
  productCode: Yup.string().default(undefined),
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
  slotCode: Yup.string(),
  processingType: Yup.number()
    .nullable()
    .default(null),
  processingTypeName: Yup.string()
    .nullable()
    .default(null),
  locatorName: Yup.string(),
  quantity: Yup.number(),
  uom: Yup.string(),
  basketShortName1: Yup.string().nullable(),
  deliverQuantity1: Yup.number().nullable(),
  basketShortName2: Yup.string().nullable(),
  deliverQuantity2: Yup.number().nullable(),
  basketShortName3: Yup.string().nullable(),
  deliverQuantity3: Yup.number().nullable(),
  statusName: Yup.string(),
});

// validate
export default Yup.object().shape({
  stt: Yup.number(),
  exportedQuantity: Yup.number() // Số lượng xuất
    .max(
      Yup.ref('inventoryQuantity'),
      'Số lượng xuất không được lớn hơn số lượng tồn',
    )
    .required('Cần nhập giá trị')
    .nullable()
    .default(null),
  productCode: Yup.string()
    .required('Không được bỏ trống')
    .default(undefined),
  productName: Yup.string(),
  slotCode: Yup.string(),
  processingType: Yup.number()
    .nullable()
    .default(null),
  processingTypeName: Yup.string()
    .required('Không được bỏ trống')
    .nullable()
    .default(null),
  locatorName: Yup.string(),
  inventoryQuantity: Yup.number()
    .nullable()
    .default(null),
  quantity: Yup.number(),
  uom: Yup.string(),
  basketShortName1: Yup.string().nullable(),
  basketQuantity1: Yup.number().nullable(),
  basketShortName2: Yup.string().nullable(),
  basketQuantity2: Yup.number().nullable(),
  basketShortName3: Yup.string().nullable(),
  basketQuantity3: Yup.number().nullable(),
  statusName: Yup.string(),
});
export const initSchema = {
  detailsCommands: [],
};
