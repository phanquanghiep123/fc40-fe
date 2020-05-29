import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik/dist';
import {
  MenuItem,
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
import SelectControl from '../../../../../components/SelectControl';
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
    MuiInputLabel: {
      shrink: {
        fontWeight: 'bold',
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
      onfetchVendorCode,
    } = this.props;
    let autoCompleteTimer;
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
        label: 'Ngày xử lý',
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
      status: {
        name: 'status',
        label: 'Trạng thái',
        value: pr.values.status,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.statusList.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      vendorType: {
        name: 'vendorType',
        label: 'Loại vendor',
        value: pr.values.vendorType,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.vendorTypeList.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      vendor: {
        name: 'vendor',
        label: 'Vendor',
        value: pr.values.vendor,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn Vendor',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer);
          autoCompleteTimer = setTimeout(() => {
            const value = pr.values.vendorType;
            let vendorType = '';
            // eslint-disable-next-line eqeqeq
            if (value != 0) {
              vendorType = value;
            }
            onfetchVendorCode(inputValue, vendorType, callback);
          }, 200);
        },
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
            const { DateTo, DateFrom } = values;
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
              errors.Date = `Tổng số ngày xử lý từ và ngày xử lý đến không được lớn hơn ${
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
            formikActions.setValues({ ...formDefaultValues }, formData);
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
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).org} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).basketCode} />
                        </Grid>
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).Date} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).status} />
                        </Grid>
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).vendorType} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).vendor} />
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
  onfetchVendorCode: PropTypes.func,
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
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onSubmitForm: (formValues, formData) =>
      dispatch(actions.submitForm(formValues, formData)),
    onfetchVendorCode: (inputValue, type, callback) =>
      dispatch(actions.fetchVendorCode(inputValue, type, callback)),
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
