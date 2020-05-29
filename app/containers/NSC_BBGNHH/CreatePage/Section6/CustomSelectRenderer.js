import * as PropTypes from 'prop-types';
import CustomCellRenderer from './CustomCellRenderer';

export default function SelectRenderer(props) {
  const { value, colDef } = props;

  let params;
  let nextValue = null;

  if (typeof colDef.cellEditorParams === 'function') {
    params = colDef.cellEditorParams(props);
  } else {
    params = colDef.cellEditorParams;
  }

  if (params && params.options) {
    const valueKey = params.valueKey || 'value';
    const labelKey = params.labelKey || 'label';

    const found = params.options.find(
      option => option && option[valueKey] === value,
    );

    if (found && found[labelKey]) {
      nextValue = found[labelKey] || null;
    }
  }

  /**
   * CR #9150
   * Use Custom Cell Render to hide data when transporterCode is null
   */
  return CustomCellRenderer({ ...props, value: nextValue, tooltip: true });
}

SelectRenderer.propTypes = {
  value: PropTypes.any,
  colDef: PropTypes.object,
};
