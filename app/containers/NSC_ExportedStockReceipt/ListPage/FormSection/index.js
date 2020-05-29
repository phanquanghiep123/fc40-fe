import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik/dist/index';
import {
  Paper,
  MenuItem,
  Grid,
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Button,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import { startOfDay } from 'date-fns';
import { withRouter } from 'react-router-dom';
import PeriodPicker from '../../../../components/PeriodPicker';
import InputControl from '../../../../components/InputControl';
import SelectControl from '../../../../components/SelectControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import appTheme from '../../../App/theme';
import * as makeSelect from '../selectors';
import * as actions from '../actions';
// import { demoFormData } from '../demoData';

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
      padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 3}px`,
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
    const { formData, onFetchReceiverOrg } = this.props;
    let autoCompleteTimer;

    return {
      deliverCode: {
        name: 'deliverCode',
        label: 'Đơn Vị Xuất Hàng',
        value: pr.values.deliverCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        // children: formData.deliverCode.map(item => (
        //   <MenuItem key={item.value} value={item.value}>
        //     {item.label}
        //   </MenuItem>
        // )),
        options: formData.deliverCode,
        placeholder: 'Tất Cả',
      },
      expStockRecptCode: {
        name: 'expStockRecptCode',
        label: 'Mã Phiếu Xuất Kho',
        value: pr.values.expStockRecptCode,
        onChange: pr.handleChange,
        component: InputControl,
        autoFocus: true,
      },
      exportType: {
        name: 'exportType',
        label: 'Loại Xuất Kho',
        value: pr.values.exportType,
        onChange: event => {
          pr.handleChange(event);
          const selectedValues = event.target.value;
          const itemAll = formData.exportType[0]; // the first item in dropdown
          const newlyAddedValue = selectedValues[selectedValues.length - 1];

          /**
           * if newly added item is "Tất cả" => only select "Tất cả"
           * if NOT "Tất cả" => uncheck item "Tất cả"
           */
          if (newlyAddedValue === itemAll.value) {
            pr.setFieldValue('exportType', [newlyAddedValue]);
          } else {
            const updatedValues = selectedValues.filter(
              value => itemAll.value !== value,
            );
            pr.setFieldValue('exportType', updatedValues);
          }
        },
        multiple: true,
        component: SelectControl,
        renderValue: selectedValues => {
          const selectedItems = formData.exportType.filter(item =>
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
        children: formData.exportType.map(item => (
          <MenuItem key={item.value} value={item.value}>
            <Checkbox checked={pr.values.exportType.includes(item.value)} />
            <ListItemText primary={item.label} />
          </MenuItem>
        )),
      },
      receiverCode: {
        name: 'receiverCode',
        label: 'Đơn Vị Nhận Hàng',
        value: pr.values.receiverCode,
        onChange: pr.handleChange,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn đơn vị',
        // options: formData.receiverCode,
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchReceiverOrg(inputValue, fieldData => {
              callback(fieldData);
            });
          }, 1000);
        },
      },
      period: {
        name: 'dateComponent',
        label: 'Ngày Xuất Kho',
        component: PeriodPicker,
        from: {
          name: 'exportedDateFrom',
          value: pr.values.exportedDateFrom,
        },
        to: {
          name: 'exportedDateTo',
          value: pr.values.exportedDateTo,
        },
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
      filterProduct: {
        name: 'filterProduct',
        label: 'Mã/Tên/Batch Sản Phẩm',
        value: pr.values.filterProduct,
        onChange: pr.handleChange,
        component: InputControl,
        autoFocus: true,
      },
      user: {
        name: 'user',
        label: 'Người Xuất Kho',
        value: pr.values.user,
        component: SelectAutocomplete,
        placeholder: 'Tìm và chọn người xuất kho',
        options: formData.users,
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
                values.exportedDateTo !== '' &&
                startOfDay(values.exportedDateFrom).getTime() >
                  startOfDay(values.exportedDateTo).getTime()
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
                    <Grid item xs={3}>
                      <Field {...formAttr.expStockRecptCode} />
                      <Field {...formAttr.exportType} />
                      <Field {...formAttr.user} />
                    </Grid>
                    <Grid item xs={3}>
                      <Field {...formAttr.status} />
                      <Field {...formAttr.filterProduct} />
                    </Grid>
                    <Grid className={classes.gridDate} item xs={3}>
                      <Field {...formAttr.period} />
                    </Grid>
                    <Grid item xs={3}>
                      <Field {...formAttr.deliverCode} />
                      <Field {...formAttr.orgCodes} />
                      <Field {...formAttr.receiverCode} />
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
  onFetchReceiverOrg: PropTypes.func,
  onGetUsers: PropTypes.func,
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
    onFetchReceiverOrg: (inputValue, callback) =>
      dispatch(actions.fetchReceiverOrg(inputValue, callback)),
    onSubmitForm: formValues => dispatch(actions.submitForm(formValues)),
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
