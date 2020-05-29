import CreatePage from '../Create';
import { REFER_TYPE, TYPE_PXKS } from '../constants';

export default class ConfirmPage extends CreatePage {
  isCreate = () => false;

  isEdit = () => false;

  isView = () => false;

  isConfirm = () => true;

  notEmptyObject = item => !!Object.keys(item).length;

  isDisable = () => {
    if (
      (this.props.typeExported === TYPE_PXKS.PXKS_DIEU_CHUYEN &&
        this.props.dataValues.referType === REFER_TYPE.FROM_BBGH_BBGHNHH) ||
      (this.props.dataValues.basketDocumentDetails.length > 0 &&
        this.props.dataValues.basketDocumentDetails.some(this.notEmptyObject))
    ) {
      return true;
    }
    return false;
  };

  // điều chuyển và phiếu xuất khay sọt tạo từ biên bản giao hàng
  isEditTable = () => {
    if (
      this.props.typeExported === TYPE_PXKS.PXKS_DIEU_CHUYEN &&
      this.props.dataValues.referType === REFER_TYPE.FROM_BBGH_BBGHNHH
    ) {
      return false;
    }
    return true;
  };
}
