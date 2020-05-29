import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';
import TextField from '@material-ui/core/TextField';
import AsyncSelectField from 'components/AsyncSelect';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';

import styles from '../StyleCommon/styles';

class InputControl extends React.PureComponent {
  state = {};

  render() {
    const {
      field,
      form,
      label,
      classes,
      required,
      disabled,
      autoComplete,
      theme,
      outlined,
      style,
      placeholder = '',
      promiseOptions,
      onInputChange,
      multiline,
      onBlur,
      type = 'text',
      InputLabelProps,
      rows,
      ...props
    } = this.props;
    const { name, value } = field;
    // const currentError = form.errors[field.name];

    const Outlined = !outlined ? (
      <React.Fragment>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Input
          style={{ ...style }}
          id={name}
          name={name}
          {...props}
          value={value || ''}
          multiline={multiline}
          rows={rows}
          type={type}
          placeholder={placeholder}
        />
      </React.Fragment>
    ) : (
      <TextField
        id={name}
        value={value || ''}
        label={label}
        disabled={disabled}
        InputLabelProps={InputLabelProps}
        variant="outlined"
      />
    );

    return (
      <FormControl
        style={{ ...style, ...{ marginTop: 0 } }}
        margin="normal"
        fullWidth
        required={required}
        // error={currentError !== undefined}
        className={props.className}
        disabled={disabled}
      >
        {autoComplete ? (
          <AsyncSelectField
            classes={classes}
            onInputChange={onInputChange}
            form={form}
            theme={theme}
            field={field}
            placeholder={placeholder}
            disabled={disabled}
            promiseOptions={promiseOptions}
            onBlur={onBlur}
            {...props}
          />
        ) : (
          Outlined
        )}

        <ErrorMessage name={name}>
          {msg => <div className={classes.errorMessage}>{msg}</div>}
        </ErrorMessage>
      </FormControl>
    );
  }
}

InputControl.propTypes = {
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  InputLabelProps: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.bool,
  options: PropTypes.array,
  onInputChange: PropTypes.func,
  outlined: PropTypes.bool,
  onBlur: PropTypes.func,
  rows: PropTypes.number,
};

InputControl.defaultProps = {
  InputLabelProps: { shrink: true },
  required: false,
  disabled: false,
  autoComplete: false,
  outlined: false,
  rows: 4,
};

export default withStyles(styles, { withTheme: true })(InputControl);
