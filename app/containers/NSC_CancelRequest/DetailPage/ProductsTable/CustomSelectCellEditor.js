import MuiSelectInputEditor from '../../../../components/MuiSelect/InputEditor';

export default class CustomSelectCellEditor extends MuiSelectInputEditor {
  componentWillUnmount() {
    const { rowIndex, colDef, api } = this.props;
    setTimeout(() => {
      api.setFocusedCell(rowIndex, colDef.field, null);
    });
  }

  /**
   * Prevent editing if productCode is empty/undefined
   * @returns {boolean}
   */
  isCancelBeforeStart = () => {
    const { data } = this.props;
    return !data.productCode;
  };
}
