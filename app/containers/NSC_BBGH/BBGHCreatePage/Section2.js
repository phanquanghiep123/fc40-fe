import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectedUnit } from './selectors';
import { TYPE_BBGH } from './constants';

/* eslint-disable react/prefer-stateless-function */
export class DeliveryPartyInformation extends React.Component {
  getDeliverPresentorAuto = (inputText, callback) => {
    const { formik } = this.props;
    this.props.onGetUsersAuto(inputText, formik.values.deliverCode, callback);
  };

  handleAutoChangedDelivedPresentor = options => {
    this.props.formik.setFieldValue('deliveryPersonCode', options.value);
  };

  handleAutoChangeDeliver = options => {
    // {"label":"Farm example 3","value":1002}
    this.props.formik.setFieldValue('deliverCode', options.value);
    if (this.props.formik.values.doType === TYPE_BBGH.NCC_TO_NSC) {
      this.props.formik.setFieldValue(
        'deliveryPersonPhone',
        options.phone || '',
      );
      this.props.formik.setFieldValue(
        'deliveryPersonName',
        options.representativeName || '',
      );
      this.props.formik.setFieldValue(
        'deliveryPersonCode',
        options.deliveryPersonCode || '',
      );
    }
  };

  handleBlur = (e, formik) => {
    this.props.formik.setFieldValue(
      'deliveryPersonName',
      e.target.value || formik.values.deliveryPersonName,
    );

    if (e.target.value) {
      this.props.formik.setFieldValue('deliveryPersonCode', '');
    }
  };

  render() {
    const {
      classes,
      formik,
      loginInfor,
      onGetFarmNSCAutocomplete,
      typeBBGHSelected,
    } = this.props;

    const isNCCtoNSC = typeBBGHSelected === TYPE_BBGH.NCC_TO_NSC;

    return (
      <Expansion
        title="II. Thông Tin Bên Giao Hàng"
        content={
          <Grid container justify="space-between">
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {isNCCtoNSC ? (
                <Field
                  name="deliveryName"
                  component={InputControl}
                  textFieldProps={{
                    label: 'NCC',
                    InputLabelProps: {
                      shrink: true,
                    },
                    required: true,
                  }}
                  placeholder=""
                  promiseOptions={onGetFarmNSCAutocomplete}
                  onInputChange={this.handleAutoChangeDeliver}
                  autoComplete
                />
              ) : (
                <Field
                  name="doWorkingUnitName"
                  label="Farm/NSC"
                  required
                  disabled
                  component={InputControl}
                  onChange={formik.handleChange}
                />
              )}
              <Field
                name="deliverCode"
                label={isNCCtoNSC ? 'Đơn Vị' : 'Mã Farm/NSC'}
                required
                disabled
                component={InputControl}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <Field
                name="deliveryPersonName"
                component={InputControl}
                textFieldProps={{
                  label: 'Đại Diện Giao Hàng',
                  InputLabelProps: {
                    shrink: true,
                  },
                  required: true,
                }}
                placeholder={formik.values.deliveryPersonName}
                options={[
                  {
                    value: loginInfor.nameUserLogin,
                    label: loginInfor.nameUserLogin,
                  },
                ]}
                onInputChange={this.handleAutoChangedDelivedPresentor}
                promiseOptions={this.getDeliverPresentorAuto}
                autoComplete
                onBlur={e => this.handleBlur(e, formik)}
              />
              <Field
                name="deliveryPersonPhone"
                label="Điện Thoại"
                component={InputControl}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <Field
                name="deliveryDateTime"
                label="Ngày Giao"
                component={DatePickerControl}
                required
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group} />
          </Grid>
        }
      />
    );
  }
}

DeliveryPartyInformation.propTypes = {
  classes: PropTypes.object.isRequired,
  // get user auto complete
  onGetUsersAuto: PropTypes.func,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
  loginInfor: PropTypes.object,
  typeBBGHSelected: PropTypes.number,
  onGetFarmNSCAutocomplete: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectedUnit: makeSelectedUnit(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(withConnect)(DeliveryPartyInformation);
