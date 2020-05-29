import * as Yup from 'yup';

import {
  TurnScalesSchema,
  BasketPalletSchema,
} from 'components/GoodsWeight/Schema';

import { TYPE_BASE_UNIT } from 'utils/constants';

export default Yup.object().shape({
  // Index của dòng đang cân
  rowIndex: Yup.number()
    .nullable()
    .notRequired(),

  // Id phiếu
  documentId: Yup.number()
    .nullable()
    .default(null),

  // Đơn vị bên nhận, lấy từ Bộ phận
  receiverCode: Yup.string()
    .nullable()
    .default(''),

  // Đơn vị bên giao, lấy từ Farm/NCC
  deliverCode: Yup.string()
    .nullable()
    .default(''),

  // Loại của Bộ phận
  organizationType: Yup.number()
    .nullable()
    .default(0),

  // Mã BTP
  semiFinishedProductCode: Yup.string()
    .nullable()
    .default(''),

  // Batch BTP
  semiFinishedProductSlotCode: Yup.string()
    .nullable()
    .default(''),

  // Mã sản phẩm
  productCode: Yup.string()
    .nullable()
    .default(''),

  // Tên sản phẩm
  productName: Yup.string()
    .nullable()
    .default(''),

  // Batch sản phẩm
  productBatchCode: Yup.string()
    .nullable()
    .default(''),

  // Đơn vị sản phẩm
  baseUoM: Yup.string()
    .nullable()
    .default(TYPE_BASE_UNIT.KG),

  // Loại sản phẩm
  gradeCode: Yup.string()
    .nullable()
    .default(''),

  // Tên loại sản phẩm
  gradeName: Yup.string()
    .nullable()
    .default(''),

  // Tổng khối lượng thực
  quantity: Yup.number()
    .nullable()
    .default(null),

  // Ngày thực hiện cân
  date: Yup.string().default(new Date()),

  // Người thực hiện cân
  userId: Yup.string(),

  // Thông tin khay sọt
  basketPallet: BasketPalletSchema,

  // Danh sách các lần Bân
  turnToScales: TurnScalesSchema,
});
