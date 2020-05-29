import Create from './Create';

export default class Cancel extends Create {
  isCreate = () => false;

  isEdit = () => false;

  isView = () => false;

  isCancel = () => true;
}
