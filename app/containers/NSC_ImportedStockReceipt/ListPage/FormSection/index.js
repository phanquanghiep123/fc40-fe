import PeriodPicker from 'components/PeriodPicker';
import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { startOfDay } from 'date-fns';
import { Field, Form, Formik } from 'formik/dist/index';
import {
  Paper,
  MenuItem,
  Grid,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Button,
  ListItemText,
  Checkbox,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import InputControl from '../../../../components/InputControl';
import SelectControl from '../../../../components/SelectControl';
import DatePickerControl from '../../../../components/DatePickerControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import appTheme from '../../../App/theme';
import * as makeSelect from '../selectors';
import * as actions from '../actions';

const style = (theme = appTheme) => ({
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 3,
  },
  btnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0',
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
  },
});

const theme = createMuiTheme({
  ...appTheme,
  overrides: {
    MuiGrid: {
      item: {
        paddingTop: '0 !important',
        maxWidth: 'unset',
      },
    },
  },
});

class FormSection extends Component {
  componentDidMount() {
    const {
      formDefaultValues,
      formIsSubmitted,
      formSubmittedValues,
      onFetchFormData,
      history,
    } = this.props;

    const isReset = history.location.state && history.location.state.isFromMenu;
    history.replace(history.location.pathname, {
      ...history.location.state,
      isFromMenu: false,
    });

    if (formIsSubmitted && !isReset) {
      onFetchFormData(formSubmittedValues, false);
    } else {
      onFetchFormData(formDefaultValues);
    }
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const { formData, onFetchDeliveryOrg } = this.props;
    let autoCompleteTimer;

    return {
      // receiverOrgCode: {
      //   name: 'receiverOrgCode',
      //   label: 'Đơn Vị Nhận Hàng',
      //   value: pr.values.receiverOrgCode,
      //   onChange: pr.handleChange,
      //   component: SelectControl,
      //   children: formData.receiverOrgCode.map(item => (
      //     <MenuItem key={item.value} value={item.value}>
      //       {item.label}
      //     </MenuItem>
      //   )),
      // },
      receiverOrgCode: {
        name: 'receiverOrgCode',
        label: 'Đơn Vị Nhận Hàng',
        value: pr.values.receiverOrgCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        options: formData.receiverOrgCode,
        placeholder: 'Tất Cả',
      },
      impStockRecptCode: {
        name: 'impStockRecptCode',
        label: 'Mã Phiếu Nhập Kho',
        value: pr.values.impStockRecptCode,
        onChange: pr.handleChange,
        component: InputControl,
        autoFocus: true,
      },
      weighingStaff: {
        name: 'weighingStaff',
        label: 'Nhân Viên Cân Hàng',
        component: SelectAutocomplete,
        value: pr.values.weighingStaff,
        onChange: pr.handleChange,
        placeholder: 'Tìm và chọn nhân viên',
        options: formData.weighingStaffs,
      },
      filterProduct: {
        name: 'filterProduct',
        label: 'Mã/Tên/Batch Sản Phẩm',
        value: pr.values.filterProduct,
        onChange: pr.handleChange,
        component: InputControl,
      },
      importType: {
        name: 'importType',
        label: 'Loại Nhập Kho',
        value: pr.values.importType,
        onChange: event => {
          pr.handleChange(event);
          const selectedValues = event.target.value;
          const itemAll = formData.importType[0]; // the first item in dropdown
          const newlyAddedValue = selectedValues[selectedValues.length - 1];

          /**
           * if newly added item is "Tất cả" => only select "Tất cả"
           * if NOT "Tất cả" => uncheck item "Tất cả"
           */
          if (newlyAddedValue === itemAll.value) {
            pr.setFieldValue('importType', [newlyAddedValue]);
          } else {
            const updatedValues = selectedValues.filter(
              value => itemAll.value !== value,
            );
            pr.setFieldValue('importType', updatedValues);
          }
        },
        multiple: true,
        component: SelectControl,
        renderValue: selectedValues => {
          const selectedItems = formData.importType.filter(item =>
            selectedValues.includes(item.value),
          );

          if (selectedItems.length > 0) {
            return selectedItems.reduce((prev, curr) => {
              if (prev === '') {
                return curr.label || curr;
              }
              return `${prev}, ${curr.label || curr}`;
            }, '');
          }

          return '';
        },
        children: formData.importType.map(item => (
          <MenuItem key={item.value} value={item.value}>
            <Checkbox checked={pr.values.importType.includes(item.value)} />
            <ListItemText primary={item.label} />
          </MenuItem>
        )),
      },
      doCode: {
        name: 'doCode',
        label: 'Mã BBGH',
        value: pr.values.doCode,
        onChange: pr.handleChange,
        component: InputControl,
      },
      deliverOrgCode: {
        name: 'deliverOrgCode',
        label: 'Đơn Vị Giao Hàng',
        value: pr.values.deliverOrgCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn đơn vị',
        // options: formData.deliverOrgCode,
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchDeliveryOrg(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      importedDateFrom: {
        name: 'importedDateFrom',
        label: 'Ngày Nhập Kho',
        value: pr.values.importedDateFrom,
        component: DatePickerControl,
      },
      importedDateTo: {
        name: 'importedDateTo',
        label: ' ',
        value: pr.values.importedDateTo,
        component: DatePickerControl,
      },
      status: {
        name: 'status',
        label: 'Trạng Thái',
        value: pr.values.status,
        onChange: pr.handleChange,
        component: SelectControl,
        children: formData.status.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      orgCodes: {
        name: 'orgCodes',
        value: pr.values.orgCodes,
        onChange: pr.handleChange,
        component: InputControl,
        style: {
          display: 'none',
        },
      },
      period: {
        name: 'dateComponent',
        label: 'Ngày Nhập Kho',
        component: PeriodPicker,
        from: {
          name: 'importedDateFrom',
          value: pr.values.importedDateFrom,
        },
        to: {
          name: 'importedDateTo',
          value: pr.values.importedDateTo,
        },
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      formIsSubmitted,
      formSubmittedValues,
      onSubmitForm,
    } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <Formik
            enableReinitialize
            initialValues={
              formIsSubmitted && formSubmittedValues
                ? formSubmittedValues
                : formDefaultValues
            }
            validate={values => {
              const errors = {};
              if (
                values.importedDateTo !== '' &&
                startOfDay(values.importedDateFrom).getTime() >
                  startOfDay(values.importedDateTo).getTime()
              ) {
                errors.dateComponent =
                  'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
              }
              return errors;
            }}
            onSubmit={(values, formikActions) => {
              onSubmitForm(values);
              formikActions.setSubmitting(false);
            }}
            onReset={(values, formikActions) => {
              formikActions.setValues({ ...formDefaultValues });
              onSubmitForm({ ...formDefaultValues });
            }}
            render={pr => {
              const formAttr = this.makeFormAttr(pr);
              return (
                <Form>
                  <Grid
                    container
                    spacing={40}
                    style={{ marginBottom: '-0.5rem' }}
                  >
                    <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                      <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.impStockRecptCode} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.importType} />
                        </Grid>{' '}
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.weighingStaff} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                      <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.period} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.status} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.filterProduct} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                      <Grid container>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.deliverOrgCode} />
                        </Grid>
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                          <Field {...formAttr.receiverOrgCode} />
                          <Field {...formAttr.orgCodes} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                      <Grid container>
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
                      onClick={pr.handleReset}
                      className={classes.resetBtn}
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
              );
            }}
          />
        </Paper>
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  formIsSubmitted: PropTypes.bool,
  formSubmittedValues: PropTypes.object,
  onFetchFormData: PropTypes.func,
  onSubmitForm: PropTypes.func,
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
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
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
