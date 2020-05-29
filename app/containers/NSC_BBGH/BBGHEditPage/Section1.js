import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { compose } from 'redux';

import SelectControl from 'components/SelectControl';
import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import DatePickerControl from 'components/PickersControl';

import { makeSelectTypeUserEdit } from './selectors';
import { TYPE_USER_EDIT, TYPE_NCC_TO_NSC } from './constants';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';
const styles = theme => ({
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class RecordsInformation extends React.Component {
  render() {
    const { classes, formik, typeUserEdit } = this.props;
    const { values } = formik;
    const isNCCtoNSC = values.doType === TYPE_NCC_TO_NSC.TYPE;

    return (
      <Expansion
        title="I. Thông Tin Biên Bản"
        content={
          <Grid container justify="space-between">
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <Field
                name="doCode"
                label="Mã BBGH"
                component={InputControl}
                required
                disabled
                onChange={formik.handleChange}
              />
              <Field
                name="doTypeName"
                label="Loại BBGH"
                component={InputControl}
                required
                disabled
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {!isNCCtoNSC ? (
                <Field
                  name="plantName"
                  label="Đơn Vị Tạo BBGH"
                  component={InputControl}
                  required
                  disabled
                  onChange={formik.handleChange}
                />
              ) : (
                <InputControl
                  label="Đơn Vị Tạo BBGH"
                  disabled
                  form={{ errors: [] }}
                  field={{ name: '_plantName', value: '' }}
                />
              )}
              <Field
                name="createdByName"
                label="Người Tạo BBGH"
                component={InputControl}
                required
                disabled
                onChange={formik.handleChange}
              />
              <Field
                name="updatedTimes"
                label="Số Lần Cập Nhật"
                component={InputControl}
                disabled
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <Field
                name="createdAt"
                label="Thời Gian Tạo BB"
                component={DatePickerControl}
                required
                disabled
                format="dd/MM/yyyy HH:mm:ss"
                onChange={formik.handleChange}
              />
              <Field
                name="statusName"
                label="Trạng Thái"
                component={InputControl}
                required
                disabled
                onChange={formik.handleChange}
              />
              <Field
                name="updatedAt"
                label="Thời Gian Cập Nhật"
                component={DatePickerControl}
                disabled
                format="dd/MM/yyyy HH:mm:ss"
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              {formik.values.doType !== TYPE_NCC_TO_NSC.TYPE && (
                <React.Fragment>
                  <Field
                    name="sealNumber"
                    label="Số Seal"
                    required={
                      values.doType !== TYPE_BBGH.FARM_POST_HARVEST &&
                      values.doType !== TYPE_BBGH.FARM_TO_PLANT_CODE_2 &&
                      values.doType !== TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN
                    }
                    component={InputControl}
                    onChange={formik.handleChange}
                  />
                  <Field
                    name="sealStatus"
                    label="Trạng Thái Của Seal"
                    component={SelectControl}
                    onChange={formik.handleChange}
                    disabled={
                      ![
                        TYPE_USER_EDIT.RECIVER,
                        TYPE_USER_EDIT.DELIVER_AND_RECIVER,
                      ].includes(typeUserEdit)
                    }
                  >
                    {[
                      { value: 1, label: 'Đạt' },
                      { value: 0, label: 'Không đạt' },
                    ].map(status => (
                      <MenuItem value={status.value} key={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Field>
                  <Field
                    name="vehicleNumbering"
                    label="Số Thứ Tự Xe"
                    component={InputControl}
                    onChange={formik.handleChange}
                    required={
                      values.doType !== TYPE_BBGH.FARM_POST_HARVEST &&
                      values.doType !== TYPE_BBGH.FARM_TO_PLANT_CODE_2 &&
                      values.doType !== TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN
                    }
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
  formik: PropTypes.object,
  typeUserEdit: PropTypes.number,
};

export function mapDispatchToProps() {
  return {
    // onChangeTypeBBGH: typeBBGH => dispatch(changeTypeBBGH(typeBBGH)),
  };
}

const mapStateToProps = createStructuredSelector({
  typeUserEdit: makeSelectTypeUserEdit(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(
  withStyles(styles)(withImmutablePropsToJS(RecordsInformation)),
);
