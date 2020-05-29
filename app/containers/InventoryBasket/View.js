import Create from './Create';

export default class View extends Create {
  isCreate = () => false;

  isEdit = () => false;

  isView = () => true;

  isCancel = () => false;
}
