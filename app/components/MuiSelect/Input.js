import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

import {
  Control,
  ClearIndicator,
  DropdownIndicator,
  GroupHeading,
  IndicatorSeparator,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  MultiValue,
  ValueContainer,
} from './components';

import styles from './styles';

/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
export class MuiSelectInput extends React.Component {
  getProps({ showError, autoTouched, ...props }) {
    let nextValue = props.isMulti
      ? props.value
      : this.getValue(props.value, props.labelKey);
    let nextProps = {
      ...props,
      value: nextValue,
    };

    if (props.form && props.field) {
      if (props.isMulti) {
        nextValue = props.field.value;
      } else if (props.options && props.options.length > 0) {
        nextValue = this.getOption(
          props.options,
          props.field.value,
          props.valueKey,
        );
      } else {
        nextValue = this.getValue(props.field.value, props.labelKey);
      }

      nextProps = {
        ...props,
        name: props.field.name,
        value: nextValue,
      };

      if (showError) {
        const fieldError = getIn(props.form.errors, props.field.name);
        const fieldTouched = getIn(props.form.touched, props.field.name);

        const error = fieldError && (autoTouched || fieldTouched);

        nextProps = {
          ...nextProps,
          TextFieldProps: {
            ...props.TextFieldProps,
            error,
            helperText: error ? fieldError : props.TextFieldProps.helperText,
          },
        };
      }
    }

    return nextProps;
  }

  getValue(value, labelKey) {
    let nextValue = {};

    if (value === null || value === undefined) {
      nextValue = {
        [labelKey]: '',
      };
    } else if (typeof value !== 'object') {
      nextValue = {
        [labelKey]: value || '',
      };
    } else {
      nextValue = value;
    }

    return nextValue;
  }

  getOption(options, value, valueKey) {
    const nextValue = options.find(
      option => option && option[valueKey] === value,
    );
    return nextValue || null;
  }

  onChange = (option, { action }) => {
    if (this.props.validBeforeChange) {
      if (this.props.validBeforeChange(option, { action })) {
        this.onChangeValue(option, { action });
      }
    } else {
      this.onChangeValue(option, { action });
    }
  };

  onChangeValue = option => {
    const { field, form, isMulti, emptyValue } = this.props;

    if (form && field) {
      if (option) {
        if (isMulti) {
          form.setFieldValue(field.name, option);
        } else {
          form.setFieldValue(field.name, option[this.props.valueKey]);
        }
      } else {
        form.setFieldValue(
          field.name,
          emptyValue !== undefined ? emptyValue : option,
        );
      }
    }
  };

  render() {
    const {
      theme,
      classes,
      labelKey,
      valueKey,
      sublabelKey,
      groupLabelKey,
      isGrouped,
      isCreatable,
      isMultiline,
      ...props
    } = this.props;

    const Component = props.Component
      ? props.Component
      : isCreatable
        ? CreatableSelect
        : Select;

    const nextProps = this.getProps({
      ...props,
      labelKey,
      valueKey,
    });

    const colors = {
      primary: '#b2d4ff',
      primary25: '#deebff',
    };

    const selectStyles = {
      clearIndicator: base => ({
        ...base,
        cursor: 'pointer',
        padding: theme.spacing.unit / 2,
      }),
      dropdownIndicator: base => ({
        ...base,
        cursor: 'pointer',
        paddingTop: theme.spacing.unit / 2,
        paddingBottom: theme.spacing.unit / 2,
        paddingLeft: 0,
        paddingRight: 0,
      }),
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
          height: 'auto !important',
        },
      }),
      option: (base, state) =>
        isMultiline
          ? {
              ...base,
              backgroundColor: state.isSelected
                ? colors.primary
                : state.isFocused
                  ? colors.primary25
                  : 'transparent',
            }
          : {},
      menu: (base, state) => ({
        ...base,
        zIndex: 11,
        marginTop:
          state.menuPosition === 'fixed'
            ? theme.spacing.unit * 1.5
            : theme.spacing.unit,
        marginBottom:
          state.menuPosition === 'fixed' ? theme.spacing.unit * 3 : 0,
        borderRadius: 0,
      }),
      menuPortal: base => ({
        ...base,
        left: 'auto',
      }),
      ...props.styles,
    };

    const getOptionLabel = option => option[labelKey];
    const getOptionValue = option => option[valueKey] || '';

    const getNewOptionData = (inputValue, optionLabel) => ({
      [valueKey]: inputValue,
      [labelKey]: optionLabel,
    });
    const getOptionSublabel = option => {
      if (option) {
        if (typeof option === 'string') {
          return option;
        }
        if (typeof option === 'object' && sublabelKey in option) {
          return option[sublabelKey];
        }
      }
      return '';
    };

    const formatGroupLabel = group => group[groupLabelKey];
    const formatCreateLabel = inputValue => `Thêm mới "${inputValue}"`;

    const noOptionsMessage = () => 'Không có kết quả';

    const OptionMultiline = base => (
      <components.Option {...base}>
        <ListItemText
          primary={
            props.getOptionLabel
              ? props.getOptionLabel(base.data)
              : getOptionLabel(base.data)
          }
          secondary={
            props.getOptionSublabel
              ? props.getOptionSublabel(base.data)
              : getOptionSublabel(base.data)
          }
        />
      </components.Option>
    );

    return (
      <Component
        ref={props.onRef}
        onChange={this.onChange}
        menuPlacement="auto"
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        getNewOptionData={getNewOptionData}
        noOptionsMessage={noOptionsMessage}
        formatGroupLabel={formatGroupLabel}
        formatCreateLabel={formatCreateLabel}
        {...nextProps}
        styles={selectStyles}
        classes={{
          ...classes,
          option: isGrouped ? classes.groupOption : classes.option,
        }}
        components={{
          Control,
          ClearIndicator,
          DropdownIndicator,
          GroupHeading,
          IndicatorSeparator,
          NoOptionsMessage,
          Option: isMultiline ? OptionMultiline : Option,
          Placeholder,
          SingleValue,
          MultiValue,
          ValueContainer,
          ...nextProps.components,
        }}
        TextFieldProps={{
          ...nextProps.TextFieldProps,
          style: {
            ...nextProps.TextFieldProps.style,
            zIndex: props.menuShouldBlockScroll ? 2 : 0,
          },
        }}
      />
    );
  }
}

MuiSelectInput.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  Component: PropTypes.any,
  onRef: PropTypes.func,
  styles: PropTypes.object,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  sublabelKey: PropTypes.string,
  groupLabelKey: PropTypes.string,
  emptyValue: PropTypes.any,
  placeholder: PropTypes.string,
  showError: PropTypes.bool,
  autoTouched: PropTypes.bool,
  isGrouped: PropTypes.bool,
  isCreatable: PropTypes.bool,
  isMultiline: PropTypes.bool,
  isSearchable: PropTypes.bool,
  TextFieldProps: PropTypes.object,
  getOptionValue: PropTypes.func,
  getOptionLabel: PropTypes.func,
  getOptionSublabel: PropTypes.func,
  validBeforeChange: PropTypes.func,
};

MuiSelectInput.defaultProps = {
  labelKey: 'label',
  valueKey: 'value',
  sublabelKey: 'value',
  groupLabelKey: 'label',
  placeholder: '',
  showError: false,
  autoTouched: false,
  isGrouped: false,
  isCreatable: false,
  isMultiline: false,
  isSearchable: false,
  TextFieldProps: {},
};

export default withStyles(styles, { withTheme: true })(MuiSelectInput);
