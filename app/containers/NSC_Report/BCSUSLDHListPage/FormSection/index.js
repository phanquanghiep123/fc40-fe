import React from 'react';
import { startOfDay } from 'date-fns';
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
import InputControl from '../../../../components/InputControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import PeriodPicker from '../../../../components/PeriodPicker';
import MuiSelectAsync from '../../../../components/MuiSelect/Async';

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
      ...theme.overrides,
      MuiButton: {
        label: {
          margin: '0 !important',
          padding: `${theme.spacing.unit / 3}px ${theme.spacing.unit * 3}px`,
          minWidth: 100,
        },
      },
      MuiSelectInput: {
        valueContainer: {
          height: 32,
        },
      },
      MuiChip: {
        root: {
          height: 26,
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
    const { formData, onFetchProduct } = this.props;
    let loadAutoCompleteTimer;
    return {
      deliverName: {
        name: 'deliverName',
        label: 'Tên NCC',
        component: InputControl,
        value: pr.values.deliverName,
        onChange: pr.handleChange,
      },
      productName: {
        name: 'productName',
        label: 'Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.productName,
        onChange: pr.handleChange,
      },
      productCode: {
        name: 'productCode',
        label: 'Mã Sản Phẩm',
        component: SelectAutocomplete,
        value: pr.values.productCode,
        onChange: pr.handleChange,
        placeholder: 'Tìm và chọn Mã Sản Phẩm',
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(loadAutoCompleteTimer); // clear previous timeout
          loadAutoCompleteTimer = setTimeout(() => {
            onFetchProduct(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      org: {
        name: 'org',
        label: 'Đơn Vị Nhận Hàng',
        component: SelectControl,
        value: pr.values.org,
        onChange: event => {
          pr.handleChange(event);
        },
        children: formData.org.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      period: {
        name: 'dateComponent',
        label: 'Ngày Giao Hàng',
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
      onFetchDeliver,
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
          validate={values => {
            const errors = {};
            if (
              values.deliveryDateTo !== '' &&
              startOfDay(values.importedDateFrom).getTime() >
                startOfDay(values.importedDateTo).getTime()
            ) {
              errors.dateComponent =
                'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
            }
            return errors;
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
                          <Field
                            name="deliverCodes"
                            placeholder="Tìm và chọn Mã NCC"
                            label="Mã NCC"
                            component={MuiSelectAsync}
                            valueKey="value"
                            labelKey="label"
                            sublabelKey="label"
                            isMulti
                            isMultiline
                            promiseOptions={(inputValue, callback) => {
                              let loadAutoCompleteTimer;
                              const receiverCode = pr.values.org || null;
                              clearTimeout(loadAutoCompleteTimer); // clear previous timeout
                              loadAutoCompleteTimer = setTimeout(() => {
                                onFetchDeliver(
                                  inputValue,
                                  receiverCode,
                                  fieldData => {
                                    callback(fieldData);
                                  },
                                );
                              }, 1000);
                            }}
                          />
                        </Grid>
                        <Grid item xs={8} md={4}>
                          <Field {...formAttr.period} />
                          <Field {...formAttr.deliverName} />
                        </Grid>
                        <Grid item xs={8} md={4}>
                          <Field {...formAttr.productCode} />
                          <Field {...formAttr.productName} />
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
  onFetchProduct: PropTypes.func,
  onFetchDeliver: PropTypes.func,
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
    onFetchDeliver: (inputValue, receiverCode, callback) =>
      dispatch(actions.fetchDeliver(inputValue, receiverCode, callback)),
    onFetchProduct: (inputValue, callback) =>
      dispatch(actions.fetchProduct(inputValue, callback)),
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
