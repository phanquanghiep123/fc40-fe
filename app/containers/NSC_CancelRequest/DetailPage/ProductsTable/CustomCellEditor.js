import PopupEditor from '../../../../components/FormikUI/PopupEditor';

export default class CustomCellEditor extends PopupEditor {
  /**
   * Prevent editing if productCode is empty/undefined
   * @returns {boolean}
   */
  isCancelBeforeStart = () => {
    const { data } = this.props;
    return !data.productCode;
  };
}
