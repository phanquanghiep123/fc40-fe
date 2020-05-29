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
import { buildRequestId } from 'utils/notificationUtils';
import moment from 'moment';
import { createStructuredSelector } from 'reselect/lib';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import CheckboxControl from 'components/CheckboxControl';
import Expansion from 'components/Expansion';
import { startOfDay } from 'date-fns';
import InputControl from 'components/InputControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import PeriodPicker from '../../../../../components/PeriodPicker';
import SelectControl from '../../../../../components/SelectControl';
import appTheme from '../../../../App/theme';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
import SyncPopup from '../SyncPopup';
import Popup from '../../../../../components/MuiPopup';

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

const popupTheme = createMuiTheme({
  ...appTheme,
  overrides: {
    ...appTheme.overrides,
    MuiDialog: {
      paper: {
        backgroundColor: appTheme.palette.background.default,
      },
    },
    MuiDialogTitle: {
      root: {
        padding: `${appTheme.spacing.unit * 2}px ${appTheme.spacing.unit *
          3}px ${appTheme.spacing.unit}px`,
      },
    },
    MuiDialogContent: {
      root: {
        padding: `${appTheme.spacing.unit}px ${appTheme.spacing.unit * 3}px`,
        '&:first-child': {
          paddingTop: appTheme.spacing.unit,
        },
      },
    },
  },
});

class FormSection extends Component {
  state = {
    openWarning: false,
  };

  requestId = buildRequestId();

  warning = () => {
    this.setState({ openWarning: true });
  };

  closeWarning = () => {
    this.setState({ openWarning: false });
  };

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
      onFetchFormData(formDefaultValues, formIsSubmitted);
    }
  }

  syncReport = values => {
    const { onSyncReport, submittedValues, submittedValuesBasket } = this.props;
    let params = {};
    if (!values.plantCode) {
      params = {
        ...values,
        requestId: this.requestId,
        plantCode: this.props.formData.orgListStocktaking,
      };
    } else {
      params = {
        ...values,
        requestId: this.requestId,
      };
    }
    onSyncReport(params, submittedValues, submittedValuesBasket);
  };

  render() {
    const { openWarning } = this.state;
    const {
      classes,
      formData,
      onSubmitForm,
      submittedValues,
      formDefaultValues,
      onSubmitBasketForm,
    } = this.props;
    const formAttr = pr => ({
      basketStockTakingCode: {
        name: 'basketStockTakingCode',
        label: 'Mã biên bản kiểm kê',
        component: InputControl,
        value: pr.values.basketStockTakingCode,
        onChange: pr.handleChange,
        autoFocus: true,
      },
      Date: {
        name: 'Date',
        label: 'Ngày kiểm kê',
        component: PeriodPicker,
        datePickerProps: {
          clearable: false,
          showTodayButton: false,
        },
        from: {
          name: 'DateFrom',
          format: 'dd/MM/yyyy',
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
        options: formData.listBasketCode,
        onChange: pr.handleChange,
        placeholder: 'Tất cả',
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
      afterStocktaking: {
        name: 'afterStocktaking',
        label: 'Xử lý sau kiểm kê',
        value: pr.values.afterStocktaking,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.afterStocktakingList.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      orgStocktaking: {
        name: 'orgStocktaking',
        label: 'Đơn vị kiểm kê',
        value: pr.values.orgStocktaking,
        component: SelectAutocomplete,
        options: formData.orgListStocktaking,
        onChange: pr.handleChange,
        placeholder: 'Tất cả',
        isMultiline: true,
        isMulti: true,
      },
      stocktakingType: {
        name: 'stocktakingType',
        label: 'Loại kiểm kê',
        value: pr.values.stocktakingType,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.stocktakingTypeList.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      stocktakingRound: {
        name: 'stocktakingRound',
        label: 'Đợt kiểm kê',
        component: InputControl,
        placeholder: 'Nhập năm tháng(Ví dụ: 202002)',
        value: pr.values.stocktakingRound,
        onChange: pr.handleChange,
      },
      isDifference: {
        name: 'isDifference',
        label: 'Có chênh lệch',
        value: pr.values.isDifference,
        component: CheckboxControl,
        labelPlacement: 'end',
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

            const dateFrom = moment(DateFrom).toDate();
            const dateTo = moment(DateTo).toDate();
            if (!dateFrom || !dateTo)
              errors.Date = 'Ngày bắt đầu và ngày kết thúc không được trống';
            else {
              const MdateFrom = moment([
                dateFrom.getFullYear(),
                dateFrom.getMonth(),
                dateFrom.getDate(),
              ]);
              const MdateTo = moment([
                dateTo.getFullYear(),
                dateTo.getMonth(),
                dateTo.getDate(),
              ]);
              const numberShowColumnDate = MdateTo.diff(MdateFrom, 'days');
              if (numberShowColumnDate >= formData.ConfigShowDate) {
                errors.Date = `Tổng số ngày kiểm kê không được lớn hơn ${
                  formData.ConfigShowDate
                } ngày`;
              }
              if (
                values.DateTo !== '' &&
                startOfDay(moment(values.DateFrom).toDate()).getTime() >
                  startOfDay(moment(values.DateTo).toDate()).getTime()
              ) {
                errors.Date =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              }
              if (formData.ConfigShowDate === 0)
                errors.Date =
                  'Giá trị setting đang là 0. Xin vui lòng kiểm tra lại';
            }
            return errors;
          }}
          onSubmit={(values, formikActions) => {
            onSubmitBasketForm(
              { ...values, pageSize: 10, pageIndex: 0 },
              formData,
            );
            onSubmitForm({ ...values, pageSize: 10, pageIndex: 0 }, formData);
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues(formDefaultValues, formData);
            this.props.onSubmitForm(formDefaultValues, formData);
            this.props.onSubmitBasketForm(formDefaultValues, formData);
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
                      <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).basketStockTakingCode} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).status} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).afterStocktaking} />
                        </Grid>
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).orgStocktaking} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).stocktakingType} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).stocktakingRound} />
                        </Grid>
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).Date} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <Field {...formAttr(pr).basketCode} />
                        </Grid>
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                        <Grid item xl={12} lg={12} md={8} sm={12} xs={12}>
                          <Field {...formAttr(pr).isDifference} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <div className={classes.btnContainer}>
                      <Button
                        onClick={this.warning}
                        type="button"
                        variant="contained"
                        className={classes.resetBtn}
                      >
                        Đồng bộ
                      </Button>
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
              <Popup
                open={openWarning}
                onClose={this.closeWarning}
                content={
                  <SyncPopup
                    onSyncReportData={this.syncReport}
                    onClose={this.closeWarning}
                    orgListStocktaking={formData.orgListStocktaking}
                  />
                }
                dialogProps={{ maxWidth: 'sm', keepMounted: false }}
                theme={popupTheme}
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
  onSubmitBasketForm: PropTypes.func,
  onfetchVendorCode: PropTypes.func,
  onSyncReport: PropTypes.func,
  formValues: PropTypes.any,
  onSignalRProcessing: PropTypes.func,
  ConfigShowDate: PropTypes.any,
  DateFrom: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  formData: makeSelect.formData(),
  formDefaultValues: makeSelect.formDefaultValues(),
  submittedValues: makeSelect.formSubmittedValues(),
  formValues: makeSelect.formValues(),
  formIsSubmitted: makeSelect.formIsSubmitted(),
  submittedValuesBasket: makeSelect.formSubmittedValuesBasket(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchFormData: (formValues, formIsSubmitted) =>
      dispatch(actions.fetchFormData(formValues, formIsSubmitted)),
    onSubmitForm: (formValues, formData) =>
      dispatch(actions.submitForm(formValues, formData)),
    onSubmitBasketForm: (formValues, formData) =>
      dispatch(actions.submitFormBasket(formValues, formData)),
    onSyncReport: (values, submittedValues, submittedValuesBasket) =>
      dispatch(
        actions.syncReport(values, submittedValues, submittedValuesBasket),
      ),
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
