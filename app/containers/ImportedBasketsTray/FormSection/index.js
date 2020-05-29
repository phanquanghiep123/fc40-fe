import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Button, Grid, withStyles } from '@material-ui/core';
import SelectAutocomplete from 'components/SelectAutocomplete';
import InputControl from 'components/InputControl';
// import DatePickerControl from 'components/DatePickerControl';
// import SelectControl from 'components/SelectControl';
import PeriodPicker from 'components/PeriodPicker';
// import SelectControl from 'components/SelectControl';
import { Field, Form, Formik } from 'formik/dist/index';
import Expansion from 'components/Expansion';
// import MuiButton from 'components/MuiButton';
// import * as PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect/lib/index';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import appTheme from 'containers/App/theme';
import { connect } from 'react-redux';
import { startOfDay } from 'date-fns';
import { withRouter } from 'react-router-dom';
import * as makeSelect from '../selectors';
import * as actions from '../actions';

const style = (theme = appTheme) => ({
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 2,
  },
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
    marginRight: theme.spacing.unit * 2,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class FormSection extends React.PureComponent {
  formik = null;

  componentDidMount() {
    const {
      formDefaultValues,
      onSubmitForm,
      // formData,
      // history,
      formSubmittedValues,
      onFetchFormData,
      formIsSubmitted,
    } = this.props;
    // const isReset = history.location.state && history.location.state.isFromMenu;
    // history.replace(history.location.pathname, {
    //   ...history.location.state,
    //   isFromMenu: false,
    // });
    if (formIsSubmitted) {
      onSubmitForm(formSubmittedValues);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  makeFormAttr = pr => {
    const { formData, onFetchDeliveryOrg } = this.props;
    let autoCompleteTimer;
    return {
      basketDocumentCode: {
        name: 'basketDocumentCode',
        label: 'Mã PNKS',
        value: pr.values.basketDocumentCode,
        component: InputControl,
        onChange: pr.handleChange,
      },
      importType: {
        name: 'importType',
        label: 'Loại Nhập Khay Sọt',
        value: pr.values.importType,
        component: SelectAutocomplete,
        onChange: pr.handleChange,
        options: formData.importType,
        placeholder: 'Tất cả',
        isMulti: true,
        isMultiline: true,
      },
      filterBasket: {
        name: 'filterBasket',
        label: 'Mã Khay Sọt',
        value: pr.values.filterBasket,
        component: SelectAutocomplete,
        onChange: pr.handleChange,
        options: formData.filterBasket,
        placeholder: 'Lựa chọn Mã khay sọt',
      },
      DateFromTo: {
        name: 'DateFromTo',
        label: 'Ngày nhập khay sọt',
        component: PeriodPicker,
        from: {
          format: 'dd/MM/yyyy',
          name: 'FromDate',
          value: pr.values.FromDate,
        },
        to: {
          name: 'ToDate',
          format: 'dd/MM/yyyy',
          value: pr.values.ToDate,
        },
      },
      status: {
        name: 'status',
        label: 'Trạng thái',
        value: pr.values.status,
        component: SelectAutocomplete,
        onChange: pr.handleChange,
        options: formData.status,
        placeholder: 'Tất cả',
      },
      deliver: {
        name: 'deliver',
        label: 'Đơn vị giao hàng',
        value: pr.values.deliver,
        component: SelectAutocomplete,
        placeholder: 'Tất cả',
        searchable: true,
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchDeliveryOrg(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
        onChangeSelectAutoComplete: selected => {
          pr.setFieldValue('deliver', selected);
          pr.setFieldValue('deliverType', selected.deliverType);
        },
      },
      receiver: {
        name: 'receiver',
        label: 'Đơn vị Nhận Hàng',
        value: pr.values.receiver,
        component: SelectAutocomplete,
        placeholder: 'Tất Cả',
        options: formData.org,
      },
      userId: {
        name: 'userId',
        label: 'Người nhập khay sọt',
        value: pr.values.userId,
        component: SelectAutocomplete,
        placeholder: 'Lựa chọn người nhập khay sọt',
        options: formData.users,
      },
      doCode: {
        name: 'doCode',
        label: 'Mã BBGH',
        value: pr.values.doCode,
        component: InputControl,
        onChange: pr.handleChange,
      },
    };
  };

  render() {
    const { classes, formSubmittedValues, formDefaultValues } = this.props;
    return (
      <React.Fragment>
        <Formik
          enableReinitialize
          initialValues={formSubmittedValues}
          validate={values => {
            const errors = {};
            if (
              values.ToDate !== '' &&
              startOfDay(values.FromDate).getTime() >
                startOfDay(values.ToDate).getTime()
            ) {
              errors.DateFromTo =
                'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
            }
            return errors;
          }}
          onSubmit={(values, formikActions) => {
            this.props.onSubmitForm({ ...values, pageIndex: 0 });
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues({ ...formDefaultValues });
            this.props.onSubmitForm({ ...formDefaultValues });
          }}
          render={formik => {
            this.formik = formik;
            const formAttr = this.makeFormAttr(formik);
            return (
              <div>
                <Expansion
                  title="I. Thông Tin Chung"
                  content={
                    <Form>
                      <Grid
                        container
                        spacing={40}
                        style={{ marginBottom: '-0.5rem' }}
                      >
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.basketDocumentCode} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.importType} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.filterBasket} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.DateFromTo} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.status} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.deliver} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.receiver} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.userId} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.doCode} />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <div className={classes.btnContainer}>
                        <Button
                          type="button"
                          variant="contained"
                          className={classes.resetBtn}
                          onClick={formik.handleReset}
                        >
                          Bỏ lọc
                        </Button>
                        <Button
                          className={classes.btn}
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
            );
          }}
        />
      </React.Fragment>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object.isRequired,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  formIsSubmitted: PropTypes.bool,
  onSubmitForm: PropTypes.func,
  onFetchFormData: PropTypes.func,
  ui: PropTypes.object,
  onFetchDeliveryOrg: PropTypes.func,
};
const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  formDefaultValues: makeSelect.formDefaultValues(),
  formIsSubmitted: makeSelect.formIsSubmitted(),
  formSubmittedValues: makeSelect.formSubmittedValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    // onFetchReceiverOrg: (inputValue, callback) =>
    //   dispatch(actions.fetchReceiverOrg(inputValue, callback)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
    onFetchDeliveryOrg: (inputValue, callback) =>
      dispatch(actions.fetchDeliveryOrg(inputValue, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withRouter,
  withImmutablePropsToJs,
  withStyles(style()),
)(FormSection);
