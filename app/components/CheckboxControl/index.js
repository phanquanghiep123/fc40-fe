import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import styles from 'components/StyleCommon/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { ErrorMessage } from 'formik';
import classNames from 'classnames';
class CheckboxControl extends React.Component {
  componentDidMount() {}

  render() {
    const {
      field: { name, value },
      form,
      label,
      classes,
      required,
      disabled,
      handleCheckbox,
      labelPlacement,
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
        disabled={disabled}
      >
        <FormControlLabel
          value={label}
          className={classNames(
            labelPlacement === 'start' ? classes.checkboxLabel : '',
          )}
          labelPlacement={labelPlacement}
          control={
            <Checkbox
              // eslint-disable-next-line eqeqeq
              checked={value == true}
              color="primary"
              onChange={event => {
                form.setFieldValue(name, event.target.checked);
                handleCheckbox(event);
              }}
            />
          }
          label={label}
        />
        <ErrorMessage name={name}>
          {msg => <div className={classes.errorMessage}>{msg}</div>}
        </ErrorMessage>
      </FormControl>
    );
  }
}
CheckboxControl.propTypes = {
  background: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  field: PropTypes.object,
  form: PropTypes.object,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  handleCheckbox: PropTypes.func,
  /**
   * @options of selection
   *
   * text:value
   */
  children: PropTypes.node,
  labelPlacement: PropTypes.string,
};

CheckboxControl.defaultProps = {
  required: false,
  labelPlacement: 'start',
  handleCheckbox: () => {},
};

export default withStyles(styles)(CheckboxControl);
