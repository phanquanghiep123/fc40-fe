import FormCreate from './FormCreate';
import { TYPE_PXKS } from '../constants';

export default class FormEdit extends FormCreate {
  isCreate = () => false;

  isEdit = () => true;

  isView = () => false;

  isDisable = () => {
    if (
      (this.props.typeExported === TYPE_PXKS.PXKS_DIEU_CHUYEN &&
        this.props.dataValues.referType === 1) ||
      this.props.dataValues.basketDocumentDetails.length > 0
    ) {
      return true;
    }
    return false;
  };
}
