import Create from './Create';

export default class Edit extends Create {
  isCreate = () => false;

  isEdit = () => true;

  isView = () => false;

  isCancel = () => false;
}
