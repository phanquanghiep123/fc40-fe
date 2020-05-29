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
import moment from 'moment';
import { createStructuredSelector } from 'reselect/lib';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import Expansion from 'components/Expansion';
import { startOfDay } from 'date-fns';
import InputControl from 'components/InputControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import PeriodPicker from '../../../../../components/PeriodPicker';
import appTheme from '../../../../App/theme';
import * as makeSelect from '../selectors';
import * as actions from '../actions';

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

const theme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiGrid: {
      item: {
        paddingTop: '0 !important',
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
      formIsSubmitted,
    } = this.props;
    const isReset = history.location.state && history.location.state.isFromMenu;
    history.replace(history.location.pathname, {
      ...history.location.state,
      isFromMenu: false,
    });
    if (formIsSubmitted && !isReset) {
      onFetchFormData(submittedValues, false);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  render() {
    const {
      classes,
      formData,
      onSubmitForm,
      submittedValues,
      formDefaultValues,
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
      Date: {
        name: 'Date',
        label: 'Ngày Tồn',
        component: PeriodPicker,
        datePickerProps: {
          clearable: false,
          showTodayButton: false,
        },
        from: {
          format: 'dd/MM/yyyy',
          name: 'DateFrom',
          value: pr.values.DateFrom,
        },
        to: {
          name: 'DateTo',
          format: 'dd/MM/yyyy',
          value: pr.values.DateTo,
        },
      },
      basketCode: {
        name: 'basketCode',
        label: 'Mã khay sọt',
        value: pr.values.basketCode,
        component: SelectAutocomplete,
        options: formData.basketCode,
        onChange: pr.handleChange,
        placeholder: 'Tìm và chọn mã khay sọt',
        isMultiline: true,
        isMulti: true,
      },
      ConfigShowDate: {
        label: 'ConfigShowDate',
        name: 'ConfigShowDate',
        component: InputControl,
        value: pr.values.ConfigShowDate,
        onChange: pr.handleChange,
      },
    });
    return (
      <MuiThemeProvider theme={theme}>
        <Formik
          enableReinitialize
          initialValues={{ ...submittedValues }}
          validate={values => {
            const errors = {};
            const { DateFrom, DateTo } = values;
            if (
              values.DateTo !== '' &&
              startOfDay(values.DateFrom).getTime() >
                startOfDay(values.DateTo).getTime()
            ) {
              errors.Date = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc';
            }
            const MdateFrom = moment([
              DateFrom.getFullYear(),
              DateFrom.getMonth(),
              DateFrom.getDate(),
            ]);
            const MdateTo = moment([
              DateTo.getFullYear(),
              DateTo.getMonth(),
              DateTo.getDate(),
            ]);
            const numberShowColumnDate = MdateTo.diff(MdateFrom, 'days');
            if (numberShowColumnDate > values.ConfigShowDate) {
              errors.Date = `Tổng số ngày tồn từ và ngày tồn đến không được lớn hơn ${
                values.ConfigShowDate
              } ngày`;
            }
            return errors;
          }}
          onSubmit={(values, formikActions) => {
            onSubmitForm({ ...values, pageSize: 10, pageIndex: 0 }, formData);
            formikActions.setSubmitting(false);
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
                    <Grid
                      container
                      spacing={40}
                      style={{ marginBottom: '-0.5rem' }}
                    >
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Grid item xl={12} lg={12} md={8} sm={12} xs={12}>
                          <Field {...formAttr(pr).org} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={8} sm={12} xs={12}>
                          <Field {...formAttr(pr).basketCode} />
                        </Grid>
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Grid item xl={12} lg={12} md={8} sm={12} xs={12}>
                          <Field {...formAttr(pr).Date} />
                        </Grid>
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
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Tìm kiếm
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
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  formDefaultValues: makeSelect.formDefaultValues(),
  submittedValues: makeSelect.formSubmittedValues(),
  formValues: makeSelect.formValues(),
  formIsSubmitted: makeSelect.formIsSubmitted(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
    onSubmitForm: (formValues, formData) =>
      dispatch(actions.submitForm(formValues, formData)),
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
