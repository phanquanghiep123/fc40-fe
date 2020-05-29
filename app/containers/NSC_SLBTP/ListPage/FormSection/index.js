import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { startOfDay } from 'date-fns';
import {
  createMuiTheme,
  withStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { get } from 'lodash';
import Expansion from 'components/Expansion';
import { Field, Form, Formik } from 'formik/dist/index';
import { Button, Grid } from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import PeriodPicker from 'components/PeriodPicker';
import SelectAutocomplete from 'components/SelectAutocomplete';
import InputControl from 'components/InputControl';
import moment from 'moment';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';

const style = (theme = appTheme) => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 2,
  },
  btnContainer: {
    marginTop: '30px',
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
  gridDate: {
    display: 'flex',
    justifyContent: 'space-betwwen',
    '& > div': {
      marginTop: '0 !important',
    },
  },
  gridDateDivider: {
    alignSelf: 'flex-start',
    padding: '.5rem .75rem',
  },
  dateLabel: {
    display: 'block',
    fontSize: '0.75rem',
    marginBottom: '0.25rem',
  },
});

const theme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiGrid: {
      item: {
        paddingTop: '0 !important',
        maxWidth: '100%!important',
      },
    },
  },
});

export class FormSection extends React.Component {
  componentDidMount() {
    const {
      formDefaultValues,
      onFormSubmit,
      history,
      formSubmittedValues,
      onFetchFormData,
    } = this.props;
    let isRun = false;
    const urlParams = new URL(window.location.href);
    const isRunG = urlParams.searchParams.get('isrun');
    if (isRunG === 'true') {
      isRun = true;
    }
    if (
      isRun === false &&
      (history.action === 'PUSH' || formSubmittedValues.isSubmit === false)
    ) {
      onFetchFormData(formDefaultValues);
    } else {
      onFormSubmit(formSubmittedValues);
    }
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const { formData, onGetProductAuto, onProductionOrderAuto } = this.props;
    let autoCompleteTimer;
    let autoCompleteTimer1;
    let autoCompleteTimer2;
    return {
      farmIdFrom: {
        name: 'farmIdFrom',
        label: 'Farm (từ)',
        placeholder: 'Tìm và chọn Farm',
        value: pr.values.farmIdFrom,
        isAsync: false,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        options: formData.Farms,
      },
      farmIdTo: {
        name: 'farmIdTo',
        label: 'Farm (đến)',
        placeholder: 'Tìm và chọn Farm',
        value: pr.values.farmIdTo,
        isAsync: false,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        options: formData.Farms,
      },

      LSXCodeFrom: {
        name: 'LSXCodeFrom',
        label: 'Mã LSX (từ)',
        value: pr.values.LSXCodeFrom,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn LSX',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer1); // clear previous timeout
          autoCompleteTimer1 = setTimeout(() => {
            const farmIdFrom = get(pr.values, 'farmIdFrom.value', '');
            const farmIdTo = get(pr.values, 'farmIdTo.value', '');
            const { Farms } = formData;
            onProductionOrderAuto(
              inputValue,
              Farms,
              farmIdFrom,
              farmIdTo,
              callback,
            );
          }, 200);
        },
      },
      LSXCodeTo: {
        name: 'LSXCodeTo',
        label: 'Mã LSX (đến)',
        value: pr.values.LSXCodeTo,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn LSX',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer2); // clear previous timeout
          autoCompleteTimer2 = setTimeout(() => {
            const farmIdFrom = get(pr.values, 'farmIdFrom.value', '');
            const farmIdTo = get(pr.values, 'farmIdTo.value', '');
            const { Farms } = formData;
            onProductionOrderAuto(
              inputValue,
              Farms,
              farmIdFrom,
              farmIdTo,
              callback,
            );
          }, 200);
        },
      },
      DateFromTo: {
        name: 'DateFromTo',
        label: 'Ngày thu hoạch',
        component: PeriodPicker,
        datePickerProps: {
          clearable: false,
          showTodayButton: false,
        },
        from: {
          name: 'dateFrom',
          value: pr.values.dateFrom,
          required: true,
        },
        to: {
          name: 'dateTo',
          value: pr.values.dateTo,
          required: true,
        },
      },
      productName: {
        name: 'productName',
        label: 'Tên sản phẩm',
        component: InputControl,
        value: pr.values.productName,
        onChange: pr.handleChange,
      },
      ConfigShowDate: {
        label: 'ConfigShowDate',
        name: 'ConfigShowDate',
        component: InputControl,
        value: pr.values.ConfigShowDate,
        onChange: pr.handleChange,
      },
      productCode: {
        name: 'productCode',
        label: 'Mã sản phẩm',
        value: pr.values.productCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn Mã sản phẩm',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetProductAuto(inputValue, callback);
          }, 1000);
        },
      },
    };
  };

  renderGridField(item, cols = { xl: 6, lg: 6, md: 6, sm: 6, xs: 12 }) {
    return (
      <Grid item {...cols}>
        <Field {...item} />
      </Grid>
    );
  }

  render() {
    const {
      classes,
      formDefaultValues,
      formSubmittedValues,
      onFormSubmit,
    } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Formik
          enableReinitialize
          initialValues={formSubmittedValues}
          validate={values => {
            const errors = {};
            const { dateFrom, dateTo } = values;
            if (!dateFrom || !dateTo)
              errors.DateFromTo =
                'Ngày bắt đầu và ngày kết thúc không được trống';
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
              if (numberShowColumnDate > values.ConfigShowDate) {
                errors.DateFromTo = `Tổng số ngày từ ngày thu hoạch đến ngày thu hoạch không được lớn hơn ${
                  values.ConfigShowDate
                } ngày`;
              }
              if (
                values.DateTo !== '' &&
                startOfDay(values.dateFrom).getTime() >
                  startOfDay(values.dateTo).getTime()
              ) {
                errors.DateFromTo =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              }
            }
            return errors;
          }}
          onSubmit={(values, formikActions) => {
            onFormSubmit({ ...values, pageIndex: 0 });
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formDefaultValues.Farms = formSubmittedValues.Farms;
            formDefaultValues.LSXs = formSubmittedValues.LSXs;
            formDefaultValues.Regions = formSubmittedValues.Regions;
            formikActions.setValues({
              ...formDefaultValues,
              ConfigShowDate: values.ConfigShowDate,
              pageIndex: 0,
            });
            onFormSubmit({
              ...formDefaultValues,
              ConfigShowDate: values.ConfigShowDate,
              pageIndex: 0,
            });
          }}
          render={pr => {
            const formAttr = this.makeFormAttr(pr);
            return (
              <div className={classes.expansionContainer}>
                <Expansion
                  title="I. Thông Tin Chung"
                  content={
                    <Form>
                      <Grid
                        container
                        spacing={40}
                        style={{ marginBottom: '-0.5rem', marginTop: '20px' }}
                      >
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          {this.renderGridField(formAttr.farmIdFrom)}
                          {this.renderGridField(formAttr.LSXCodeFrom)}
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          {this.renderGridField(formAttr.farmIdTo)}
                          {this.renderGridField(formAttr.LSXCodeTo)}
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          {this.renderGridField(formAttr.DateFromTo, {
                            xl: 12,
                            lg: 12,
                            md: 12,
                            sm: 12,
                            xs: 12,
                          })}
                        </Grid>
                        <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                          {this.renderGridField(formAttr.productCode, {
                            xl: 12,
                            lg: 12,
                            md: 12,
                            sm: 12,
                            xs: 12,
                          })}
                          {this.renderGridField(formAttr.productName, {
                            xl: 12,
                            lg: 12,
                            md: 12,
                            sm: 12,
                            xs: 12,
                          })}
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
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.submit}
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
      </MuiThemeProvider>
    );
  }
}
FormSection.propTypes = {
  classes: PropTypes.object.isRequired,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  formSubmittedValues: PropTypes.object,
  formIsSubmitted: PropTypes.bool,
  onFormSubmit: PropTypes.func,
  onFetchFormData: PropTypes.func,
  ui: PropTypes.object,
  onGetProductAuto: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onGetProductAuto: (inputText, callback) =>
      dispatch(actions.getProductAuto(inputText, callback)),
    onProductionOrderAuto: (inputText, Farms, fromFarm, toFarm, callback) =>
      dispatch(
        actions.getProductionOrderAuto(
          inputText,
          Farms,
          fromFarm,
          toFarm,
          callback,
        ),
      ),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJs,
  withStyles(style()),
)(FormSection);
