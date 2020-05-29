import React from 'react';
import PropTypes from 'prop-types';

import MuiInput from 'components/MuiInput';

import NumberFormatter from 'components/NumberFormatter';
import { validDecimal, validInteger } from 'components/NumberFormatter/utils';

export default class Input extends React.Component {
  state = {
    value: this.props.value,
  };

  isAllowed = value => {
    const validateNumber = this.props.isInteger ? validInteger : validDecimal;

    if (validateNumber(value)) {
      if (value.floatValue > this.props.maxNumber) {
        return false;
      }
      return true;
    }
    return false;
  };

  onBlur = () => {
    this.props.onChangeValue(this.state.value);
  };

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { isInteger, maxNumber, onChangeValue, ...props } = this.props;

    return (
      <MuiInput
        {...props}
        value={this.state.value}
        InputProps={{
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: this.isAllowed,
          },
          ...props.InputProps,
        }}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}

Input.propTypes = {
  value: PropTypes.any,
  isInteger: PropTypes.bool,
  maxNumber: PropTypes.number,
  onChangeValue: PropTypes.func,
};

Input.defaultProps = {
  isInteger: false,
  maxNumber: Infinity,
};
