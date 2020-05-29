import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Field } from 'formik';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import Expansion from 'components/Expansion';
import MuiSelectAsync from 'components/MuiSelect/Async';

import DatePickerControl from 'components/PickersControl';
import ConfirmationDialog from 'components/ConfirmationDialog';

import { makeSelectData } from './selectors';
import { getDeliveryPersonAuto } from './actions';

import PXK from './PXK';
import WrapperBusiness from './Business';

import { CODE_FORM } from './constants';
import SelectAutocomplete from '../../../components/SelectAutocomplete';

export class Section2 extends React.Component {
  confirmationDialog = null;

  changeOrganization = event => {
    const option = this.props.organizations.find(
      item => item && item.value === event.value,
      // item => item && item.value === event.target.value,
    );
    this.props.formik.handleResetClick();

    this.props.formik.setFieldValue('createDate', new Date());
    this.props.formik.setFieldValue('deliverCode', option);
    this.props.formik.setFieldValue('deliverCode1', option.value);
    this.props.formik.setFieldValue('deliverName', option.name);
    this.props.formik.setFieldValue('deliveryDate', new Date());
    this.props.formik.setFieldValue(
      ['deliveryReceiptTransports', 0, 'actualDepartureDate'],
      new Date(),
    );
  };

  onOrganizationChange = event => {
    this.confirmationDialog.showConfirm({
      title: 'Cảnh báo',
      message:
        'Thông tin Biên Bản Giao Nhận Hàng Hóa vừa nhập sẽ không được lưu khi thay đổi Đơn vị.',
      actions: [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          color: 'primary',
          onClick: () => this.changeOrganization(event),
        },
      ],
    });
  };

  onDeliveryDateChange = deliveryDate => {
    const { deliverCode, deliverName } = this.props.formik.values;

    this.props.formik.handleResetClick();

    this.props.formik.setFieldValue('deliverCode', deliverCode);
    this.props.formik.setFieldValue('deliverName', deliverName);
    this.props.formik.setFieldValue('deliveryDate', deliveryDate);
  };

  onDeliveryPersonChange = option => {
    const updaterData = {
      deliveryPersonCode: option.Id,
      deliveryPersonName: option.fullName,
      deliveryPersonPhone: option.phoneNumber,
    };
    this.props.formik.updateValues(updaterData);
  };

  onGetDeliveryPersonAuto = (inputText, callback) => {
    const { deliverCode } = this.props.formik.values;
    this.props.onGetDeliveryPersonAuto(deliverCode, inputText, callback);
  };

  render() {
    const { ui, formik } = this.props;
    return (
      <Expansion
        title="II. Thông Tin Bên Giao Hàng"
        content={
          <Grid container spacing={16}>
            <Grid item xs={12} md={6} lg={3}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  {/* <WrapperBusiness code={CODE_FORM.NON_EDITABLE}> */}
                  {/* {({ disabled }) => ( */}
                  {/* <Field */}
                  {/* name="deliverCode" */}
                  {/* label="Farm/NSC" */}
                  {/* component={MuiInput} */}
                  {/* select */}
                  {/* options={this.props.organizations} */}
                  {/* valueKey="value" */}
                  {/* labelKey="name" */}
                  {/* required */}
                  {/* disabled={disabled} */}
                  {/* InputLabelProps={{ */}
                  {/* shrink: true, */}
                  {/* }} */}
                  {/* onInputChange={this.onOrganizationChange} */}
                  {/* /> */}
                  {/* )} */}
                  {/* </WrapperBusiness> */}
                  <WrapperBusiness code={CODE_FORM.NON_EDITABLE}>
                    {({ disabled }) => (
                      <Field
                        name="deliverCode"
                        label="Farm/NSC"
                        component={SelectAutocomplete}
                        options={this.props.organizations}
                        required
                        disabled={disabled}
                        onChangeSelectAutoComplete={this.onOrganizationChange}
                        isClearable={false}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="deliverCode1"
                    label="Mã Farm/NSC"
                    component={MuiInput}
                    disabled
                    showError={false}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                    {({ disabled }) => (
                      <Field
                        name="deliveryPersonName"
                        component={MuiSelectAsync}
                        valueKey="fullName"
                        labelKey="fullName"
                        showError
                        isDisabled={disabled}
                        promiseOptions={this.onGetDeliveryPersonAuto}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        TextFieldProps={{
                          label: 'Đại Diện Giao Hàng',
                          margin: 'dense',
                          required: true,
                        }}
                        onChange={this.onDeliveryPersonChange}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
                <Grid item xs={12}>
                  <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                    {({ disabled }) => (
                      <Field
                        name="deliveryPersonPhone"
                        label="Điện Thoại"
                        component={MuiInput}
                        disabled={disabled}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <WrapperBusiness code={CODE_FORM.NON_EDITABLE}>
                    {({ disabled }) => (
                      <Field
                        name="deliveryDate"
                        label="Ngày Giao"
                        component={DatePickerControl}
                        autoOk
                        required
                        disabled={disabled}
                        style={{
                          marginTop: 5,
                        }}
                        onChange={this.onDeliveryDateChange}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
              </Grid>
            </Grid>
            <WrapperBusiness code={CODE_FORM.PXK}>
              <PXK ui={ui} formik={formik} />
            </WrapperBusiness>
            <ConfirmationDialog
              ref={ref => {
                this.confirmationDialog = ref;
              }}
            />
          </Grid>
        }
        unmountOnExit={false}
      />
    );
  }
}

Section2.propTypes = {
  ui: PropTypes.object,
  formik: PropTypes.object,
  organizations: PropTypes.array,
  onGetDeliveryPersonAuto: PropTypes.func,
};

Section2.defaultProps = {
  organizations: [],
};

const mapStateToProps = createStructuredSelector({
  organizations: makeSelectData('master', 'organizations'),
});

export const mapDispatchToProps = dispatch => ({
  onGetDeliveryPersonAuto: (plantCode, inputText, callback) =>
    dispatch(getDeliveryPersonAuto(plantCode, inputText, callback)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
)(Section2);
