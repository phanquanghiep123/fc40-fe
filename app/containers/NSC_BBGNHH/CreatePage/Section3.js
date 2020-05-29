import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { Field } from 'formik';

import Grid from '@material-ui/core/Grid';

import MuiInput from 'components/MuiInput';
import Expansion from 'components/Expansion';
import MuiSelectAsync from 'components/MuiSelect/Async';

import { leadtimeRoutine } from './routines';
import { getRouteAuto, getCustomerAuto } from './actions';

import WrapperBusiness from './Business';

import { CODE_FORM } from './constants';

export class Section3 extends React.Component {
  updateValues(updater) {
    this.props.formik.updateValues(updater);
  }

  onRouteChange = option => {
    const updaterData = {
      deliveryReceiptRouteCode: option.deliveryReceiptRouteCode,
      receiverAddress1: option.receiveAddress1,
      receiverContact1: option.contactInfo1,
      receiverAddress2: option.receiveAddress2,
      receiverContact2: option.contactInfo2,
    };
    const transportData = {
      vehicleRouteType: option.vehicleRouteCode,
    };

    this.props.formik.updateValues(updaterData);
    this.props.formik.updateFieldArrayValue(
      'deliveryReceiptTransports',
      0,
      transportData,
    );
  };

  onCustomerChange = option => {
    const updaterData = {
      customerCode: option.customerCode,
      customerName: option.customerName,
    };

    this.updateValues(updaterData);
    this.onGetLeadtime(option.customerCode);
  };

  onGetLeadtime = customerCode => {
    const { deliverCode } = this.props.formik.values;
    this.props.onGetLeadtime(deliverCode, customerCode);
  };

  render() {
    return (
      <Expansion
        title="III. Thông Tin Bên Nhận Hàng"
        content={
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item xs={12} md={6} lg={3}>
                  <WrapperBusiness code={CODE_FORM.KHACH_HANG}>
                    {({ disabled }) => (
                      <Field
                        name="customerName"
                        component={MuiSelectAsync}
                        showError
                        valueKey="customerName"
                        labelKey="customerName"
                        isDisabled={disabled}
                        promiseOptions={this.props.onGetCustomerAuto}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        TextFieldProps={{
                          label: 'Khách Hàng',
                          margin: 'dense',
                          required: true,
                        }}
                        onChange={this.onCustomerChange}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <Field
                    name="customerCode"
                    label="Mã Khách Hàng"
                    component={MuiInput}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <WrapperBusiness code={CODE_FORM.TUYEN_DUONG}>
              <Grid item xs={12}>
                <Grid container spacing={16}>
                  <Grid item xs={12} md={6} lg={3}>
                    <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                      {({ disabled }) => (
                        <Field
                          name="deliveryReceiptRouteCode"
                          component={MuiSelectAsync}
                          required
                          showError
                          valueKey="deliveryReceiptRouteCode"
                          labelKey="deliveryReceiptRouteCode"
                          isDisabled={disabled}
                          promiseOptions={this.props.onGetRouteAuto}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          TextFieldProps={{
                            label: 'Tuyến Đường',
                            margin: 'dense',
                            required: true,
                          }}
                          onChange={this.onRouteChange}
                        />
                      )}
                    </WrapperBusiness>
                  </Grid>
                </Grid>
              </Grid>
            </WrapperBusiness>
            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item xs={12} lg={6}>
                  <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                    {({ disabled }) => (
                      <Field
                        name="receiverAddress1"
                        label="Địa Chỉ Nhận Hàng"
                        component={MuiInput}
                        multiline
                        rowsMax={3}
                        disabled={disabled}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </WrapperBusiness>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                    {({ disabled }) => (
                      <Field
                        name="receiverContact1"
                        label="ĐT Liên Hệ"
                        component={MuiInput}
                        multiline
                        rowsMax={2}
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
            <WrapperBusiness code={CODE_FORM.DIA_CHI_NHAN_HANG}>
              <Grid item xs={12}>
                <Grid container spacing={16}>
                  <Grid item xs={12} lg={6}>
                    <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                      {({ disabled }) => (
                        <Field
                          name="receiverAddress2"
                          label="Địa Chỉ Nhận Hàng 2"
                          component={MuiInput}
                          multiline
                          rowsMax={3}
                          disabled={disabled}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    </WrapperBusiness>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <WrapperBusiness code={CODE_FORM.VIEW_BBGNHH}>
                      {({ disabled }) => (
                        <Field
                          name="receiverContact2"
                          label="ĐT Liên Hệ 2"
                          component={MuiInput}
                          multiline
                          rowsMax={2}
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
            </WrapperBusiness>
          </Grid>
        }
        unmountOnExit={false}
      />
    );
  }
}

Section3.propTypes = {
  formik: PropTypes.object,
  onGetLeadtime: PropTypes.func,
  onGetCustomerAuto: PropTypes.func,
  onGetRouteAuto: PropTypes.func,
};

export const mapDispatchToProps = dispatch => ({
  onGetLeadtime: (deliverCode, customerCode) =>
    dispatch(leadtimeRoutine.request({ deliverCode, customerCode })),
  onGetRouteAuto: (inputText, callback) =>
    dispatch(getRouteAuto(inputText, callback)),
  onGetCustomerAuto: (inputText, callback) =>
    dispatch(getCustomerAuto(inputText, callback)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(Section3);
