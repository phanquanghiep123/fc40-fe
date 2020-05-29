import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Button, Grid, withStyles } from '@material-ui/core';
import SelectAutocomplete from 'components/SelectAutocomplete';
import InputControl from 'components/InputControl';
import PeriodPicker from 'components/PeriodPicker';
import { Field, Form, Formik } from 'formik/dist/index';
import Expansion from 'components/Expansion';

import { createStructuredSelector } from 'reselect/lib/index';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import appTheme from 'containers/App/theme';
import { connect } from 'react-redux';
// import { startOfDay } from 'date-fns';
import { withRouter } from 'react-router-dom';
import { startOfDay } from 'date-fns';
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

export class FormSection extends React.PureComponent {
  formik = null;

  componentDidMount() {
    const {
      formDefaultValues,
      onSubmitForm,
      formSubmittedValues,
      onFetchFormData,
      formIsSubmitted,
    } = this.props;
    if (formIsSubmitted) {
      onSubmitForm(formSubmittedValues);
    } else {
      onFetchFormData(formDefaultValues);
    }
    // this.props.onFetchFormData();
  }

  makeFormAttr = pr => {
    const { formData } = this.props;
    // let autoCompleteTimer;
    return {
      basketStockTakingCode: {
        name: 'basketStockTakingCode',
        label: 'Mã BBKK',
        value: pr.values.basketDocumentCode,
        component: InputControl,
        onChange: pr.handleChange,
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
      afterStatus: {
        name: 'afterStatus',
        label: 'Xử lý sau Kiểm Kê',
        value: pr.values.status,
        component: SelectAutocomplete,
        onChange: pr.handleChange,
        placeholder: 'Tất cả',
        options: formData.afterStatus,
      },
      typeKK: {
        name: 'typeKK',
        label: 'Loại Kiểm Kê',
        value: pr.values.typeKK,
        component: SelectAutocomplete,
        onChange: pr.handleChange,
        placeholder: 'Tất cả',
        options: formData.typeKK,
      },
      stageKK: {
        name: 'stageKK',
        label: 'Đợt Kiểm Kê',
        value: pr.values.basketDocumentCode,
        component: InputControl,
        onChange: pr.handleChange,
      },
      DateFromTo: {
        name: 'DateFromTo',
        label: 'Thời Gian Kiểm Kê',
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
      unitKK: {
        name: 'unitKK',
        label: 'Đơn vị Kiểm Kê',
        value: pr.values.unitKK,
        component: SelectAutocomplete,
        placeholder: 'Tất cả',
        options: formData.unitKK,
        isMulti: true,
        isMultiline: true,
      },
      userId: {
        name: 'userId',
        label: 'Người thực hiện Kiểm Kê',
        value: pr.values.userId,
        component: SelectAutocomplete,
        placeholder: 'Tất Cả',
        options: formData.users,
      },
      basketDocumentCode: {
        name: 'basketDocumentCode',
        label: 'Mã phiếu điều chỉnh',
        value: pr.values.basketDocumentCode,
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
                              <Field {...formAttr.basketStockTakingCode} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.status} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.afterStatus} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.typeKK} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.stageKK} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.DateFromTo} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.unitKK} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          <Grid container>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.userId} />
                            </Grid>
                            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                              <Field {...formAttr.basketDocumentCode} />
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

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
  };
}

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  formDefaultValues: makeSelect.formDefaultValues(),
  formIsSubmitted: makeSelect.formIsSubmitted(),
  formSubmittedValues: makeSelect.formSubmittedValues(),
});

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
