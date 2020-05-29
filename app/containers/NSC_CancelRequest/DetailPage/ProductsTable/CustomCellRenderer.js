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

export default function CustomCellRenderer({
  value,
  error,
  touched,
  ...props
}) {
  const isError = touched && error;
  const nextValue = props.formatValue(value);

  if (isError) {
    return (
      <Tooltip title={error}>
        <div style={styles.errorDivider}>{nextValue}</div>
      </Tooltip>
    );
  }

  return <span title={nextValue}>{nextValue}</span>;
}

CustomCellRenderer.propTypes = {
  value: PropTypes.any,
  // Formik
  error: PropTypes.string,
  touched: PropTypes.any,
  // Ag-Gird
  formatValue: PropTypes.func,
};

CustomCellRenderer.defaultProps = {
  value: '',
};
