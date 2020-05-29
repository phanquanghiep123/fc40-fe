import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { createStructuredSelector } from 'reselect';

import ConfirmationDialog from 'components/ConfirmationDialog';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';

import { getUsersAuto } from './actions';
import { makeSelectTypeUserEdit } from './selectors';
import { TYPE_USER_EDIT, TYPE_NCC_TO_NSC, ORDER_FLAG } from './constants';
import { TYPE_BBGH, BASKETS_TYPE } from '../BBGHCreatePage/constants';

const styles = theme => ({
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class Section2 extends React.Component {
  getDeliverPresentorAuto = (inputText, callback) => {
    const { doWorkingUnitCode } = this.props.formik.values;
    this.props.onGetUsersAuto(inputText, doWorkingUnitCode, callback);
  };

  onConfirmShow = options => {
    if (this.confirmRef) {
      this.confirmRef.showConfirm(options);
    }
  };

  handleAutoChangedDelivedPresentor = options => {
    this.props.formik.setFieldValue('deliveryPersonCode', options.value);
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
    const { classes, formik, typeUserEdit } = this.props;

    const isEdited =
      [TYPE_USER_EDIT.DELIVER, TYPE_USER_EDIT.DELIVER_AND_RECIVER].includes(
        typeUserEdit,
      ) ||
      ([TYPE_USER_EDIT.RECIVER, TYPE_USER_EDIT.DELIVER_AND_RECIVER].includes(
        typeUserEdit,
      ) &&
        formik.values.doType === TYPE_NCC_TO_NSC.TYPE);

    const isNCCtoNSC = formik.values.doType === TYPE_NCC_TO_NSC.TYPE;
    const isBasket =
      formik.values.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN;
    const isEditedDate =
      [
        TYPE_BBGH.NCC_TO_NSC,
        TYPE_BBGH.FARM_POST_HARVEST,
        TYPE_BBGH.FARM_TO_PLANT_CODE_1,
        TYPE_BBGH.FARM_TO_PLANT_CODE_2,
      ].includes(formik.values.doType) &&
      [TYPE_USER_EDIT.DELIVER, TYPE_USER_EDIT.DELIVER_AND_RECIVER].includes(
        typeUserEdit,
      ) &&
      formik.values.receivingOrderFlag === ORDER_FLAG.RECIVING;
    return (
      <React.Fragment>
        <Expansion
          title="II. Thông Tin Bên Giao Hàng"
          content={
            <Grid container justify="space-between">
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  name="deliveryName"
                  label={isNCCtoNSC ? 'NCC' : 'Farm/NSC'}
                  required
                  disabled
                  component={InputControl}
                  onChange={formik.handleChange}
                />
                {!isBasket && (
                  <Field
                    name="deliverCode"
                    label={isNCCtoNSC ? 'Đơn Vị' : 'Mã Farm/NSC'}
                    required
                    disabled
                    component={InputControl}
                    onChange={formik.handleChange}
                  />
                )}
                {isBasket && (
                  <Field
                    name="deliverCode"
                    label="Mã Bên Giao"
                    required
                    disabled
                    component={InputControl}
                    onChange={formik.handleChange}
                  />
                )}
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
                  options={[]}
                  onInputChange={this.handleAutoChangedDelivedPresentor}
                  promiseOptions={this.getDeliverPresentorAuto}
                  autoComplete
                  disabled={!isEdited}
                  onBlur={e => this.handleBlur(e, formik)}
                />
                <Field
                  name="deliveryPersonPhone"
                  label="Điện Thoại"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={!isEdited}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  name="deliveryDateTime"
                  label="Ngày Giao"
                  component={DatePickerControl}
                  required
                  onChange={date => {
                    let mess = '';
                    formik.values.basketDocumentList.forEach(item => {
                      if ([BASKETS_TYPE.PXKS].includes(item.type))
                        mess += `${item.basketDocumentCode} ,`;
                    });
                    const newMess = mess.substr(0, mess.length - 1);
                    this.onConfirmShow({
                      message: `Nếu bạn thay đổi giá trị các BBGH: ${
                        formik.values.doCode
                      }  và danh sách các PXKS: ${newMess} liên quan sẽ bị cập nhật lại Ngày Giao Hàng/Ngày Xuất Hàng!`,
                      actions: [
                        { text: 'Hủy' },
                        {
                          text: 'Đồng ý',
                          color: 'primary',
                          onClick: () =>
                            formik.setFieldValue('deliveryDateTime', date),
                        },
                      ],
                    });
                  }}
                  disabled={!isEditedDate && formik.values.isLockBasketEdited}
                />
              </Grid>
              <Grid
                item
                lg={3}
                xl={3}
                md={6}
                xs={12}
                className={classes.group}
              />
            </Grid>
          }
        />
        <ConfirmationDialog
          ref={ref => {
            this.confirmRef = ref;
          }}
        />
      </React.Fragment>
    );
  }
}

Section2.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default compose(withConnect)(withStyles(styles)(Section2));
