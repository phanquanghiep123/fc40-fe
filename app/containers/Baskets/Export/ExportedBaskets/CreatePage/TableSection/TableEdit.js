import TableCreate from './TableCreate';
import { TYPE_PXKS } from '../constants';
// import { TYPE_PXKS } from '../constants';

export default class TableEdit extends TableCreate {
  isCreate = () => false;

  isEdit = () => true;

  isView = () => false;

  isEditTable = () => {
    if (
      this.props.typeExported === TYPE_PXKS.PXKS_DIEU_CHUYEN &&
      this.props.dataValues.referType === 1
    ) {
      return false;
    }
    return true;
  };
}
