import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { compose } from 'redux';
import InputControl from 'components/InputControl';
import { makeSelectLoading, makeSelectStatus } from 'containers/App/selectors';
import {
  withStyles,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Field, Form, Formik } from 'formik';
import CssBaseline from '@material-ui/core/CssBaseline';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import resetPasswordSchema from './resetPasswordSchema';
import { submit } from './actions';
import saga from './saga';
import reducer from './reducer';
import { makeSelectResetSuccess } from './selectors';

import styles from './styles';
const logo = require('../../images/logo-login.png');

class ResetPassword extends React.Component {
  componentDidMount() {}

  render() {
    const {
      classes,
      location,
      onSubmit,
      status,
      loading,
      resetSuccess,
    } = this.props;
    const params = new Map(
      location.search
        .slice(1)
        .split('&')
        .map(kv => kv.split('=')),
    );
    const invalidURL =
      !params.get('username') || !params.get('token') || !params.get('userId');
    const renderForm = !resetSuccess && !invalidURL;
    return (
      <main className={classes.main}>
        <Helmet>
          <title>Đặt lại Mật Khẩu</title>
        </Helmet>
        <CssBaseline />
        <Grid container className={classes.fullHeight}>
          <Grid item lg={6}>
            <Grid
              container
              className={classes.fullHeight}
              justify="space-between"
            >
              <Grid item lg={12}>
                <div className={classes.paper}>
                  <img alt="logo" src={logo} className={classes.logo} />
                  <Typography variant="h4">Đặt Lại Mật Khẩu</Typography>
                  {renderForm && (
                    <Formik
                      initialValues={{
                        newPassword: '',
                        retypePassword: '',
                        userId: `${params.get('userId')}`,
                        token: `${params.get('token')}`,
                      }}
                      validationSchema={resetPasswordSchema}
                      onSubmit={values => onSubmit(values)}
                    >
                      {props => (
                        <Form className={classes.form}>
                          <span>
                            Tài khoản: <b>{params.get('username')}</b>
                          </span>
                          <Field
                            name="newPassword"
                            label="Mật khẩu mới"
                            type="password"
                            className={classes.spaceControl}
                            component={InputControl}
                            onChange={props.handleChange}
                          />
                          <Field
                            name="retypePassword"
                            label="Nhập lại mật khẩu mới"
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
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={props.handleSubmit}
                                disabled={loading}
                              >
                                Đặt Lại Mật Khẩu
                              </Button>
                              {loading && (
                                <CircularProgress
                                  size={24}
                                  className={classes.buttonProgress}
                                />
                              )}
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                  <div className={classes.infoSection}>
                    {resetSuccess && (
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        color="default"
                        align="center"
                      >
                        {`Đặt lại mật khẩu cho tài khoản ${params.get(
                          'username',
                        )} thành công`}
                      </Typography>
                    )}
                    {invalidURL && (
                      <Typography
                        color="error"
                        variant="subtitle2"
                        align="center"
                        gutterBottom
                      >
                        Đường dẫn không đúng, vui lòng kiểm tra lại !
                      </Typography>
                    )}
                  </div>
                  {(resetSuccess || invalidURL) && (
                    <a href="/dang-nhap" className={classes.link}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Quay Về Trang Đăng Nhập
                      </Button>
                    </a>
                  )}
                </div>
              </Grid>
              <Grid item lg={12}>
                <Typography
                  variant="caption"
                  align="center"
                  className={classes.submitGroup}
                >
                  FC4.0 &#169; 2019 VinEco. Đã đăng ký bản quyền.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </main>
    );
  }
}
ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object,
  onSubmit: PropTypes.func,
  status: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  loading: PropTypes.bool,
  resetSuccess: PropTypes.bool,
};
export function mapDispatchToProps(dispath) {
  return { onSubmit: form => dispath(submit(form)) };
}
const mapStateToProps = createStructuredSelector({
  status: makeSelectStatus(),
  loading: makeSelectLoading(),
  resetSuccess: makeSelectResetSuccess(),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const withReducer = injectReducer({ key: 'ResetPassword', reducer });
const withSaga = injectSaga({ key: 'ResetPassword', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(withStyles(styles)(withImmutablePropsToJS(ResetPassword)));
