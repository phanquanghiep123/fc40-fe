import TableCreate from './TableCreate';
// import { TYPE_PXKS } from '../constants';

export default class TableView extends TableCreate {
  isCreate = () => false;

  isEdit = () => false;

  isView = () => true;
}
