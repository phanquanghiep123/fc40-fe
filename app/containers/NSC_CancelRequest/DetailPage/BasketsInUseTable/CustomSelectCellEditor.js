import * as PropTypes from 'prop-types';
import MuiSelectEditor from '../../../../components/MuiSelect/Editor';

class CustomSelectCellEditor extends MuiSelectEditor {
  componentWillUnmount() {
    const { rowIndex, colDef, api } = this.props;
    setTimeout(() => {
      api.setFocusedCell(rowIndex, colDef.field, null);
    });
  }

  /**
   * Prevent editing if missing any dependencies
   * @returns {boolean}
   */
  isCancelBeforeStart = () => {
    const { data, dependencies } = this.props;
    if (!dependencies || !dependencies.length) return false;

    // eslint-disable-next-line no-restricted-syntax
    for (const fieldKey of dependencies) {
      if (!data[fieldKey] && data[fieldKey] !== 0) {
        return true;
      }
    }

    return false;
  };
}

CustomSelectCellEditor.propTypes = {
  dependencies: PropTypes.array, // array of field keys. Ex: ['id', 'basketCode', ...]
  timeout: PropTypes.number,
};

export default CustomSelectCellEditor;
