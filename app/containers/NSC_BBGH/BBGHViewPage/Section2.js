import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';
import { TYPE_NCC_TO_NSC } from './constants';

const styles = theme => ({
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class Section2 extends React.Component {
  render() {
    const { classes, formik } = this.props;
    const isNCCtoNSC = formik.values.doType === TYPE_NCC_TO_NSC.TYPE;

    return (
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
                label="Đại Diện Giao Hàng"
                component={InputControl}
                onChange={formik.handleChange}
                disabled
              />
              <Field
                name="deliveryPersonPhone"
                label="Điện Thoại"
                component={InputControl}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <Field
                name="deliveryDateTime"
                label="Ngày Giao"
                component={DatePickerControl}
                required
                disabled
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group} />
          </Grid>
        }
      />
    );
  }
}

Section2.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
};

export default withStyles(styles)(Section2);
