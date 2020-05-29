import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { createStructuredSelector } from 'reselect';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';
import { makeSelectTypeUserEdit } from './selectors';
import { TYPE_USER_EDIT } from './constants';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';

import { getUsersAuto } from './actions';

const styles = theme => ({
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class Section3 extends React.Component {
  getDeliverPresentorAuto = (inputText, callback) => {
    const { doWorkingUnitCode } = this.props.formik.values;
    this.props.onGetUsersAuto(inputText, doWorkingUnitCode, callback);
  };

  selectReceiveRepresentor = options => {
    this.props.formik.setFieldValue('receivingPersonCode', options.value);
  };

  handleBlur = (e, formik) => {
    if (formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN) {
      this.props.formik.setFieldValue(
        'receivingPersonName',
        e.target.value || formik.values.receivingPersonName,
      );
      if (e.target.value) {
        this.props.formik.setFieldValue('receivingPersonCode', '');
      }
    }
  };

  render() {
    const { formik, classes, typeUserEdit } = this.props;

    const isEdited = [
      TYPE_USER_EDIT.RECIVER,
      TYPE_USER_EDIT.DELIVER_AND_RECIVER,
    ].includes(typeUserEdit);
    const isSamePlace = formik.values.doType === TYPE_BBGH.FARM_TO_PLANT_CODE_2;
    const isBasket =
      formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN;
    return (
      <Expansion
        title="III. Thông Tin Bên Nhận Hàng"
        content={
          <Grid container justify="space-between">
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <Field
                name="receiverName"
                label="Farm/NSC"
                required
                disabled
                component={InputControl}
                onChange={formik.handleChange}
              />
              <Field
                name="receiverCode"
                label={isBasket ? 'Mã Bên Nhận' : 'Mã Farm/NSC'}
                required
                disabled
                component={InputControl}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {isEdited ? (
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
                  placeholder={formik.values.receivingPersonName}
                  options={[]}
                  onInputChange={this.selectReceiveRepresentor}
                  promiseOptions={this.getDeliverPresentorAuto}
                  autoComplete
                  onBlur={e => this.handleBlur(e, formik)}
                />
              ) : (
                <InputControl
                  label="Đại Diện Nhận Hàng"
                  disabled
                  form={{ errors: [] }}
                  field={{ name: '_receivingPersonName', value: '' }}
                />
              )}
              <Field
                name="receivingPersonPhone"
                label="Điện Thoại"
                component={InputControl}
                onChange={formik.handleChange}
                disabled={!isEdited}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {!isSamePlace ? (
                <Field
                  name="stockReceivingDateTime"
                  label="Ngày Nhận"
                  component={DatePickerControl}
                  required
                  disabled={!isEdited}
                />
              ) : (
                <Field
                  name="deliveryDateTime"
                  label="Ngày Nhận"
                  component={DatePickerControl}
                  required
                  disabled
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

Section3.propTypes = {
  classes: PropTypes.object,
  onGetUsersAuto: PropTypes.func,
  formik: PropTypes.object,
  typeUserEdit: PropTypes.number,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetUsersAuto: (inputText, selectedUnitId, callback) =>
      dispatch(getUsersAuto(inputText, selectedUnitId, callback)),
  };
}

const mapStateToProps = createStructuredSelector({
  typeUserEdit: makeSelectTypeUserEdit(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(withStyles(styles)(Section3));
