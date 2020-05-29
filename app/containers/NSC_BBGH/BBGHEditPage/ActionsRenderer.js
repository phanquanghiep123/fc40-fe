import { withStyles } from '@material-ui/core/styles';

import {
  ActionsRenderer,
  styles,
} from '../BBGHCreatePage/GoodsTable/ActionsRenderer';

import { TYPE_BBGH } from '../BBGHCreatePage/constants';

export class ActionsEditRenderer extends ActionsRenderer {
  get isDeleteVisible() {
    if (this.props.data && this.props.data.deliveryOrderId >= 0) {
      /*
    * isExistBasketDocument: bbgh có phiếu xuất kho khay sọt
    * isBasketNotDone: phiếu xuất kho khay sọt chưa hoàn thành thì không được xoá
    * */
      if (
        this.props.context.props.values.isExistBasketDocument &&
        this.props.context.props.values.isBasketNotDone
      ) {
        return false;
      }
      // Không hiển thị khi đang hoặc hoàn thành cân nhập kho
      if (this.props.data.isInScale || this.props.data.receivingStockFlag) {
        return false;
      }

      // Không hiển thị khi loại BBGH từ NCC và được tạo tự động
      if (this.props.context.getDoType) {
        const doType = this.props.context.getDoType();

        if (doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4) {
          return false;
        }

        if (doType === TYPE_BBGH.NCC_TO_NSC && this.props.data.autoFlag > 0) {
          return false;
        }
      }

      return true;
    }

    // Thêm mới sản phẩm
    if (this.props.data && this.props.data.doConnectingId !== undefined) {
      return true;
    }
    return false;
  }
}

export default withStyles(styles)(ActionsEditRenderer);
