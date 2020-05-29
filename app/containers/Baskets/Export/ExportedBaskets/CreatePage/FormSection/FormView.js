import FormCreate from './FormCreate';

export default class FormView extends FormCreate {
  isCreate = () => false;

  isEdit = () => false;

  isView = () => true;
}
