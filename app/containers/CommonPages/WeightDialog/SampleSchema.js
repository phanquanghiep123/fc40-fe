import * as Yup from 'yup';

import {
  TurnScalesSchema,
  BasketPalletSchema,
} from 'components/GoodsWeight/Schema';

export default Yup.object().shape({
  // Thông tin khay sọt
  basketPallet: BasketPalletSchema,

  // Danh sách các lần Bân
  turnToScales: TurnScalesSchema,
});
