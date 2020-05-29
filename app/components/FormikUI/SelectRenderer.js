import PropTypes from 'prop-types';

import CellRenderer from './CellRenderer';

export default function SelectRenderer(props) {
  const { value, colDef } = props;

  let params;
  let nextValue = '';

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
      nextValue = found[labelKey];
    }
  }

  return CellRenderer({ ...props, value: nextValue, tooltip: true });
}

SelectRenderer.propTypes = {
  value: PropTypes.any,
  colDef: PropTypes.object,
};
