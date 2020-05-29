import React from 'react';
import TimeField from 'react-simple-timefield';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

class TimePickerField extends React.PureComponent {
  onChangeTimePicker = (name, time) => {
    const { onChangeTimePicker, form } = this.props;
    form.setFieldValue(name, time, true);
    const hours = time.split(':')[0];
    const minutes = time.split(':')[1];
    onChangeTimePicker(new Date(null, null, null, hours, minutes));
  };

  getFullHours = hour => (hour > 9 ? hour : `0${hour}`);

  getFullMinutes = minute => (minute > 9 ? minute : `0${minute}`);

  render() {
    const {
      field: { name, value },
      label,
      required,
      form,
      disabled,
      style,
    } = this.props;
    const currentError = form.errors[name];

    return (
      <FormControl
        margin="normal"
        style={{ ...style, ...{ marginTop: 0 } }}
        fullWidth
      >
        <TimeField
          input={
            <TextField
              label={label}
              required={required}
              helperText={currentError}
              error={Boolean(currentError)}
              onError={(_, error) => form.setFieldError(name, error)}
              disabled={disabled}
            />
          }
          value={value}
          onChange={time => this.onChangeTimePicker(name, time)}
        />
      </FormControl>
    );
  }
}

TimePickerField.propTypes = {
  /**
   * Giá trị: "Chọn time"
   */
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  style: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChangeTimePicker: PropTypes.func,
};

TimePickerField.defaultProps = {
  required: false,
  disabled: false,
};

export default TimePickerField;
