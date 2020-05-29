import * as Yup from 'yup';
import { localstoreUtilites } from 'utils/persistenceData';
import { TYPE_PXK } from '../PXK/constants';
const auth = localstoreUtilites.getAuthFromLocalStorage();

const STRING_REQUIRED = 'Trường không được bỏ trống';

export const productSchema = Yup.object().shape({
  locatorId: Yup.string(),
  locatorName: Yup.string(),
  stt: Yup.number(),
  productCode: Yup.string().default(undefined),
  exportedQuantity: Yup.number()
    .required('Cần nhập giá trị')
    .nullable()
    .default(null),
  inventoryQuantity: Yup.number()
    .nullable()
    .default(null),
  productName: Yup.string(),
  slotCode: Yup.string().nullable(),
  quantity: Yup.number(),
  uom: Yup.string(),
  basketName1: Yup.number().nullable(),
  basketName2: Yup.string().nullable(),
  basketQuantity2: Yup.number().nullable(),
  basketName3: Yup.string().nullable(),
  basketQuantity3: Yup.number().nullable(),
  statusName: Yup.string(),
  isEnterQuantity: Yup.bool().default(true),
  isNotSaved: Yup.bool().default(true),
  regionCode: Yup.string().nullable(),
});

export const validationExportedRetail = Yup.object().shape({
  retailCustomerName: Yup.string().nullable(),
  customerName: Yup.string()
    .required(STRING_REQUIRED)
    .nullable(),
  customerCode: Yup.string()
    .required(STRING_REQUIRED)
    .nullable(),
  businessObject: Yup.string()
    .required(STRING_REQUIRED)
    .nullable(),
  paymentType: Yup.number()
    .required(STRING_REQUIRED)
    .nullable(),
  customerBasketName: Yup.string()
    .when(['subType', 'basketsTrays'], (subType, basketsTrays, schema) => {
      if (subType === TYPE_PXK.PXK_XUAT_BAN && basketsTrays.length > 0) {
        return schema.required(STRING_REQUIRED);
      }
      return schema;
    })
    .nullable(),
  exportSellType: Yup.string().when('subType', (subType, schema) => {
    if (subType === TYPE_PXK.PXK_XUAT_BAN) {
      return schema.required(STRING_REQUIRED);
    }
    return schema;
  }),
  retailCustomerPhoneNumber: Yup.string().nullable(),
  date: Yup.date()
    .required(STRING_REQUIRED)
    .nullable(),
  userName: Yup.string().required(STRING_REQUIRED),
  supervisorName: Yup.string().required(STRING_REQUIRED),
  // table
  detailsCommands: Yup.array().when(
    'isCompleteAction',
    (isCompleteAction, schema) => {
      if (isCompleteAction)
        return schema.of(
          productSchema.concat(
            Yup.object({
              exportedQuantity: Yup.number()
                .max(
                  Yup.ref('inventoryQuantity'),
                  'Số lượng xuất không được lớn hơn số lượng tồn',
                )
                .required('Cần nhập giá trị')
                .nullable()
                .default(null),
              slotCode: Yup.string().required(STRING_REQUIRED),
            }),
          ),
        );

      return schema.of(productSchema);
    },
  ),
});

export const initSchemaExportedRetail = {
  businessObject: 1, // number: đối tượng bán hàng
  deliverCode: '',
  subType: TYPE_PXK.PXK_XUAT_BAN_XA,
  customerCode: '', // Mã đơn vị nhận hàng
  customerName: '', // Tên đơn vị nhận hàng
  saleOrderId: null, // Field này chưa sử dùng, set giá trị null
  retailCustomerId: 0, // Id của khách lẻ
  retailCustomerPhoneNumber: '', // Số điện thoại của khách lẻ
  retailCustomerName: '', // Tên của khách lẻ
  retailCustomerAddress: '', // Địa chỉ của khách lẻ
  transporterCode: '', // Nhà vận chuyển
  date: new Date(), // Thời gian lập phiếu
  customerBasketName: '', // Tên đơn vị quản lý khay sọt
  customerBasketCode: '', // Mã đơn vị quản lý khay sọt
  isCreateDeliveryOrder: false, // Có tự động tạo biên bản giao hàng hay không ?
  userName: `${auth.meta.fullName}`, // Mã người cân hàng
  userId: `${auth.meta.userId}`, // Mã người cân hàng
  userPhone: `${auth.meta.phoneNumber}`, // Số điện thoại người cân hàng
  userEmail: `${auth.meta.email}`, // Email người cân hàng
  supervisorId: '', // giám sát 1
  supervisorName: '', // giám sát 1
  supervisorId2: '', // giám sát 2
  supervisorName2: '', // giám sát 2
  note: '', // ghi chú
  paymentType: 1, // Hình thức thanh toán
  detailsCommands: [], // Danh sách sản phẩm sẽ bán xá
  basketsTrays: [], // Thông tin khay sọt
  isCompleteAction: false,
  mainTotal: '',
};
