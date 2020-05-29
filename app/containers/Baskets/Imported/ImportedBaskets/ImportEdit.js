import ImportCreate from './ImportCreate';

export default class ImportEdit extends ImportCreate {
  isCreate = () => false;

  isEdit = () => true;

  isView = () => false;
}
