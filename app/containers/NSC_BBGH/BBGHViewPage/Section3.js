import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';

const styles = theme => ({
  group: {
    // maxWidth: '20%',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
});

/* eslint-disable react/prefer-stateless-function */
export class Section3 extends React.Component {
  render() {
    const { formik, classes } = this.props;

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
                label="Mã Farm/NSC"
                required
                disabled
                component={InputControl}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
              <Field
                name="receivingPersonName"
                label="Đại Diện Nhận Hàng"
                component={InputControl}
                onChange={formik.handleChange}
                disabled
              />
              <Field
                name="receivingPersonPhone"
                label="Điện Thoại"
                component={InputControl}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item lg={3} xl={3} md={12} className={classes.group}>
              <Field
                name="stockReceivingDateTime"
                label="Ngày Nhận"
                component={DatePickerControl}
                required
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item lg={3} xl={3} md={12} className={classes.group} />
          </Grid>
        }
      />
    );
  }
}

Section3.propTypes = {
  classes: PropTypes.object,
  formik: PropTypes.object,
};

export default withStyles(styles)(Section3);
