import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik/dist';
import {
  Grid,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Button,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import DatePickerControl from 'components/DatePickerControl';
import Expansion from 'components/Expansion';
import SelectAutocomplete from 'components/SelectAutocomplete';
import appTheme from '../../../../App/theme';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import { validationSchema } from './schema';

const style = (theme = appTheme) => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
    '& > *': {
      padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 4}px`,
    },
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    background: theme.palette.background.default,
    marginRight: theme.spacing.unit * 2,
  },
  Bnt: {
    padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 3}px`,
    boxShadow: `0 1px 3px #aaa`,
    '&:not(:last-child)': {
      marginRight: theme.spacing.unit * 2,
    },
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      ...theme.overrides,
      MuiFormHelperText: {
        root: {
          marginTop: 0,
        },
      },
    },
  });

class FormSection extends Component {
  componentDidMount() {
    const {
      formDefaultValues,
      submittedValues,
      onFetchFormData,
      history,
    } = this.props;
    if (history.action === 'POP') {
      onFetchFormData(submittedValues);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  runSuccess = () => {
    const { history } = this.props;
    const params = new URL(document.location).searchParams;
    const screen = params.get('screen');
    switch (screen) {
      case '1':
        return history.push('/bao-cao-giao-dich-xuat-nhap?isrun=true');
      case '2':
        return history.push('/bao-cao-chi-tiet-muon-cho-muon?isrun=true');
      case '3':
        return history.push('/bao-cao-ton-kho-vat-ly-khay-sot?isrun=true');
      default:
        return null;
    }
  };

  render() {
    const {
      classes,
      formData,
      onSubmitForm,
      submittedValues,
      formDefaultValues,
      onProceedReport,
    } = this.props;
    const formAttr = pr => ({
      org: {
        name: 'org',
        label: 'Đơn vị quản lý',
        value: pr.values.org,
        component: SelectAutocomplete,
        options: formData.orgList,
        onChange: pr.handleChange,
        placeholder: 'Tất Cả',
        isMultiline: true,
        isMulti: true,
      },
      date: {
        name: 'date',
        label: 'Ngày Xử Lý',
        required: true,
        component: DatePickerControl,
        value: pr.values.date,
      },
    });
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Formik
          enableReinitialize
          initialValues={{ ...submittedValues }}
          validationSchema={validationSchema}
          validate={values => {
            const dateNow = new Date();
            const errors = {};
            if (values.date > dateNow) {
              errors.date = 'Phải chọn ngày nhỏ hơn ngày hiện tại';
            }
            return errors;
          }}
          onSubmit={(values, formikActions) => {
            formikActions.setSubmitting(false);
            if (values.btn === 'proceedReport') {
              onProceedReport(
                { ...values, pageIndex: 0 },
                formData,
                this.runSuccess,
              );
            } else {
              onSubmitForm({ ...values, pageSize: 5, pageIndex: 0 }, formData);
            }
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues({ ...formDefaultValues });
            this.props.onSubmitForm({ ...formDefaultValues }, formData);
          }}
          render={pr => (
            <div className={classes.expansionContainer}>
              <Expansion
                title="I. Thông Tin Chung"
                content={
                  <Form>
                    <Grid container spacing={24}>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Field {...formAttr(pr).org} />{' '}
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Field {...formAttr(pr).date} />
                      </Grid>
                    </Grid>
                    <div className={classes.btnContainer}>
                      <Button
                        type="button"
                        variant="contained"
                        className={classes.resetBtn}
                        onClick={pr.handleReset}
                      >
                        Bỏ lọc
                      </Button>
                      <Button
                        className={classes.Bnt}
                        onClick={() => {
                          pr.setFieldValue('btn', 'summit');
                          setTimeout(pr.handleSubmit, 100);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Tìm kiếm
                      </Button>
                      <Button
                        className={classes.Bnt}
                        onClick={() => {
                          pr.setFieldValue('btn', 'proceedReport');
                          setTimeout(pr.handleSubmit, 100);
                        }}
                        disabled={submittedValues.isRuning || false}
                        variant="contained"
                        color="primary"
                      >
                        Chạy Báo Cáo
                      </Button>
                    </div>
                  </Form>
                }
              />
            </div>
          )}
        />
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  submittedValues: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onSubmitForm: PropTypes.func,
  formValues: PropTypes.any,
  onProceedReport: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  formDefaultValues: makeSelect.formDefaultValues(),
  submittedValues: makeSelect.formSubmittedValues(),
  formValues: makeSelect.formValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onSubmitForm: (formValues, formData) =>
      dispatch(actions.submitForm(formValues, formData)),
    onProceedReport: (formValues, formData, callback) =>
      dispatch(actions.proceedReport(formValues, formData, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(style()),
  withImmutablePropsToJs,
)(FormSection);
