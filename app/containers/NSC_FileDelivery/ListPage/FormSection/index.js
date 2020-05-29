import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Field, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Grid,
  MenuItem,
  Button,
} from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withRouter } from 'react-router-dom';
import SelectControl from '../../../../components/SelectControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Expansion from '../../../../components/Expansion';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import DatePickerControl from '../../../../components/DatePickerControl';
import InputControl from '../../../../components/InputControl';

const styles = theme => ({
  expansionContainer: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    height: '100%',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& :not(:last-child)': {
      marginRight: theme.spacing.unit * 3,
    },
  },
  btn: {
    margin: 'unset',
  },
  resetBtn: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    marginRight: theme.spacing.unit * 2,
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiButton: {
        label: {
          margin: '0 !important',
          padding: `${theme.spacing.unit / 3}px ${theme.spacing.unit * 3}px`,
          minWidth: 100,
        },
      },
    },
  });

export class FormSection extends React.Component {
  componentDidMount() {
    const {
      onFetchFormData,
      formDefaultValues,
      formSubmittedValues,
      formIsSubmitted,
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
    const {
      formData,
      onFetchCustomer,
      onFetchProduct,
      onFetchFarmNCC,
    } = this.props;
    let autoCompleteTimer;
    return {
      customer: {
        name: 'customer',
        label: 'Khách Hàng',
        component: SelectAutocomplete,
        value: pr.values.customer,
        onChange: pr.handleChange,
        placeholder: 'Tìm và chọn khách hàng',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchCustomer(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      plantCode: {
        name: 'plantCode',
        label: 'Đơn Vị',
        component: SelectControl,
        value: pr.values.plantCode,
        onChange: event => {
          pr.handleChange(event);
        },
        children: formData.plantCode.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      processDate: {
        name: 'processDate',
        label: 'Ngày Chia Chọn',
        component: DatePickerControl,
        value: pr.values.processDate,
        // onChange: pr.handleChange,
      },
      productCode: {
        name: 'productCode',
        label: 'Mã Sản Phẩm',
        component: SelectAutocomplete,
        value: pr.values.productCode,
        onChange: pr.handleChange,
        placeholder: 'Tìm và chọn mã sản phẩm',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchProduct(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      farmNCC: {
        name: 'farmNCC',
        label: 'Mã Farm/NCC',
        component: SelectAutocomplete,
        value: pr.values.farmNCC,
        onChange: pr.handleChange,
        placeholder: 'Tìm và chọn Farm/NCC',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchFarmNCC(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      productName: {
        name: 'productName',
        label: 'Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.productName,
        onChange: pr.handleChange,
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      onFormSubmit,
      formIsSubmitted,
      formSubmittedValues,
    } = this.props;
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Formik
          enableReinitialize
          initialValues={
            formIsSubmitted && formSubmittedValues
              ? formSubmittedValues
              : formDefaultValues
          }
          onSubmit={(values, formikActions) => {
            onFormSubmit(values);
            formikActions.setSubmitting(false);
          }}
          onReset={(values, formikActions) => {
            formikActions.setValues({ ...formDefaultValues });
            onFormSubmit({ ...formDefaultValues });
          }}
          render={pr => {
            const formAttr = this.makeFormAttr(pr);
            return (
              <div className={classes.expansionContainer}>
                <Expansion
                  title="I. Thông Tin Chung"
                  content={
                    <Form>
                      <Grid container spacing={24}>
                        <Grid item xs={8} md={4}>
                          <Field {...formAttr.plantCode} />
                          <Field {...formAttr.productCode} />
                        </Grid>
                        <Grid item xs={8} md={4}>
                          <Field {...formAttr.customer} />
                          <Field {...formAttr.productName} />
                        </Grid>
                        <Grid item xs={8} md={4}>
                          <Field {...formAttr.processDate} />
                          <Field {...formAttr.farmNCC} />
                        </Grid>
                      </Grid>
                      <Grid container spacing={40}>
                        <Grid item xs={12}>
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
                              className={classes.btn}
                              type="submit"
                              variant="contained"
                              color="primary"
                              onClick={pr.handleSubmit}
                            >
                              Tìm kiếm
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
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
  classes: PropTypes.object,
  formData: PropTypes.object,
  formDefaultValues: PropTypes.object,
  tableData: PropTypes.array,
  onFormSubmit: PropTypes.func,
  onUpdateTableData: PropTypes.func,
  onFetchFormData: PropTypes.func,
  onFetchCustomer: PropTypes.func,
  onFetchProduct: PropTypes.func,
  onFetchFarmNCC: PropTypes.func,
  // onUpdateFormData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
  tableData: selectors.tableData(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onFetchCustomer: (inputValue, callback) =>
      dispatch(actions.fetchCustomer(inputValue, callback)),
    onFetchProduct: (inputValue, callback) =>
      dispatch(actions.fetchProduct(inputValue, callback)),
    onFetchFarmNCC: (inputValue, callback) =>
      dispatch(actions.fetchFarmNCC(inputValue, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withRouter,
  withStyles(styles),
)(FormSection);
