import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import InputControl from 'components/InputControl';
import {
  makeSelectLoading,
  makeSelectAuth,
  makeSelectStatus,
} from 'containers/App/selectors';
import injectSaga from 'utils/injectSaga';

import saga from './saga';
import styles, { logoLogin } from './styles';
import SigninSchema from './SigninSchema';
import { submitLogin } from './actions';

class SignIn extends React.PureComponent {
  render() {
    const { classes, location, onSubmit, auth, status, loading } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };

    return auth === true ? (
      <Redirect to={from} />
    ) : (
      <main className={classes.main}>
        <Helmet>
          <title>Đăng nhập</title>
        </Helmet>
        <CssBaseline />
        <Grid container>
          <Grid item lg={6}>
            <div className={classes.paper}>
              <img alt="logo" src={logoLogin} className={classes.logo} />

              <Typography variant="h4">Đăng nhập</Typography>
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  timezoneOffset: new Date().getTimezoneOffset(),
                }}
                validationSchema={SigninSchema}
                onSubmit={values => onSubmit(values)}
              >
                {props => (
                  <Form className={classes.form}>
                    <Field
                      name="username"
                      label="Tên đăng nhập"
                      component={InputControl}
                      className={classes.spaceControl}
                      onChange={props.handleChange}
                    />
                    <Field
                      name="password"
                      label="Mật khẩu"
                      type="password"
                      className={classes.spaceControl}
                      component={InputControl}
                      onChange={props.handleChange}
                    />
                    <div className={classes.submitGroup}>
                      {status && status.type === 'error' ? (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          color="error"
                          align="center"
                        >
                          {status.message}
                        </Typography>
                      ) : null}
                      <div className={classes.wrapper}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          onClick={props.handleSubmit}
                          disabled={loading}
                        >
                          Đăng nhập
                        </Button>
                        {loading && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>

                      <Typography
                        variant="caption"
                        align="center"
                        className={classes.submitGroup}
                      >
                        FC4.0 &#169; 2019 VinEco. Đã đăng ký bản quyền.
                      </Typography>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Grid>
        </Grid>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  auth: PropTypes.bool,
  status: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  loading: PropTypes.bool,
  /**
   * @props get from react-route
   */
  location: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSubmit: login => dispatch(submitLogin(login)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  auth: makeSelectAuth(),
  status: makeSelectStatus(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'login', saga });

export default compose(
  withSaga,
  withConnect,
)(withStyles(styles)(withImmutablePropsToJS(SignIn)));
