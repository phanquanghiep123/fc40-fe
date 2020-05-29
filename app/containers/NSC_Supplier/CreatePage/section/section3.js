import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';
import MuiInput from 'components/MuiInput';

import { compose } from 'redux';

/* eslint-disable react/prefer-stateless-function */
export class ContractSection extends React.PureComponent {
  render() {
    const { classes, formik, disabled } = this.props;

    return (
      <Grid item xs={12} className={classes.section}>
        <Expansion
          title="III. Thông tin hợp đồng"
          content={
            <Grid container justify="space-between">
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Mã HĐ"
                  name="contractCode"
                  required
                  component={MuiInput}
                  onChange={formik.handleChange}
                  disabled={disabled}
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Field
                  label="Loại HĐ"
                  name="contractType"
                  required
                  component={MuiInput}
                  onChange={formik.handleChange}
                  disabled={disabled}
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Người đại diện"
                  name="representativeName"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Tên pháp nhân"
                  name="legalEntityName"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Ngày ký HĐ"
                  name="contractSigningDate"
                  required
                  component={DatePickerControl}
                  disabled={disabled}
                  autoOk
                />
                <Field
                  label="Ngày có hiệu lực"
                  name="contractEffectiveDate"
                  required
                  component={DatePickerControl}
                  disabled={disabled}
                  autoOk
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Loại dịch vụ"
                  name="stockServiceType"
                  required
                  component={MuiInput}
                  onChange={formik.handleChange}
                  disabled={disabled}
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Field
                  label="Điều khoản thanh toán"
                  name="termsOfPayment"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
              </Grid>
            </Grid>
          }
        />
      </Grid>
    );
  }
}

ContractSection.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default compose()(withImmutablePropsToJS(ContractSection));
