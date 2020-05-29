import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const InputControl = ({ field, form, label, classes, required, ...props }) => {
  const { name } = field;
  const currentError = form.errors[field.name];

  return (
    <FormControl
      margin="normal"
      fullWidth
      required={required}
      error={currentError !== undefined}
      className={props.className}
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input id={name} name={name} {...props} />
      <ErrorMessage name={name}>
        {msg => <div className={classes.errorMessage}>{msg}</div>}
      </ErrorMessage>
    </FormControl>
  );
};

InputControl.propTypes = {
  /**
   * Giá trị: "Tên đăng nhập"
   */
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  required: PropTypes.bool,
};

InputControl.defaultProps = {
  required: false,
};

export default InputControl;
