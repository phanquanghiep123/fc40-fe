import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field } from 'formik';
import { createStructuredSelector } from 'reselect';
import {
  withStyles,
  Grid,
  Hidden,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/DatePickerControl';
import SelectAutocomplete from 'components/SelectAutocomplete';
import Expansion from 'components/Expansion';
import MuiButton from 'components/MuiButton';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import { FETCH_FARM_NCC, FETCH_PRODUCT, FETCH_PLANNING } from '../constants';

const styles = (theme = appTheme) => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
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

export class FormSection extends React.Component {
  /**
   * Make form field attributes
   */
  makeFormAttr = () => {
    const {
      formData,
      formik,
      onFetchCustomerAutocomplete,
      onFetchProduct,
      onFetchFarmNCC,
      onFetchPlanning,
    } = this.props;
    let autoCompleteTimer;

    return {
      org: {
        name: 'org',
        label: 'Đơn Vị Sơ Chế',
        component: SelectAutocomplete,
        value: formik.values.org,
        required: true,
        onChange: formik.handleChange,
        placeholder: 'Tìm và chọn đơn vị sơ chế',
        afterHandleChange: selected => {
          if (
            selected !== null &&
            Object.keys(formData.mappingValues).includes(selected.value)
          ) {
            formik.setFieldValue(
              'customer',
              formData.mappingValues[selected.value],
            );
          }
        },
        options: formData.org,
      },
      date: {
        name: 'date',
        label: 'Ngày Sơ Chế',
        required: true,
        component: DatePickerControl,
        value: formik.values.date,
        clearable: false,
      },
      customer: {
        name: 'customer',
        label: 'Khách Hàng',
        required: true,
        component: SelectAutocomplete,
        value: formik.values.customer,
        onChange: formik.handleChange,
        placeholder: 'Tìm và chọn khách hàng',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchCustomerAutocomplete(inputValue, fieldData => {
              if (fieldData && fieldData.length > 100) {
                callback(fieldData.slice(0, 100));
                return;
              }
              callback(fieldData);
            });
          }, 500);
        },
      },
      productCode: {
        name: 'productCode',
        label: 'Mã Sản Phẩm',
        component: SelectAutocomplete,
        value: formik.values.productCode,
        onChange: formik.handleChange,
        placeholder: 'Tìm và chọn mã sản phẩm',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchProduct({
              inputValue,
              callback: fieldData => {
                callback(fieldData);
              },
            });
          }, 1000);
        },
      },
      planningCode: {
        name: 'planningCode',
        label: 'Mã Kế Hoạch',
        component: SelectAutocomplete,
        value: formik.values.planningCode,
        onChange: formik.handleChange,
        placeholder: 'Tìm và chọn mã kế hoạch',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchPlanning({
              inputValue,
              callback: fieldData => {
                callback(fieldData);
              },
            });
          }, 1000);
        },
      },
      productName: {
        name: 'productName',
        label: 'Tên Sản Phẩm',
        component: InputControl,
        value: formik.values.productName,
        onChange: formik.handleChange,
      },
      planningName: {
        name: 'planningName',
        label: 'Tên Kế Hoạch',
        component: InputControl,
        value: formik.values.planningName,
        onChange: formik.handleChange,
      },
      vendorCode: {
        name: 'vendorCode',
        label: 'Mã Farm/NCC',
        component: SelectAutocomplete,
        value: formik.values.vendorCode,
        onChange: formik.handleChange,
        placeholder: 'Tìm và chọn Farm/NCC',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchFarmNCC({
              inputValue,
              callback: fieldData => {
                callback(fieldData);
              },
            });
          }, 1000);
        },
      },
    };
  };

  render() {
    const { classes, formik } = this.props;
    const formAttr = this.makeFormAttr();

    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className={classes.expansionContainer}>
          <Expansion
            title="I. THÔNG TIN CHUNG"
            content={
              <React.Fragment>
                <Grid container spacing={24}>
                  <Grid item xs={6} md={3}>
                    <Field {...formAttr.org} />
                    <Hidden mdUp>
                      <Field {...formAttr.date} />
                    </Hidden>
                  </Grid>
                  <Hidden smDown>
                    <Grid item xs={6} md={3}>
                      <Field {...formAttr.date} />
                    </Grid>
                  </Hidden>
                  <Grid item xs={6} md={3}>
                    <Field {...formAttr.customer} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Field {...formAttr.vendorCode} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Field {...formAttr.productCode} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Field {...formAttr.productName} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Field {...formAttr.planningCode} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Field {...formAttr.planningName} />
                  </Grid>
                </Grid>
                <Grid container spacing={16} justify="flex-end">
                  <Grid item>
                    <MuiButton outline onClick={formik.handleReset}>
                      Bỏ Lọc
                    </MuiButton>
                  </Grid>
                  <Grid item>
                    <MuiButton
                      onClick={() => {
                        formik
                          .validateForm({
                            ...formik.values,
                            isCreatingReceipt: false,
                          })
                          .then(res => {
                            if (Object.keys(res).length) {
                              formik.setFieldValue('isCreatingReceipt', false);
                              const touched = {};
                              Object.keys(res).forEach(key => {
                                touched[key] = true;
                              });
                              formik.setTouched(touched);
                            } else {
                              formik.submitForm();
                            }
                          });
                      }}
                    >
                      Tìm kiếm
                    </MuiButton>
                  </Grid>
                </Grid>
              </React.Fragment>
            }
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

FormSection.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
  formData: PropTypes.object,
  onFetchCustomerAutocomplete: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onFetchCustomerAutocomplete: (inputValue, callback) =>
      dispatch(actions.fetchCustomerAutocomplete(inputValue, callback)),
    onFetchProduct: payload => dispatch({ type: FETCH_PRODUCT, payload }),
    onFetchFarmNCC: payload => dispatch({ type: FETCH_FARM_NCC, payload }),
    onFetchPlanning: payload => dispatch({ type: FETCH_PLANNING, payload }),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles()),
)(FormSection);
