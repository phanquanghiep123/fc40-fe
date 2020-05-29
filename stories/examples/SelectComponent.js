import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { ErrorMessage } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const SelectControl = ({ field, form, label, classes, required, ...props }) => {
  const { name, value } = field;
  const currentError = form.errors[field.name];

  return (
    <FormControl margin="normal" fullWidth error={currentError !== undefined}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        value={value}
        input={<Input name={name} id={name} />}
        onChange={props.onChange}
      >
        {props.children}
      </Select>
      <ErrorMessage name={name}>
        {msg => <div className={classes.errorMessage}>{msg}</div>}
      </ErrorMessage>
    </FormControl>
  );
};

SelectControl.propTypes = {
  classes: PropTypes.object.isRequired,
  /**
   * Giá trị: "Chọn feild"
   */
  label: PropTypes.string,
  /**
   * field là mảng chứa name, value được set vào mục "Chọn feild" khi gọi onChange
   */
  field: PropTypes.object,
  form: PropTypes.object,
  required: PropTypes.bool,
  /**
   * Xử lý sự kiện hiển thị 1 item khi chọn item đó
   */
  onChange: PropTypes.func,
  /**
   * @options of selection
   *
   * text:value
   */
  children: PropTypes.node,
};
// SelectControl.def
export default SelectControl;
