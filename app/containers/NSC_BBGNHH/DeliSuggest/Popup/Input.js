import React from 'react';
import PropTypes from 'prop-types';

import MuiInput from 'components/MuiInput';

import NumberFormatter from 'components/NumberFormatter';
import { validDecimal } from 'components/NumberFormatter/utils';

export default class Input extends React.Component {
  state = {
    value: this.props.value,
  };

  onBlur = () => {
    this.props.onChangeValue(this.state.value);
  };

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { onChangeValue, ...props } = this.props;

    return (
      <MuiInput
        {...props}
        value={this.state.value}
        InputProps={{
          inputComponent: NumberFormatter,
          inputProps: {
            isAllowed: validDecimal,
          },
        }}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}

Input.propTypes = {
  value: PropTypes.any,
  onChangeValue: PropTypes.func,
};
