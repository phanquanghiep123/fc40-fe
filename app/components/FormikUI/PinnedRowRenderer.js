import React from 'react';

import PropTypes from 'prop-types';
export default function PinnedRowRenderer(props) {
  return (
    <b>
      {props.valueFormatter && props.valueFormatter({ value: props.value })}
      {!props.valueFormatter && props.value}
    </b>
  );
}

PinnedRowRenderer.propTypes = {
  value: PropTypes.any,
  valueFormatter: PropTypes.func,
};
