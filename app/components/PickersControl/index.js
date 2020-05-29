import React from 'react';
import { DatePicker, DateTimePicker } from 'material-ui-pickers';
import PropTypes from 'prop-types';
import { addHours, addMinutes } from 'date-fns';

import FormControl from '@material-ui/core/FormControl';

class DatePickerField extends React.Component {
  onChangeDatePicker = (name, date) => {
    const { controlOutside } = this.props;
    if (date === null) {
      if (!controlOutside) this.props.form.setFieldValue(name, null, true);
    } else {
      const dateSelect = addMinutes(
        addHours(
          new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          new Date().getHours(),
        ),
        new Date().getMinutes(),
      );
      if (!controlOutside) {
        this.props.form.setFieldValue(name, dateSelect, true);
        if (this.props.onChangeDatePicker) {
          this.props.onChangeDatePicker(date);
        }
      } else {
        controlOutside(date);
      }
    }
  };

  onChangeDateTimePicker = (name, date) => {
    const { controlOutside } = this.props;
    if (controlOutside) {
      this.props.controlOutside(date);
    } else {
      this.props.form.setFieldValue(name, date, true);
    }
  };

  render() {
    const {
      format,
      field: { name, value },
      label,
      required,
      isDateTimePicker = false,
      form,
      style,
      clearable = false,
      ...other
    } = this.props;
    const currentError = form.errors[name];

    const otherClone = { ...other };
    delete otherClone.onChangeDatePicker;
    delete otherClone.controlOutside;
    return (
      <FormControl
        margin="normal"
        fullWidth
        style={{ ...{ marginTop: 0 }, ...style }}
      >
        {isDateTimePicker ? (
          <DateTimePicker
            required={required}
            label={label}
            name={name}
            value={value}
            helperText={currentError}
            error={Boolean(currentError)}
            onError={(_, error) => form.setFieldError(name, error)}
            onChange={date => this.onChangeDateTimePicker(name, date)}
            format={format}
            okLabel="Chọn"
            cancelLabel="Đóng"
            todayLabel="Hôm Nay"
            clearLabel="Xóa"
            clearable={clearable}
            invalidDateMessage="Định dạng không hợp lệ"
            {...otherClone}
          />
        ) : (
          <DatePicker
            // keyboard
            required={required}
            label={label}
            // disablePast
            name={name}
            value={value}
            helperText={currentError}
            error={Boolean(currentError)}
            onError={(_, error) => form.setFieldError(name, error)}
            onChange={date => this.onChangeDatePicker(name, date)}
            format={format}
            okLabel="Chọn"
            cancelLabel="Đóng"
            todayLabel="Hôm Nay"
            clearLabel="Xóa"
            clearable={clearable}
            invalidDateMessage="Định dạng không hợp lệ"
            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
            {...otherClone}
          />
        )}
      </FormControl>
    );
  }
}

DatePickerField.propTypes = {
  /**
   * Giá trị: "Chọn date"
   */
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  style: PropTypes.object,
  required: PropTypes.bool,
  controlOutside: PropTypes.func,
  onChangeDatePicker: PropTypes.func,
  format: PropTypes.string,
};

DatePickerField.defaultProps = {
  onChangeDatePicker: () => {},
  required: false,
  format: 'dd/MM/yyyy',
};

export default DatePickerField;
