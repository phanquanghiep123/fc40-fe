import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import SelectControl from 'components/SelectControl';
import DatePickerControl from 'components/PickersControl';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { localstoreUtilites } from 'utils/persistenceData';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { TYPE_BBGH } from './constants';
import { changeTypeBBGH } from './actions';
import { makeSelectCreatedUnit } from './selectors';
const auth = localstoreUtilites.getAuthFromLocalStorage();

/* eslint-disable react/prefer-stateless-function */
export class RecordsInformation extends React.PureComponent {
  /**
   * @param {e: object} event is trigged when
   * @param {formik: object} props of formik
   *
   * @description this function is called when change typeBBGH
   */
  changeTypeBBGH = (e, formik) => {
    formik.resetForm();
    // change typeBBGH in store
    this.props.onChangeTypeBBGH(e.target.value);
    // trigger action of formik
    formik.handleChange(e);

    // bussines logic
    // section 1
    const { selectedUnit, createdUnits } = this.props;
    const unitSelected = createdUnits.filter(
      unit => unit.value === selectedUnit,
    )[0];

    formik.setFieldValue('doWorkingUnitName', unitSelected.label); // Farm/NSC
    formik.setFieldValue('doWorkingUnitCode', unitSelected); // Farm/NSC
    formik.setFieldValue('deliveryName', unitSelected.label);
    formik.setFieldValue('deliverCode', unitSelected.value);
    if (
      [TYPE_BBGH.NCC_TO_NSC, TYPE_BBGH.FARM_POST_HARVEST].includes(
        e.target.value,
      )
    ) {
      // section 3
      formik.setFieldValue('receiverName', unitSelected.label);
      formik.setFieldValue('receiverCode', unitSelected.value);
      formik.setFieldValue('receivingPersonName', `${auth.meta.fullName}`);
      formik.setFieldValue('receivingPersonCode', `${auth.meta.userId}`);
      formik.setFieldValue('receivingPersonPhone', `${auth.meta.phoneNumber}`);
    } else {
      formik.setFieldValue('receiverName', '');
      formik.setFieldValue('receiverCode', '');
      formik.setFieldValue('receivingPersonName', '');
      formik.setFieldValue('receivingPersonCode', '');
      formik.setFieldValue('receivingPersonPhone', '');
    }
    // section 4
    // if (TYPE_BBGH.BASKET_DELIVERY_ORDER === e.target.value) {
    // }else {
    //
    // }
  };

  render() {
    const {
      classes,
      formik,
      createdBBGHUser,
      typeBBGH,
      typeBBGHSelected,
    } = this.props;
    const isNCCtoNSC = typeBBGHSelected === TYPE_BBGH.NCC_TO_NSC;
    const { values } = formik;

    return (
      <Expansion
        title="I. Thông Tin Biên Bản"
        content={
          <Grid container justify="space-between">
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <InputControl
                label="Mã BBGH"
                disabled
                form={{ errors: [] }}
                field={{ name: 'codeBBGH', value: '' }}
              />
              <Field
                name="doType"
                label="Loại BBGH"
                component={SelectControl}
                required
                onChange={e => this.changeTypeBBGH(e, formik)}
              >
                {typeBBGH.map(type => (
                  <MenuItem value={type.id} key={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Field>
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {isNCCtoNSC ? (
                <InputControl
                  label="Đơn Vị Tạo BBGH"
                  disabled
                  required
                  form={{ errors: [] }}
                  field={{ name: '_doWorkingUnitName', value: '' }}
                />
              ) : (
                <Field
                  name="doWorkingUnitName"
                  label="Đơn Vị Tạo BBGH"
                  component={InputControl}
                  required
                  disabled
                  onChange={formik.handleChange}
                />
              )}
              <InputControl
                label="Người Tạo BBGH"
                disabled
                required
                form={{ errors: [] }}
                field={{ name: 'personCreated', value: createdBBGHUser }}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <DatePickerControl
                label="Thời Gian Tạo BB"
                disabled
                required
                form={{ errors: [] }}
                field={{ name: 'timeCreated', value: Date.now() }}
                format="dd/MM/yyyy HH:mm:ss"
              />
              <InputControl
                label="Trạng Thái"
                disabled
                form={{ errors: [] }}
                field={{ name: 'status', value: 'Chờ giao hàng' }}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {isNCCtoNSC ? null : (
                <React.Fragment>
                  <Field
                    name="sealNumber"
                    label="Số Seal"
                    required={
                      values.doType !== TYPE_BBGH.FARM_POST_HARVEST &&
                      values.doType !== TYPE_BBGH.FARM_TO_PLANT_CODE_2
                    }
                    component={InputControl}
                    onChange={formik.handleChange}
                  />
                  <InputControl
                    label="Trạng Thái Của Seal"
                    disabled
                    form={{ errors: [] }}
                    field={{ name: 'statusOfSeal', value: '' }}
                  />
                  <Field
                    name="vehicleNumbering"
                    label="Số Thứ Tự Xe"
                    component={InputControl}
                    required={
                      values.doType !== TYPE_BBGH.FARM_POST_HARVEST &&
                      values.doType !== TYPE_BBGH.FARM_TO_PLANT_CODE_2
                    }
                    onChange={formik.handleChange}
                  />
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        }
      />
    );
  }
}

RecordsInformation.propTypes = {
  classes: PropTypes.object.isRequired,
  createdBBGHUser: PropTypes.string,
  typeBBGH: PropTypes.array,
  onChangeTypeBBGH: PropTypes.func,
  selectedUnit: PropTypes.string,
  createdUnits: PropTypes.array,
  typeBBGHSelected: PropTypes.number,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeTypeBBGH: typeBBGH => dispatch(changeTypeBBGH(typeBBGH)),
  };
}

const mapStateToProps = createStructuredSelector({
  createdUnits: makeSelectCreatedUnit(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(withImmutablePropsToJS(RecordsInformation));
