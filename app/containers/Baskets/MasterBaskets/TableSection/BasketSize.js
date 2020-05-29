import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import NumberFormatter from 'components/NumberFormatter';
import { ErrorMessage } from 'formik';

const style = () => ({
  filedBasket: {
    marginBottom: 10,
    marginTop: 20,
  },
  errorMessage: {
    color: 'red',
    fontSize: '0.75rem',
  },
});

class BasketSize extends React.PureComponent {
  render() {
    const { classes, label, disabled, required, field, ...props } = this.props;
    return (
      <FormControl>
        <InputLabel htmlFor={field.name}>{label}</InputLabel>
        <Input
          inputComponent={NumberFormatter}
          required={required}
          id={field.name}
          name={field.name}
          className={classes.filedBasket}
          disabled={disabled}
          {...props}
        />
        <ErrorMessage name={field.name}>
          {msg => <div className={classes.errorMessage}>{msg}</div>}
        </ErrorMessage>
      </FormControl>
    );
  }
}

BasketSize.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  field: PropTypes.object,
};
export default withStyles(style(), { withTheme: true })(BasketSize);
