import React, { Component } from 'react';
import { compose } from 'redux';
import * as PropTypes from 'prop-types';
import { startOfDay } from 'date-fns';
import {
  createMuiTheme,
  withStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik/dist/index';
import { Button, Grid, MenuItem } from '@material-ui/core';
import { createStructuredSelector } from 'reselect/lib/index';
import { connect } from 'react-redux';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import PeriodPicker from 'components/PeriodPicker';
import { withRouter } from 'react-router-dom';
import MuiSelectInput from 'components/MuiSelect/Input';
import Expansion from 'components/Expansion';
import InputControl from '../../../../components/InputControl';
import SelectControl from '../../../../components/SelectControl';
import SelectAutocomplete from '../../../../components/SelectAutocomplete';
import appTheme from '../../../App/theme';
import * as selectors from '../selectors';
import * as actions from '../actions';

const style = (theme = appTheme) => ({
  paper: {
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px ${theme
      .spacing.unit * 2}px`,
    marginBottom: theme.spacing.unit * 2,
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

export class FormSection extends Component {
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
      deliveryRecordNo: {
        name: 'deliveryRecordNo',
        label: 'Mã BBGH',
        component: InputControl,
        value: pr.values.deliveryRecordNo,
        onChange: pr.handleChange,
        autoFocus: true,
      },
      status: {
        name: 'status',
        label: 'Trạng Thái',
        component: SelectControl,
        value: pr.values.status,
        onChange: pr.handleChange,
        children: formData.status.map(item => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        )),
      },
      period: {
        name: 'dateComponent',
        label: 'Ngày Dự Kiến Đến',
        component: PeriodPicker,
        from: {
          name: 'expectedArrivalDateFrom',
          value: pr.values.expectedArrivalDateFrom,
        },
        to: {
          name: 'expectedArrivalDateTo',
          value: pr.values.expectedArrivalDateTo,
        },
      },
      org: {
        name: 'org',
        label: 'Đơn Vị',
        component: SelectAutocomplete,
        value: pr.values.org,
        options: formData.org,
        placeholder: 'Tất Cả',
        onChange: e => {
          pr.handleChange(e);
          if (pr.values.orgRole === 1) {
            const matchedOrg = formData.org.find(
              org => org.value.toString() === e.target.value.toString(),
            );
            pr.setFieldValue('deliveryOrg', matchedOrg, true);
            pr.setFieldValue('receiveOrg', null, true);
          }
          if (pr.values.orgRole === 2) {
            const matchedOrg = formData.org.find(
              org => org.value.toString() === e.target.value.toString(),
            );
            pr.setFieldValue('receiveOrg', matchedOrg, true);
            pr.setFieldValue('deliveryOrg', null, true);
          }
        },
      },
      orgRoles: {
        name: 'orgRole',
        TextFieldProps: {
          label: 'Vai Trò',
          margin: 'dense',
        },
        InputLabelProps: {
          shrink: true,
        },
        isSearchable: true,
        component: MuiSelectInput,
        value: pr.values.orgRole,
        options: formData.orgRole,
        onChange: selected => {
          pr.setFieldValue('orgRole', selected.value);
          if (selected.value === 0) {
            pr.setFieldValue('deliveryOrg', null, true);
            pr.setFieldValue('receiveOrg', null, true);
          }
          if (selected.value === 1) {
            const matchedOrg = formData.org.find(
              org => org.value.toString() === pr.values.org.toString(),
            );
            pr.setFieldValue('deliveryOrg', matchedOrg, true);
            pr.setFieldValue('receiveOrg', null, true);
          }
          if (selected.value === 2) {
            const matchedOrg = formData.org.find(
              org => org.value.toString() === pr.values.org.toString(),
            );
            pr.setFieldValue('receiveOrg', matchedOrg, true);
            pr.setFieldValue('deliveryOrg', null, true);
          }
        },
      },
      doType: {
        name: 'doType',
        TextFieldProps: {
          label: 'Loại BBGH',
          margin: 'dense',
        },
        InputLabelProps: {
          shrink: true,
        },
        isSearchable: true,
        component: MuiSelectInput,
        value: pr.values.doType,
        options: formData.doTypes,
      },
      deliveryOrg: {
        name: 'deliveryOrg',
        label: 'Đơn Vị Giao Hàng',
        value: pr.values.deliveryOrg,
        component: SelectAutocomplete,
        placeholder: 'Tất Cả',
        disabled: pr.values.orgRole === 1,
        isAsync: true,
        loadOptions: (inputValue, callback) => {
          clearTimeout(autoCompleteTimer); // clear previous timeout
          autoCompleteTimer = setTimeout(() => {
            onFetchDeliveryOrg(inputValue, data => {
              const maxResult = 100;
              if (data.length > maxResult) {
                callback(data.slice(0, maxResult));
                return;
              }
              callback(data);
            });
          }, 1000);
        },
      },
      receiveOrg: {
        name: 'receiveOrg',
        label: 'Đơn Vị Nhận Hàng',
        value: pr.values.receiveOrg,
        options: formData.receiveOrg,
        component: SelectAutocomplete,
        placeholder: 'Tất Cả',
        disabled: pr.values.orgRole === 2,
      },
      productionOrder: {
        name: 'productionOrder',
        label: 'Lệnh Sản Xuất',
        component: InputControl,
        value: pr.values.productionOrder,
        onChange: pr.handleChange,
      },
      filterProduct: {
        name: 'filterProduct',
        label: 'Mã/Tên Sản Phẩm',
        component: InputControl,
        value: pr.values.filterProduct,
        onChange: pr.handleChange,
      },
      drivingPlate: {
        name: 'drivingPlate',
        label: 'Biển Số Xe',
        component: InputControl,
        value: pr.values.drivingPlate,
        onChange: pr.handleChange,
      },
      filterDocument: {
        name: 'filterDocument',
        label: 'Phiếu Xuất/Nhập Khay Sọt - Hàng Hóa',
        component: InputControl,
        value: pr.values.filterDocument,
        onChange: pr.handleChange,
      },
    };
  };

  render() {
    const {
      classes,
      formDefaultValues,
      formIsSubmitted,
      formSubmittedValues,
      onFormSubmit,
    } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Expansion
          title="I.Thông Tin Chung"
          content={
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
                  values.expectedArrivalDateTo !== '' &&
                  startOfDay(values.expectedArrivalDateFrom).getTime() >
                    startOfDay(values.expectedArrivalDateTo).getTime()
                ) {
                  errors.dateComponent =
                    'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
                }
                return errors;
              }}
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
                  <Form>
                    <Grid
                      container
                      spacing={40}
                      style={{ marginBottom: '-.5rem' }}
                    >
                      <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                        <Field {...formAttr.deliveryRecordNo} />
                        <Field {...formAttr.productionOrder} />
                        <Field {...formAttr.status} />
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                        <Field {...formAttr.period} />
                        <Field {...formAttr.filterProduct} />
                        <Field {...formAttr.drivingPlate} />
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                        <Field {...formAttr.org} />
                        <Field {...formAttr.orgRoles} />
                        <Field {...formAttr.doType} />
                      </Grid>
                      <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                        <Field {...formAttr.deliveryOrg} />
                        <Field {...formAttr.receiveOrg} />
                        <Field {...formAttr.filterDocument} />
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
          }
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
  onFetchDeliveryOrg: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formDefaultValues: selectors.formDefaultValues(),
  formSubmittedValues: selectors.formSubmittedValues(),
  formIsSubmitted: selectors.formIsSubmitted(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFetchFormData: (formValues, fetchNew = true) =>
      dispatch(actions.fetchFormData(formValues, fetchNew)),
    onFetchDeliveryOrg: (inputValue, callback) =>
      dispatch(actions.fetchDeliveryOrg(inputValue, callback)),
    onFormSubmit: formValues => dispatch(actions.submitForm(formValues)),
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
