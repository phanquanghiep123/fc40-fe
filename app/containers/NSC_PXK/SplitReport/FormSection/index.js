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
import SelectControl from '../../../../components/SelectControl';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';
import Expansion from '../../../../components/Expansion';
import InputControl from '../../../../components/InputControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import DatePickerControl from '../../../../components/DatePickerControl';

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
          minWidth: 100,
        },
      },
    },
  });

export class FormSection extends React.Component {
  componentDidMount() {
    this.props.onFetchFormData(this.props.formDefaultValues);
  }

  /**
   * Make form field attributes
   * @param pr
   */
  makeFormAttr = pr => {
    const { formData, onFetchCustomer, onFetchPlan } = this.props;
    let autoCompleteTimer;

    return {
      org: {
        name: 'org',
        label: 'Đơn Vị Sơ Chế',
        component: SelectControl,
        value: pr.values.org,
        onChange: event => {
          pr.handleChange(event);
          // onFetchTableData(event.target.value);
          // resetFilters(pr);
        },
        children: formData.org.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      processDate: {
        name: 'processDate',
        label: 'Ngày Sơ Chế',
        component: DatePickerControl,
        value: pr.values.processDate,
        // onChange: pr.handleChange,
      },
      productName: {
        name: 'productName',
        label: 'Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.productName,
        onChange: pr.handleChange,
      },
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
      planningCode: {
        name: 'planningCode',
        label: 'Mã Kế Hoạch',
        component: SelectAutocomplete,
        value: pr.values.planningCode,
        onChange: pr.handleChange,
        placeholder: 'Nhập Mã Kế Hoạch',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchPlan(inputValue, fieldData => {
              if (fieldData && fieldData.length > 100) {
                callback(fieldData.slice(0, 100));
                return;
              }
              callback(fieldData);
            });
          }, 1000);
        },
      },
    };
  };

  render() {
    const { classes, formDefaultValues, onFormSubmit } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <Formik
          enableReinitialize
          initialValues={formDefaultValues}
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
                          <Field {...formAttr.org} />
                          <Field {...formAttr.processDate} />
                        </Grid>
                        <Grid item xs={8} md={4}>
                          <Field {...formAttr.customer} />
                          <Field {...formAttr.productName} />
                        </Grid>
                        <Grid item xs={8} md={4}>
                          <Field {...formAttr.planningCode} />
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
  // onUpdateFormData: PropTypes.func,
  onFetchCustomer: PropTypes.func,
  onFetchPlan: PropTypes.func,
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
    onFetchOrgList: () => dispatch(actions.fetchOrgList()),
    onFetchFormData: formValues => dispatch(actions.fetchFormData(formValues)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
    onUpdateTableData: tableData =>
      dispatch(actions.updateTableData(tableData)),
    onFetchCustomer: (inputValue, callback) =>
      dispatch(actions.fetchCustomer(inputValue, callback)),
    onFetchPlan: (inputValue, callback) =>
      dispatch(actions.fetchPlan(inputValue, callback)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(FormSection);
