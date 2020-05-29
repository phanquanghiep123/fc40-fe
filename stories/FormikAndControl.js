import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

import InputControl from '../app/components/InputControl';
import SelectControl from '../app/components/SelectControl';
import PickersControl from '../app/components/PickersControl';

const SigninSchema = Yup.object().shape({
  username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
  selectField: Yup.string().required('Trường không được bỏ trống'),
  date: Yup.string().required('Trường không được bỏ trống'),
});

const styleFormikAndControl = theme => ({
  form: {
    width: '20%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit * 5,
  },
  submit: {
    marginTop: theme.spacing.unit,
  },
});
class FormikAndControl extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <Formik
        initialValues={{
          username: '',
          selectField: '',
          date: '',
        }}
        validationSchema={SigninSchema}
        onSubmit={values => {
          // same shape as initial values
          alert(JSON.stringify(values));
        }}
      >
        {prs => (
          <Form className={classes.form}>
            <Field
              name="username"
              label="Tên đăng nhập"
              component={InputControl}
              onChange={prs.handleChange}
            />
            <Field name="date" component={PickersControl} label="Chọn date" />
            {/* <input value="Chọn date" name="date" component={PickersControl} /> */}
            <Field
              name="selectField"
              label="Chọn field"
              component={SelectControl}
              onChange={prs.handleChange}
            >
              <MenuItem value="">Chọn m</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Field>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={prs.handleSubmit}
            >
              Đăng nhập
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}
FormikAndControl.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleFormikAndControl)(FormikAndControl);
