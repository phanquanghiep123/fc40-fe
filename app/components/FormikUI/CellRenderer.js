import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';

export const styles = {
  error: {
    color: 'red',
  },
  errorDivider: {
    height: '100%',
    borderBottom: '1.5px solid red',
  },
};

export default function CellRenderer({
  value,
  error,
  touched,
  colDef,
  tooltip,
  rowIndex,
  ...props
}) {
  const isError = touched && error;
  const nextValue = props.formatValue(value);

  if (['stt', 'order'].includes(colDef.field)) {
    return rowIndex + 1;
  }

  if (isError) {
    return (
      <Tooltip title={error}>
        <div style={styles.errorDivider}>{nextValue}</div>
      </Tooltip>
    );
  }
  if (tooltip) {
    return <div title={nextValue}>{nextValue}</div>;
  }

  return nextValue;
}

CellRenderer.propTypes = {
  value: PropTypes.any,
  // Formik
  error: PropTypes.string,
  touched: PropTypes.any,
  // Ag-Gird
  colDef: PropTypes.shape({
    field: PropTypes.string,
  }),
  tooltip: PropTypes.bool,
  rowIndex: PropTypes.number,
  formatValue: PropTypes.func,
};

CellRenderer.defaultProps = {
  value: '',
  tooltip: false,
};
