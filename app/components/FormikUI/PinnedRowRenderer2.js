import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { getNested } from '../../containers/App/utils';

export const styles = {
  error: {
    color: 'red',
  },
  errorDivider: {
    height: '100%',
    borderBottom: '1.5px solid red',
    fontWeight: 'bold',
  },
};

function PinnedRowRenderer(props) {
  const { value, valueFormatted, colDef, rowIndex, context, style } = props;
  const { formik, pinnedTableKey } = context;

  const pinnedErrors = getNested(formik, 'errors', pinnedTableKey);
  const error = pinnedErrors
    ? getNested(pinnedErrors[rowIndex], colDef.field)
    : null;

  if (error) {
    return (
      <Tooltip title={error}>
        <div style={{ ...styles.errorDivider, ...style }}>
          {valueFormatted || value}
        </div>
      </Tooltip>
    );
  }

  return (
    <div style={{ fontWeight: 'bold', ...style }}>
      {props.valueFormatted || props.value}
    </div>
  );
}

PinnedRowRenderer.propTypes = {
  value: PropTypes.any,
  valueFormatted: PropTypes.any,
  colDef: PropTypes.object,
  rowIndex: PropTypes.number,
  context: PropTypes.object,
  style: PropTypes.object,
};

PinnedRowRenderer.defaultProps = {
  style: {},
};

export default PinnedRowRenderer;
