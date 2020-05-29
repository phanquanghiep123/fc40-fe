import CreatePage from '../Create';

export default class ViewPage extends CreatePage {
  isCreate = () => false;

  isEdit = () => false;

  isView = () => true;
}
