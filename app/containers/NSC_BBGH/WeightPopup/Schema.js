import * as Yup from 'yup';

import { TurnScalesSchema } from 'components/GoodsWeight/Schema';

export default Yup.object().shape({
  // Lệnh sản xuất
  productionOrder: Yup.string()
    .nullable()
    .default(''),

  // Mã đi hàng
  doConnectingId: Yup.string()
    .nullable()
    .default(''),

  // Tên sản phẩm
  materialDescription: Yup.string()
    .nullable()
    .default(''),

  // Tên phân loại xử lý
  processingTypeName: Yup.string()
    .nullable()
    .default(''),

  // Tổng lượng dự kiến
  quantity: Yup.number()
    .nullable()
    .default(null),

  // Danh sách các lần Bân
  turnToScales: TurnScalesSchema,
});
