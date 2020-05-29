import React from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { startOfDay } from 'date-fns';
import InputControl from 'components/InputControl';
// import formatJson from 'format-json-pretty';
import {
  createMuiTheme,
  withStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik/dist/index';
import { Button, Grid } from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import PeriodPicker from 'components/PeriodPicker';
import Expansion from 'components/Expansion';
import SelectAutocomplete from 'components/SelectAutocomplete';
import DatePickerControl from 'components/DatePickerControl';
import appTheme from 'containers/App/theme';
import * as selectors from '../selectors';
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
      },
    },
  },
});

export class FormSection extends React.Component {
  formik = null;

  componentDidMount() {
    const {
      formDefaultValues,
      onFormSubmit,
      // formData,
      history,
      formSubmittedValues,
      onFetchFormData,
      formIsSubmitted,
    } = this.props;
    const isReset = history.location.state && history.location.state.isFromMenu;
    history.replace(history.location.pathname, {
      ...history.location.state,
      isFromMenu: false,
    });
    if (formIsSubmitted && !isReset) {
      onFormSubmit(formSubmittedValues);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  changeOrg = selected => {
    this.formik.setFieldValue('locatorCode', '0');
    if (selected !== null) {
      const { formSubmittedValues } = this.props;
      this.props.onFetchLocators(formSubmittedValues, selected);
    }
    this.formik.setFieldValue('plantCode', selected);
  };

  makeFormAttr = pr => {
    const {
      formData,
      onGetProductAuto,
      onGetUoMAuto,
      onGetOriginAuto,
    } = this.props;
    let autoCompleteTimer;
    return {
      date: {
        name: 'date',
        label: 'Ngày Kiểm Kê',
        value: pr.values.date,
        disabled: true,
        component: DatePickerControl,
      },
      batchKey: {
        name: 'batchKey',
        label: 'Batch Sản Phẩm',
        onChange: pr.handleChange,
        component: InputControl,
      },
      plantCode: {
        name: 'plantCode',
        label: 'Đơn vị',
        component: SelectAutocomplete,
        value: pr.values.plantCode,
        onChangeSelectAutoComplete: this.changeOrg,
        placeholder: 'Tất cả',
        searchable: true,
        options: formData.org,
        disabled: formData.org.length === 1,
      },
      DateFromTo: {
        name: 'DateFromTo',
        label: 'Ngày Nhập Kho',
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
      uom: {
        name: 'uom',
        label: 'Đơn Vị Tính',
        value: pr.values.uom,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn đơn vị tính',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetUoMAuto(inputValue, callback);
          }, 1000);
        },
      },
      assessorCode: {
        name: 'assessorCode',
        label: 'Người Đánh Giá',
        value: pr.values.assessorCode,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người đánh giá',
        options: formData.users,
      },
      stocktakerCode: {
        name: 'stocktakerCode',
        label: 'Người Kiểm Kê',
        value: pr.values.stocktakerCode,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người kiểm kê',
        options: formData.users,
      },
      locatorCode: {
        name: 'locatorCode',
        label: 'Kho Tồn',
        value: pr.values.locatorCode,
        disabled: pr.values.plantCode === null,
        component: SelectAutocomplete,
        options: formData.locators,
        placeholder: 'Tất cả',
      },
      warningClass: {
        name: 'warningClass',
        label: 'Phân Loại Cảnh Báo',
        value: pr.values.warningClass,
        placeholder: 'Tất Cả',
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        options: formData.warningTypes,
      },
      warningType: {
        name: 'warningType',
        label: 'Đánh Giá Thực Tế',
        value: pr.values.warningType,
        placeholder: 'Tất Cả',
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        options: formData.warningTypes,
      },
      originCode: {
        name: 'originCode',
        label: 'Farm/NCC',
        component: SelectAutocomplete,
        value: pr.values.originCode,
        isAsync: true,
        isMulti: true,
        isMultiline: true,
        placeholder: 'Tìm và chọn Farm/NCC',
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetOriginAuto(inputValue, callback);
          }, 1000);
        },
      },
      productCode: {
        name: 'productCode',
        label: 'Mã/Tên sản phẩm',
        value: pr.values.productCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn Mã/Tên sản phẩm',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onGetProductAuto(inputValue, callback);
          }, 500);
        },
      },
      purposeStorage: {
        name: 'purposeStorage',
        label: 'Mục Đích Lưu Kho',
        component: SelectAutocomplete,
        placeholder: 'Tất Cả',
        searchable: true,
        options: formData.purposeStorage,
      },
      dateRemain: {
        name: 'dateRemain',
        label: 'Số Ngày Còn Hạn',
        component: InputControl,
        onChange: pr.handleChange,
      },
    };
  };

  render() {
    const { classes, formDefaultValues, formSubmittedValues } = this.props;

    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
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
              this.props.onFormSubmit({ ...values, pageIndex: 0 });
              formikActions.setSubmitting(false);
            }}
            onReset={(values, formikActions) => {
              formikActions.setValues({ ...formDefaultValues });
              this.props.onFormSubmit({ ...formDefaultValues });
            }}
            render={formik => {
              const formAttr = this.makeFormAttr(formik);
              this.formik = formik;
              return (
                <div className={classes.expansionContainer}>
                  <Expansion
                    title="I. Thông Tin Chung"
                    content={
                      <Form>
                        <Grid
                          container
                          spacing={24}
                          style={{ marginBottom: '-0.5rem' }}
                        >
                          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                            <Grid container>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.date} />
                              </Grid>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.plantCode} />
                              </Grid>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.locatorCode} />
                              </Grid>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.DateFromTo} />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item lg={6} md={6} sm={12} xs={12} xl={6}>
                            <Grid container>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.originCode} />
                              </Grid>
                              <Grid
                                item
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Grid container justify="space-between">
                                  <Grid
                                    style={{ paddingRight: 12 }}
                                    item
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                  >
                                    <Field {...formAttr.batchKey} />
                                  </Grid>
                                  <Grid
                                    style={{ paddingLeft: 12 }}
                                    item
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                  >
                                    <Field {...formAttr.uom} />
                                  </Grid>
                                  <Grid
                                    style={{ paddingRight: 12 }}
                                    item
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                  >
                                    <Field {...formAttr.warningClass} />
                                  </Grid>
                                  <Grid
                                    style={{ paddingLeft: 12 }}
                                    item
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                  >
                                    <Field {...formAttr.warningType} />
                                  </Grid>
                                  <Grid
                                    style={{ paddingRight: 12 }}
                                    item
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                  >
                                    <Field {...formAttr.purposeStorage} />
                                  </Grid>
                                  <Grid
                                    style={{ paddingLeft: 12 }}
                                    item
                                    xl={6}
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                  >
                                    <Field {...formAttr.dateRemain} />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                            <Grid container>
                              <Grid
                                item
                                style={{ height: 56 }}
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.productCode} />
                              </Grid>
                              <Grid
                                item
                                style={{ height: 56 }}
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.assessorCode} />
                              </Grid>
                              <Grid
                                item
                                style={{ height: 56 }}
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                              >
                                <Field {...formAttr.stocktakerCode} />
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
        </MuiThemeProvider>
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
    onFetchLocators: (formValues, plantCode) =>
      dispatch(actions.fetchLocators(formValues, plantCode)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onGetProductAuto: (inputText, callback) =>
      dispatch(actions.getProductAuto(inputText, callback)),
    onGetOriginAuto: (inputText, callback) =>
      dispatch(actions.getOriginAuto(inputText, callback)),
    onGetUoMAuto: (inputText, callback) =>
      dispatch(actions.getUoMAuto(inputText, callback)),
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
