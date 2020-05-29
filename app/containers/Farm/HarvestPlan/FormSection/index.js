import React, { Component } from 'react';
import { Field, Form } from 'formik';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import { Grid } from '@material-ui/core';
import SelectAutocomplete from 'components/SelectAutocomplete';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import MuiButton from 'components/MuiButton';
import DatePickerControl from 'components/DatePickerControl';
import withImmutablePropsToJs from 'with-immutable-props-to-js';
import FormWrapper from 'components/FormikUI/FormWrapper';
import * as selectors from '../selectors';
import * as constants from '../constants';
import { validationSchema } from './schema';
class FormSection extends Component {
  componentDidMount() {
    this.props.onGetOrganizations();
  }

  handleSubmit = values => {
    this.props.onSubmit({ values });
  };

  resetForm = () => {
    this.props.onResetForm();
    setTimeout(() => {
      this.props.onSubmit({ values: this.props.formValues });
    }, 500);
  };

  render() {
    const { formValues } = this.props;
    const formAttr = formik => {
      let autoCompleteTimer;
      const { formData } = this.props;
      return {
        plantCode: {
          name: 'plantCode',
          label: 'Farm',
          component: SelectAutocomplete,
          options: formData.plantCodes,
          placeholder: 'Chọn Farm',
          onChangeSelectAutoComplete: selected => {
            if (selected === null) {
              formik.setFieldValue('plantCode', formData.plantCodes[0]);
            } else {
              formik.setFieldValue('plantCode', selected);
            }
            formik.setFieldValue('productionOrderCode', null);
          },
        },
        date: {
          name: 'date',
          label: 'Ngày Đi Hàng',
          component: DatePickerControl,
          value: formik.values.date,
          required: true,
        },
        planningCode: {
          name: 'planningCode',
          label: 'Mã/Tên Kế Hoạch',
          component: SelectAutocomplete,
          placeholder: 'Nhập mã/tên kế hoạch',
          isAsync: true,
          loadOptions: (inputValue, callback) => {
            clearTimeout(autoCompleteTimer); // clear previous timeout
            autoCompleteTimer = setTimeout(() => {
              this.props.onGetPlanCode({ inputValue, callback });
            }, 1000);
          },
          onChange: formik.handleChange,
        },
        planningName: {
          name: 'planningName',
          label: 'Tên Kế Hoạch',
          component: InputControl,
          onChange: formik.handleChange,
        },
        productionOrderCode: {
          name: 'productionOrderCode',
          label: 'Lệnh Sản Xuất',
          placeholder: 'Nhập lệnh sản xuất',
          component: SelectAutocomplete,
          loadOptions: (inputValue, callback) => {
            const { plantCode } = formik.values;
            clearTimeout(autoCompleteTimer); // clear previous timeout
            autoCompleteTimer = setTimeout(() => {
              this.props.onGetProductionOrders({
                inputValue,
                callback,
                plantCode,
              });
            }, 1000);
          },
          isAsync: true,
          onChange: formik.handleChange,
        },
      };
    };
    return (
      <Expansion
        title="I. Thông Tin Chung"
        content={
          <FormWrapper
            enableReinitialize
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={this.handleSubmit}
            onReset={this.resetForm}
            render={pr => (
              <Form>
                <Grid container spacing={24}>
                  <Grid item md={3}>
                    <Field {...formAttr(pr).plantCode} />
                  </Grid>
                  <Grid item md={3}>
                    <Field {...formAttr(pr).date} />
                  </Grid>
                  <Grid item md={3}>
                    <Field {...formAttr(pr).planningCode} />
                  </Grid>
                  <Grid item md={3}>
                    <Field {...formAttr(pr).planningName} />
                  </Grid>
                  <Grid item md={3}>
                    <Field {...formAttr(pr).productionOrderCode} />
                  </Grid>
                  <Grid item md={12}>
                    <Grid container spacing={24} justify="flex-end">
                      <Grid item>
                        <MuiButton outline onClick={pr.handleResetClick}>
                          Bỏ Lọc
                        </MuiButton>
                      </Grid>
                      <Grid item>
                        <MuiButton type="submit">Tìm Kiếm</MuiButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          />
        }
      />
    );
  }
}

FormSection.propTypes = {};

const mapStateToProps = createStructuredSelector({
  formData: selectors.formData(),
  formValues: selectors.formValues(),
});

const mapDispatchToProps = dispatch => ({
  onResetForm: () => dispatch({ type: constants.RESET_FORM }),
  onGetOrganizations: payload =>
    dispatch({ type: constants.GET_ORGANIZATION, payload }),
  onGetPlanCode: payload =>
    dispatch({ type: constants.GET_PLAN_CODE_OR_NAME, payload }),
  onGetProductionOrders: payload =>
    dispatch({ type: constants.GET_PRODUCTION_ORDERS, payload }),
  onSubmit: payload => dispatch({ type: constants.SUBMIT_FORM, payload }),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(
  withConnect,
  withImmutablePropsToJs,
)(FormSection);
