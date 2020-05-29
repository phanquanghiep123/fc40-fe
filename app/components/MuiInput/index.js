import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

export const MAX_MENU_HEIGHT = 300;

export default class MuiInput extends React.Component {
  getProps({ showError, autoTouched, onInputChange, ...props }) {
    let nextValue = this.getValue(props.value);
    let nextProps = {
      ...props,
      value: nextValue,
    };

    if (props.form && props.field) {
      nextValue = this.getValue(props.field.value);
      nextProps = {
        ...props,
        field: {
          ...props.field,
          value: nextValue,
          onChange: onInputChange || props.field.onChange,
        },
      };

      if (showError) {
        const fieldError = getIn(props.form.errors, props.field.name);
        const fieldTouched = getIn(props.form.touched, props.field.name);

        const error = fieldError && (autoTouched || fieldTouched);

        nextProps = {
          ...nextProps,
          error,
          helperText: error ? fieldError : props.helperText,
        };
      }

      nextProps = {
        ...nextProps,
        ...nextProps.field,
      };
    }

    return nextProps;
  }

  getValue(value) {
    if (value === null || value === undefined) {
      return '';
    }
    return value;
  }

  getOption(options, value, valueKey) {
    const nextValue = options.find(
      option => option && option[valueKey] === value,
    );
    return nextValue || null;
  }

  getOptions(options, valueKey, labelKey) {
    const results = [];

    if (options && options.length > 0) {
      for (let i = 0, len = options.length; i < len; i += 1) {
        const value = options[i];

        if (typeof value === 'string') {
          const option = {
            [valueKey]: value,
            [labelKey]: value,
          };

          results.push(option);
        } else {
          results.push(value);
        }
      }
    }

    return results;
  }

  render() {
    const {
      valueKey,
      labelKey,
      getOptionLabel = option => option[labelKey],
      ...props
    } = this.props;
    const nextProps = this.getProps(props);

    if (nextProps.select && nextProps.options) {
      return (
        <TextField
          fullWidth
          {...nextProps}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: MAX_MENU_HEIGHT,
                },
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            },
            displayEmpty: true,
            ...nextProps.SelectProps,
          }}
        >
          {this.getOptions(nextProps.options, valueKey, labelKey).map(
            option => (
              <MenuItem key={option[valueKey]} value={option[valueKey]}>
                {getOptionLabel(option)}
              </MenuItem>
            ),
          )}
        </TextField>
      );
    }
    return <TextField fullWidth {...nextProps} />;
  }
}

MuiInput.propTypes = {
  margin: PropTypes.string,
  options: PropTypes.array,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  showError: PropTypes.bool,
  autoTouched: PropTypes.bool,
  getOptionLabel: PropTypes.func,
};

MuiInput.defaultProps = {
  margin: 'dense',
  valueKey: 'value',
  labelKey: 'label',
  showError: true,
  autoTouched: false,
};
