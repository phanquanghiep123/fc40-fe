import React from 'react';
import PropTypes from 'prop-types';

import { getIn } from 'formik';

import Grid from '@material-ui/core/Grid';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import MuiInput from './index';

export default function MuiInputPeriod({
  from,
  to,
  type,
  label,
  required,
  separator,
  helperText,
  InputProps,
  InputLabelProps,
  FormControlProps,
  FormHelperTextProps,
  ...props
}) {
  let showError = false;
  let fieldError = '';

  if (props.form && props.field) {
    const { name } = props.field;
    const { errors } = props.form;

    fieldError = getIn(errors, name);
    showError = !!fieldError;
  }

  return (
    <FormControl
      error={showError}
      margin="dense"
      fullWidth
      required={required}
      {...FormControlProps}
    >
      {label && <InputLabel {...InputLabelProps}>{label}</InputLabel>}
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{ marginTop: 8 }}
      >
        <Grid item style={{ width: '45%' }}>
          <MuiInput
            name={from.name}
            type={type}
            value={from.value}
            placeholder={from.placeholder}
            InputProps={InputProps}
            onChange={event => {
              const inputValue = event.target.value;
              if (props.form && from.name) {
                props.form.setFieldValue(from.name, inputValue, true);
              }
              if (from.onChange) {
                from.onChange(inputValue);
              }
            }}
          />
        </Grid>
        <Grid item>{separator}</Grid>
        <Grid item style={{ width: '45%' }}>
          <MuiInput
            name={to.name}
            type={type}
            value={to.value}
            placeholder={to.placeholder}
            InputProps={InputProps}
            onChange={event => {
              const inputValue = event.target.value;
              if (props.form && to.name) {
                props.form.setFieldValue(to.name, inputValue, true);
              }
              if (to.onChange) {
                to.onChange(inputValue);
              }
            }}
          />
        </Grid>
      </Grid>
      {(showError || helperText) && (
        <FormHelperText {...FormHelperTextProps}>
          {showError ? fieldError : helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

MuiInputPeriod.propTypes = {
  from: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
  }),
  to: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
  }),
  type: PropTypes.string,
  required: PropTypes.bool,
  separator: PropTypes.string,
  helperText: PropTypes.string,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  FormControlProps: PropTypes.object,
  FormHelperTextProps: PropTypes.object,
};

MuiInputPeriod.defaultProps = {
  separator: '~',
};
