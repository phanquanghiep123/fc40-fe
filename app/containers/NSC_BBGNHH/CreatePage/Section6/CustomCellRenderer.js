import React from 'react';
import * as PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';

export const styles = {
  error: {
    color: 'red',
  },
  errorDivider: {
    height: '100%',
    borderBottom: '1.5px solid red',
  },
};

function CustomCellRenderer({ value, error, touched, ...props }) {
  const isError = touched && error;
  // const nextValue = props.formatValue(value);

  // CR #9150 - Hide data if transporterCode is null
  const nextValue = props.data.transporterCode
    ? props.formatValue(value)
    : null;

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
  data: PropTypes.object,
};

CustomCellRenderer.defaultProps = {
  value: '',
};

export default CustomCellRenderer;
