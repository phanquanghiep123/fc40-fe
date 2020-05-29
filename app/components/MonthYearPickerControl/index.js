import React from 'react';
import { DatePicker } from 'material-ui-pickers';
import * as PropTypes from 'prop-types';

import {
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormControl,
  FormHelperText,
  MuiThemeProvider,
  createMuiTheme,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import CalendarToday from '@material-ui/icons/CalendarToday';
import appTheme from '../../containers/App/theme';
const datePickerTheme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiButtonBase: {
      root: {
        padding: '.25rem !important',
      },
    },
  },
});

const pickerPropsDefault = {
  clearable: true,
  clearLabel: 'Xóa',
  autoOk: true,
  okLabel: 'Chọn',
  // showTodayButton: true,
  todayLabel: 'Hôm Nay',
  cancelLabel: 'Đóng',
};

class MonthYearPickerControl extends React.Component {
  setDate = (name, value) => {
    const { form } = this.props;
    form.setFieldValue(name, value, true);
  };

  render() {
    const {
      field,
      form,
      from,
      to,
      label,
      required,
      style,
      labelStyle,
      datePickerProps,
      ...props
    } = this.props;
    const currentError = form.errors[field.name];

    return (
      <FormControl
        margin="normal"
        style={{ ...{ marginTop: 0 }, ...style }}
        fullWidth
        error={Boolean(currentError)}
        required={required}
      >
        <FormLabel
          style={{
            ...{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              position: 'absolute',
              top: 0,
              left: 0,
            },
            ...labelStyle,
          }}
        >
          {label}
        </FormLabel>
        <FormGroup
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 16,
          }}
        >
          <MuiThemeProvider theme={datePickerTheme}>
            <FormControlLabel
              style={{ width: '46%', margin: 0 }}
              control={
                <DatePicker
                  {...pickerPropsDefault}
                  {...datePickerProps}
                  value={from.value}
                  error={Boolean(currentError)}
                  format="MM/yyyy"
                  onChange={dateValue => {
                    if (dateValue === null) {
                      form.setFieldValue(from.name, null, true);
                    } else {
                      this.setDate(from.name, dateValue);
                    }
                  }}
                  onError={(_, error) => form.setFieldError(from.name, error)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <CalendarToday />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  openTo="month"
                  views={['year', 'month']}
                  {...props}
                />
              }
            />
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <span>~</span>
            </span>
            <FormControlLabel
              style={{ width: '46%', margin: 0 }}
              control={
                <DatePicker
                  {...pickerPropsDefault}
                  {...datePickerProps}
                  value={to.value}
                  error={Boolean(currentError)}
                  format="MM/yyyy"
                  onChange={dateValue => {
                    if (dateValue === null) {
                      form.setFieldValue(to.name, null, true);
                    } else {
                      this.setDate(to.name, dateValue);
                    }
                  }}
                  onError={(_, error) => form.setFieldError(to.name, error)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <CalendarToday />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  openTo="month"
                  views={['year', 'month']}
                />
              }
            />
          </MuiThemeProvider>
        </FormGroup>
        {currentError && <FormHelperText>{currentError}</FormHelperText>}
      </FormControl>
    );
  }
}
MonthYearPickerControl.propTypes = {
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  from: PropTypes.object,
  to: PropTypes.object,
  required: PropTypes.bool,
  datePickerProps: PropTypes.object,
};

MonthYearPickerControl.defaultProps = {
  required: false,
};

export default MonthYearPickerControl;
