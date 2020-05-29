/*
* Ag grid select with local options
* */

import React from 'react';
import PropTypes from 'prop-types';
import MuiSelectInput from './Input';

export const styles = {
  container: {
    width: 200,
  },
  textField: {
    paddingLeft: 10,
    paddingRight: 10,
  },
};

export default class MuiSelectInputEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);

    this.selectRef = null;
    this.isEditing = true;
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.selectRef && this.selectRef.focus) {
        this.selectRef.focus();
      }
    });
  }

  getInitialState(props) {
    return {
      value: props.formatValue(props.value),
    };
  }

  isPopup() {
    return true;
  }

  getValue() {
    if (this.state.value) {
      return this.props.parseValue(this.state.value);
    }
    return this.props.parseValue('');
  }

  onBlur = () => {
    if (this.isEditing) {
      setTimeout(() => {
        this.props.stopEditing(false);
      });
    }
  };

  onChange = (option, action) => {
    this.isEditing = false;

    if (this.props.validBeforeChange) {
      if (this.props.validBeforeChange(option, action)) {
        this.onChangeValue(option, action);
      } else {
        setTimeout(() => {
          this.props.stopEditing(false);
        });
      }
    } else {
      this.onChangeValue(option, action);
    }
  };

  onChangeValue = (option, action) => {
    const nextValue = option ? option[this.props.valueKey] : null;
    this.setState({ value: nextValue }, () => {
      // setTimeout(() => {
      this.props.stopEditing();
      if (this.props.onChange) {
        this.props.onChange(option, action);
      }
      // });
    });
  };

  render() {
    const {
      SelectProps,
      options,
      valueKey,
      labelKey,
      sublabelKey,
      menuIsOpen,
      isClearable,
      isMultiline,
      isSearchable,
      onInputChange,
    } = this.props;
    const { value } = this.state;

    const selectStyles = {
      menuPortal: base => ({
        ...base,
        left: 'auto',
        width: 200,
      }),
      ...this.props.styles,
    };

    const TextFieldProps = {
      style: styles.textField,
    };

    return (
      <div style={styles.container}>
        <MuiSelectInput
          onRef={ref => {
            this.selectRef = ref;
          }}
          styles={selectStyles}
          value={value}
          options={options}
          valueKey={valueKey}
          labelKey={labelKey}
          sublabelKey={sublabelKey}
          menuIsOpen={menuIsOpen}
          isMultiline={isMultiline}
          isClearable={isClearable}
          isSearchable={isSearchable}
          maxMenuHeight={150}
          TextFieldProps={TextFieldProps}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onInputChange={onInputChange}
          {...SelectProps}
        />
      </div>
    );
  }
}

MuiSelectInputEditor.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  sublabelKey: PropTypes.string,
  menuIsOpen: PropTypes.bool,
  isClearable: PropTypes.bool,
  isMultiline: PropTypes.bool,
  isSearchable: PropTypes.bool,
  parseValue: PropTypes.func,
  formatValue: PropTypes.func,
  stopEditing: PropTypes.func,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  validBeforeChange: PropTypes.func,
};

MuiSelectInputEditor.defaultProps = {
  options: [],
  valueKey: 'value',
  labelKey: 'label',
  sublabelKey: 'value',
  menuIsOpen: true,
  isClearable: false,
  isMultiline: true,
  isSearchable: false,
  // isPopup: false,
};
