import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Grid, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import PaperPanel from 'components/PaperPanel';
import DatePickerControl from 'components/DatePickerControl';
import withStyles from '@material-ui/core/styles/withStyles';
import InputControl from 'components/InputControl';
import CheckboxControl from 'components/CheckboxControl';
import { userSchema } from './userSchema';

const style = theme => ({
  closeBtn: {
    marginRight: theme.spacing.unit * 2,
    backgroundColor: '#ffffff',
    color: theme.palette.primary.main,
    width: 145,
  },
  verifyBtn: {
    backgroundColor: '#ffffff',
    color: theme.palette.primary.main,
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2,
  },
});

class UserModal extends React.Component {
  formik = null;

  verifyUsername = prs => {
    const { verifyUsername } = this.props;
    prs.setFieldValue('email', '');
    prs.setFieldValue('firstName', '');
    prs.setFieldValue('lastName', '');
    prs.setFieldValue('phoneNumber', '');
    prs.setFieldValue('isActive', true);
    prs.setFieldValue('locked', false);
    prs.setFieldValue('dateExpried', null);
    verifyUsername(prs.values.userName, data => {
      prs.setFieldValue('email', data.email || '');
      prs.setFieldValue('firstName', data.firstName || '');
      prs.setFieldValue('lastName', data.lastName || '');
      prs.setFieldValue('phoneNumber', data.phoneNumber || '');
      prs.setFieldValue('dateExpried', data.dateExpried || null);
    });
  };

  onSubmitForm = values => {
    const {
      userId,
      onSubmitUser,
      createUserSuccess,
      onCloseDialog,
    } = this.props;
    onSubmitUser(
      values,
      userId !== null ? 'update' : 'register',
      this.formik,
      () => {
        onCloseDialog();
        createUserSuccess();
      },
    );
  };

  componentDidUpdate() {
    document.getElementById('dialog-content').scrollTo(0, 0);
  }

  render() {
    const {
      classes,
      onAlertInvalid,
      userId,
      userInitialSchema,
      onCloseDialog,
    } = this.props;
    return (
      <Formik
        style={{ backgroudColor: 'red' }}
        enableReinitialize
        initialValues={userInitialSchema}
        validationSchema={userSchema}
        onSubmit={values => this.onSubmitForm(values)}
        render={prs => {
          this.formik = prs;
          return (
            <Form style={{ width: 500 }}>
              <PaperPanel>
                <Grid container>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Field
                      label="Tên Tài Khoản"
                      name="userName"
                      component={InputControl}
                      onChange={prs.handleChange}
                      required
                      disabled={userId !== null && prs.values.isLdap}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} xl={6} xs={6}>
                    <Field
                      label="isLdap"
                      name="isLdap"
                      component={CheckboxControl}
                      disabled={userId !== null}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} xl={6} xs={6}>
                    <Grid
                      style={{ height: '100%' }}
                      container
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item>
                        <Button
                          disabled={!prs.values.isLdap || !prs.values.userName}
                          onClick={() => this.verifyUsername(prs)}
                          variant="contained"
                          className={classes.verifyBtn}
                        >
                          Verify
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Field
                      label="Email"
                      name="email"
                      component={InputControl}
                      onChange={prs.handleChange}
                      disabled={prs.values.isLdap}
                      required
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Field
                      label="Họ"
                      name="lastName"
                      component={InputControl}
                      onChange={prs.handleChange}
                      disabled={prs.values.isLdap}
                      required
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Field
                      label="Tên"
                      name="firstName"
                      component={InputControl}
                      onChange={prs.handleChange}
                      disabled={prs.values.isLdap}
                      required
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Field
                      label="Số Điện Thoại"
                      name="phoneNumber"
                      component={InputControl}
                      onChange={prs.handleChange}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xl={12} xs={12} />
                  <Grid item lg={6} md={6} xl={6} xs={6}>
                    <Field
                      label="Khoá Tài Khoản"
                      name="locked"
                      component={CheckboxControl}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Field
                      label="Ngày hết hạn"
                      name="dateExpried"
                      component={DatePickerControl}
                      minDate={new Date()}
                    />
                  </Grid>
                </Grid>
              </PaperPanel>
              <div className={classes.btnContainer}>
                <Button
                  type="reset"
                  variant="contained"
                  className={classes.closeBtn}
                  onClick={onCloseDialog}
                >
                  Huỷ Bỏ
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={e => {
                    prs.handleSubmit(e);
                    if (!isEmpty(prs.errors)) {
                      onAlertInvalid(
                        'Biểu mẫu chưa được điền đầy đủ thông tin vui lòng kiểm tra lại',
                      );
                    }
                  }}
                >
                  {userId !== null ? (
                    <span>Cập nhật</span>
                  ) : (
                    <span>Tạo Tài Khoản</span>
                  )}
                </Button>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

UserModal.propTypes = {
  classes: PropTypes.object,
  verifyUsername: PropTypes.func,
  onAlertInvalid: PropTypes.func,
  onSubmitUser: PropTypes.func,
  createUserSuccess: PropTypes.func,
  onCloseDialog: PropTypes.func,
  userId: PropTypes.string,
  userInitialSchema: PropTypes.object,
};

export default withStyles(style)(UserModal);
