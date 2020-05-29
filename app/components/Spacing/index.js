import React from 'react';
import PropTypes from 'prop-types';

const Spacing = ({ width, height, inline, ...props }) => (
  <div
    {...props}
    style={{ width, height, display: inline ? 'inline-block' : 'block' }}
  />
);

Spacing.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inline: PropTypes.bool,
};

Spacing.defaultProps = {
  width: 0,
  height: 0,
  inline: false,
};

export default Spacing;
