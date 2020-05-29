import * as PropTypes from 'prop-types';
import PopupEditor from '../../../../components/FormikUI/PopupEditor';

class CustomCellEditor extends PopupEditor {
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

CustomCellEditor.propTypes = {
  dependencies: PropTypes.array, // array of field keys. Ex: ['id', 'basketCode', ...]
};

export default CustomCellEditor;
