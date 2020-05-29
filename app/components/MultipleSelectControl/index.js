import React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  Input,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  MenuItem,
} from '@material-ui/core';
import { ErrorMessage } from 'formik';
import styles from '../StyleCommon/styles';

const MAX_HEIGHT = 300;

class MultipleSelectControl extends React.Component {
  state = {
    labelWidth: 100,
  };

  /**
   * Handle Value Change
   * @param event
   */
  onChange = event => {
    const {
      field: { name },
      options,
      form,
      hasOptionAll,
    } = this.props;

    form.handleChange(event);
    const selectedValues = event.target.value;
    const itemAll = options[0]; // the first item in dropdown
    const newlyAddedValue = selectedValues[selectedValues.length - 1];

    if (hasOptionAll) {
      /**
       * if newly added item is "Tất cả" => only select "Tất cả"
       * if NOT "Tất cả" => uncheck item "Tất cả"
       */
      if (selectedValues.length === 0 || newlyAddedValue === itemAll.value) {
        form.setFieldValue(name, [itemAll.value]);
      } else {
        const updatedValues = selectedValues.filter(
          value => itemAll.value !== value,
        );
        form.setFieldValue(name, updatedValues);
      }
    } else {
      form.setFieldValue(name, selectedValues);
    }
  };

  /**
   * Display selected option onto the field
   * @param selectedValues
   * @returns {string}
   */
  renderValue = selectedValues => {
    const { options } = this.props;
    const selectedItems = options.filter(item =>
      selectedValues.includes(item.value),
    );

    return selectedItems.length
      ? selectedItems.map(item => item.label).join(', ')
      : '';
  };

  /**
   * Render select box options
   * @returns {*}
   */
  renderChildren = () => {
    const {
      field: { name },
      options,
      form,
    } = this.props;

    return options.map(item => (
      <MenuItem key={item.value} value={item.value}>
        <Checkbox checked={form.values[name].includes(item.value)} />
        <ListItemText primary={item.label} />
      </MenuItem>
    ));
  };

  render() {
    const {
      field: { name, value },
      form,
      label,
      classes,
      required,
      outlined,
      disabled,
      popOverStyles,
      menuListStyles,
      style,
      ...props
    } = this.props;
    const currentError = form.errors[name];

    return (
      <FormControl
        margin="normal"
        fullWidth
        error={currentError !== undefined}
        required={required}
        className={props.className}
        variant={outlined ? 'outlined' : 'standard'}
        disabled={disabled}
        style={{ ...style, ...{ marginTop: 0 } }}
      >
        {outlined ? (
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-age-simple"
          >
            {label}
          </InputLabel>
        ) : (
          <InputLabel htmlFor={name}>{label}</InputLabel>
        )}
        <Select
          value={value === undefined || value === null ? '' : value}
          input={
            outlined ? (
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name={name}
                id="outlined-age-simple"
                autoFocus={props.autoFocus}
              />
            ) : (
              <Input name={name} id={name} autoFocus={props.autoFocus} />
            )
          }
          disabled={props.disabled}
          multiple
          onChange={this.onChange}
          renderValue={this.renderValue}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: MAX_HEIGHT,
                ...popOverStyles,
              },
            },
            MenuListProps: {
              style: {
                ...menuListStyles,
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
          }}
        >
          {props.children || this.renderChildren()}
        </Select>
        <ErrorMessage name={name}>
          {msg => <div className={classes.errorMessage}>{msg}</div>}
        </ErrorMessage>
      </FormControl>
    );
  }
}

MultipleSelectControl.propTypes = {
  background: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.any,
  popOverStyles: PropTypes.object,
  menuListStyles: PropTypes.object,
  autoFocus: PropTypes.bool, // focus on first mount
  options: PropTypes.array.isRequired, // selectBox's options
  hasOptionAll: PropTypes.bool, // true => có option tất cả trong danh sách (mặc định là option đầu tiên)
};

MultipleSelectControl.defaultProps = {
  required: false,
  outlined: false,
  autoFocus: false,
  popOverStyles: {},
  menuListStyles: {},
  hasOptionAll: true,
};

export default withStyles(styles)(MultipleSelectControl);
