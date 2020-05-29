import MuiSelectEditor from '../../../../components/MuiSelect/Editor';

export default class CustomMuiSelectEditor extends MuiSelectEditor {
  /**
   * Stop editing if storeCode is empty
   * @returns {boolean}
   */
  isCancelBeforeStart = () => {
    const { data } = this.props;
    return !data.storeCode;
  };
}
