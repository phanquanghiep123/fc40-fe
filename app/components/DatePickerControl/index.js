import React from 'react';
import { DatePicker } from 'material-ui-pickers';
import * as PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import { addHours, addMinutes } from 'date-fns';

class DatePickerControl extends React.Component {
  handleChange = (name, date, callback) => {
    const dateSelect = addMinutes(
      addHours(
        new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        new Date().getHours(),
      ),
      new Date().getMinutes(),
    );
    this.props.form.setFieldValue(name, dateSelect, true);

    if (callback) {
      callback(date);
    }
  };

  render() {
    const {
      field,
      form,
      style,
      onChangeDatePicker,
      clearable,
      ...props
    } = this.props;
    const currentError = form.errors[field.name];

    return (
      <FormControl
        margin="normal"
        style={{ ...style, ...{ marginTop: 0 } }}
        fullWidth
      >
        <DatePicker
          {...field}
          autoOk
          showTodayButton
          helperText={currentError}
          error={Boolean(currentError)}
          format="dd/MM/yyyy"
          okLabel="Chọn"
          cancelLabel="Đóng"
          todayLabel="Hôm Nay"
          clearable={clearable}
          invalidDateMessage="Định dạng không hợp lệ"
          clearLabel="Xóa"
          views={['year', 'month', 'day']}
          mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
          onChange={dateValue => {
            if (dateValue === null) {
              form.setFieldValue(field.name, null, true);
            } else {
              this.handleChange(field.name, dateValue, onChangeDatePicker);
            }
          }}
          onError={(_, error) => form.setFieldError(field.name, error)}
          {...props}
        />
      </FormControl>
    );
  }
}
DatePickerControl.propTypes = {
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  required: PropTypes.bool,
  clearable: PropTypes.bool,
  onChangeDatePicker: PropTypes.func,
};

DatePickerControl.defaultProps = {
  required: false,
  clearable: true,
};

export default DatePickerControl;
