import React from 'react';
import { DatePicker } from 'material-ui-pickers';
import * as PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';

class MonthYearPicker extends React.Component {
  handleChange = (name, date, callback) => {
    this.props.form.setFieldValue(name, date, true);

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
          // showTodayButton
          helperText={currentError}
          error={Boolean(currentError)}
          format="MM/yyyy"
          okLabel="Chọn"
          cancelLabel="Đóng"
          todayLabel="Hôm Nay"
          clearable={clearable}
          invalidDateMessage="Định dạng không hợp lệ"
          clearLabel="Xóa"
          openTo="month"
          views={['year', 'month']}
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
MonthYearPicker.propTypes = {
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  required: PropTypes.bool,
  clearable: PropTypes.bool,
  onChangeDatePicker: PropTypes.func,
};

MonthYearPicker.defaultProps = {
  required: false,
  clearable: true,
};

export default MonthYearPicker;
