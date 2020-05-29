import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

import SelectControl from 'components/SelectControl';
import InputControl from 'components/InputControl';
import Expansion from 'components/Expansion';
import DatePickerControl from 'components/PickersControl';
import { TYPE_BBGH } from '../BBGHCreatePage/constants';

import { TYPE_NCC_TO_NSC } from './constants';
const styles = theme => ({
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class Section1 extends React.Component {
  render() {
    const { classes, formik } = this.props;
    const { values } = formik;

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
              <Field
                name="deliveryName"
                label="Đơn Vị Tạo BBGH"
                component={InputControl}
                required
                disabled
                onChange={formik.handleChange}
              />
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
                onChange={formik.handleChange}
                format="dd/MM/yyyy HH:mm:ss"
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
                      values.doType !== TYPE_BBGH.FARM_TO_PLANT_CODE_2
                    }
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                  />
                  {formik.values.sealStatus ? (
                    <Field
                      name="sealStatus"
                      label="Trạng Thái Của Seal"
                      component={SelectControl}
                      onChange={formik.handleChange}
                      disabled
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
                  ) : (
                    <InputControl
                      label="Trạng Thái Của Seal"
                      disabled
                      form={{ errors: [] }}
                      field={{ name: '_sealStatus', value: '' }}
                    />
                  )}
                  <Field
                    name="vehicleNumbering"
                    label="Số thứ tự xe"
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                    required={
                      values.doType !== TYPE_BBGH.FARM_POST_HARVEST &&
                      values.doType !== TYPE_BBGH.FARM_TO_PLANT_CODE_2
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

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
};

export default withStyles(styles)(Section1);
