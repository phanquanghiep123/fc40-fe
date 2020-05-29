import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { ErrorMessage } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import styles from '../StyleCommon/styles';

const MAX_HEIGHT = 300;

class SelectControl extends React.Component {
  state = {
    labelWidth: 100,
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
          onChange={props.onChange}
          disabled={props.disabled}
          multiple={props.multiple}
          renderValue={props.renderValue}
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
          {props.children}
        </Select>
        <ErrorMessage name={name}>
          {msg => <div className={classes.errorMessage}>{msg}</div>}
        </ErrorMessage>
      </FormControl>
    );
  }
}

SelectControl.propTypes = {
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
  /**
   * @options of selection
   *
   * text:value
   */
  children: PropTypes.node,
  autoFocus: PropTypes.bool, // focus on first mount
  style: PropTypes.any,
  multiple: PropTypes.bool, // multiple select
  renderValue: PropTypes.func, // customize the rendered value
  popOverStyles: PropTypes.object,
  menuListStyles: PropTypes.object,
};

SelectControl.defaultProps = {
  required: false,
  outlined: false,
  autoFocus: false,
  popOverStyles: {},
  menuListStyles: {},
};

export default withStyles(styles)(SelectControl);
