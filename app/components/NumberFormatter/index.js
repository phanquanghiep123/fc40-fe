import React from 'react';
import PropTypes from 'prop-types';

import NumberFormat from 'react-number-format';

import { validNumber } from './utils';

export default function NumberFormatter({
  inputRef,
  onChange,
  isAllowed,
  ...props
}) {
  const nextProps =
    typeof isAllowed === 'function' ? { ...props, isAllowed } : props;

  return (
    <NumberFormat
      {...nextProps}
      thousandSeparator
      getInputRef={inputRef}
      onValueChange={values =>
        onChange({
          target: {
            name: props.name,
            value: values.value !== '' ? values.floatValue : '',
          },
        })
      }
    />
  );
}

NumberFormatter.propTypes = {
  onChange: PropTypes.func,
  isAllowed: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
};

NumberFormatter.defaultProps = {
  isAllowed: validNumber,
};
