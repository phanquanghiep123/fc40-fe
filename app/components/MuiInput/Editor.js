import React from 'react';
import PropTypes from 'prop-types';

import { EVENT_KEY_CODE } from 'utils/constants';

import MuiInput from './index';

export const styles = {
  input: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  select: {
    minWidth: 150,
  },
};

/* eslint-disable react/jsx-no-duplicate-props */
export default class MuiInputEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);
    this.inputRef = null;
  }

  afterGuiAttached() {
    this.inputRef.focus();
    if (this.state.value === 0) this.inputRef.select();
  }

  getInitialState(props) {
    let startValue;

    if (
      props.keyPress === EVENT_KEY_CODE.BACKSPACE ||
      props.keyPress === EVENT_KEY_CODE.DELETE
    ) {
      startValue = '';
    } else if (props.charPress) {
      startValue = props.charPress;
    } else {
      startValue = props.value;
    }

    return {
      value: this.getValueState(startValue, props.type),
    };
  }

  isPopup() {
    return true;
  }

  getValue() {
    if (this.state.value || this.state.value === 0) {
      return this.props.parseValue(this.state.value);
    }
    return this.props.parseValue('');
  }

  getValueState(value, type) {
    if (value === null || value === undefined) {
      return this.getValueFormatted('', type);
    }
    return this.getValueFormatted(value, type);
  }

  getValueFormatted(value, type) {
    const nextValue = this.props.formatValue(value);

    if (type === 'number') {
      if (Number.isNaN(nextValue * 1)) {
        return value;
      }
    }
    return nextValue;
  }

  getOption(options, value, valueKey) {
    const nextValue = options.find(
      option => option && option[valueKey] === value,
    );
    return nextValue || null;
  }

  onChange = event => {
    const { value } = event.target;
    const { select, options, valueKey } = this.props;

    this.setState({ value }, () => {
      if (this.props.validBeforeChange) {
        this.props.validBeforeChange(value);
      }
      if (this.props.onChange) {
        if (select && options) {
          this.props.onChange(this.getOption(options, value, valueKey));
        } else {
          this.props.onChange(event);
        }
      }
    });
  };

  render() {
    const { value } = this.state;
    const {
      type,
      select,
      options,
      valueKey,
      labelKey,
      inputProps,
      InputProps,
      InputLabelProps,
    } = this.props;

    return (
      <MuiInput
        inputRef={ref => {
          this.inputRef = ref;
        }}
        style={styles.input}
        type={type}
        value={value}
        margin="dense"
        select={select}
        options={options}
        valueKey={valueKey}
        labelKey={labelKey}
        inputProps={inputProps}
        InputProps={InputProps}
        SelectProps={{
          style: styles.select,
        }}
        InputLabelProps={InputLabelProps}
        onChange={this.onChange}
      />
    );
  }
}

MuiInputEditor.propTypes = {
  type: PropTypes.string,
  select: PropTypes.bool,
  options: PropTypes.array,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  parseValue: PropTypes.func,
  formatValue: PropTypes.func,
  inputProps: PropTypes.object,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  onChange: PropTypes.func,
  validBeforeChange: PropTypes.func,
};

MuiInputEditor.defaultProps = {
  type: 'text',
  select: false,
  options: [],
  valueKey: 'value',
  labelKey: 'label',
};
