import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectTypesBBGH } from './selectors';
import { TYPE_BBGH } from './constants';
import { getLeadtime } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class DeliveryInformationReceived extends React.Component {
  getDeliverPresentorAuto = (inputText, callback) => {
    const { formik } = this.props;
    this.props.onGetUsersAuto(inputText, formik.values.receiverCode, callback);
  };

  handleAutoChangeReciver = options => {
    // {"label":"Farm example 3","value":1002}
    const { formik, onGetLeadtime } = this.props;
    this.props.formik.setFieldValue('receiverCode', options.value);
    this.props.formik.setFieldValue('plantType', options.plantType);
    this.props.formik.setFieldValue('stockList', []);
    onGetLeadtime(formik.values.deliverCode, options.value);
  };

  selectReceiveRepresentor = options => {
    this.props.formik.setFieldValue('receivingPersonCode', options.value);
  };

  getTypeBBGH;

  render() {
    const {
      formik,
      classes,
      loginInfor,
      onGetFarmNSCAutocomplete,
    } = this.props;
    const { values } = formik;
    const isNCCtoNSC = values.doType === TYPE_BBGH.NCC_TO_NSC;
    const isFarmPostHarvest = values.doType === TYPE_BBGH.FARM_POST_HARVEST;
    const isFarmToPlantNotPNK =
      values.doType === TYPE_BBGH.FARM_TO_PLANT_CODE_1 ||
      values.doType === TYPE_BBGH.FARM_TO_PLANT_CODE_2 ||
      values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER;

    return (
      <Expansion
        title="III. Thông Tin Bên Nhận Hàng"
        content={
          <Grid container justify="space-between">
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {isNCCtoNSC || isFarmPostHarvest ? (
                <Field
                  name="doWorkingUnitName"
                  label={isNCCtoNSC ? 'Farm/NSC' : 'NSC '}
                  required
                  disabled
                  component={InputControl}
                  onChange={formik.handleChange}
                />
              ) : null}

              {isFarmToPlantNotPNK ? (
                <Field
                  name="receiverName"
                  component={InputControl}
                  textFieldProps={{
                    label: 'Farm/NSC',
                    InputLabelProps: {
                      shrink: true,
                    },
                    required: true,
                  }}
                  placeholder=""
                  promiseOptions={onGetFarmNSCAutocomplete}
                  onInputChange={this.handleAutoChangeReciver}
                  autoComplete
                  defaultOptions
                />
              ) : null}
              <Field
                name="receiverCode"
                label="Mã Farm/NSC"
                required
                disabled
                component={InputControl}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {isNCCtoNSC || isFarmPostHarvest ? (
                <Field
                  name="receivingPersonName"
                  component={InputControl}
                  textFieldProps={{
                    label: 'Đại Diện Nhận Hàng',
                    InputLabelProps: {
                      shrink: true,
                    },
                    required: true,
                  }}
                  placeholder={loginInfor.nameUserLogin}
                  options={[]}
                  onInputChange={this.selectReceiveRepresentor}
                  promiseOptions={this.getDeliverPresentorAuto}
                  autoComplete
                />
              ) : (
                <InputControl
                  label="Đại Diện Nhận Hàng"
                  disabled
                  form={{ errors: [] }}
                  field={{ name: '_receivingPersonName', value: '' }}
                  onChange={formik.handleChange}
                />
              )}
              <Field
                name="receivingPersonPhone"
                label="Điện Thoại"
                component={InputControl}
                disabled={!(isNCCtoNSC || isFarmPostHarvest)}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {isNCCtoNSC || isFarmPostHarvest ? (
                <Field
                  name="stockReceivingDateTime"
                  label="Ngày Nhận"
                  component={DatePickerControl}
                  required
                />
              ) : (
                <InputControl
                  label="Ngày Nhận"
                  disabled
                  form={{ errors: [] }}
                  field={{ name: '_stockReceivingDateTime', value: '' }}
                  onChange={formik.handleChange}
                />
              )}
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group} />
          </Grid>
        }
      />
    );
  }
}

DeliveryInformationReceived.propTypes = {
  classes: PropTypes.object,
  // get user auto complete
  onGetUsersAuto: PropTypes.func,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
  loginInfor: PropTypes.object,
  onGetFarmNSCAutocomplete: PropTypes.func,
  onGetLeadtime: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetLeadtime: (deliveryCode, receiveCode) =>
      dispatch(getLeadtime(deliveryCode, receiveCode)),
  };
}

const mapStateToProps = createStructuredSelector({
  typesBBGH: makeSelectTypesBBGH(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(
  withImmutablePropsToJS(DeliveryInformationReceived),
);
