import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import MuiSelectInput from 'components/MuiSelect/Input';
import { compose } from 'redux';

/* eslint-disable react/prefer-stateless-function */
export class GeneralSection extends React.PureComponent {
  handleChangeSupplierType = option => {
    this.props.formik.setFieldValue('supplierType', option.value);
  };

  render() {
    const { classes, formik, itemId, formDataSchema, disabled } = this.props;

    const listSupplierType = formDataSchema.supplierType.filter(
      x => x.value !== '0',
    );
    return (
      <Grid item xs={12} className={classes.section}>
        <Expansion
          title="I. Thông Tin Chung"
          content={
            <Grid container justify="space-between">
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                {!!itemId && (
                  <Field
                    label="Mã NCC"
                    name="supplierCode"
                    disabled
                    component={InputControl}
                  />
                )}
                <Field
                  name="supplierType"
                  options={listSupplierType}
                  component={MuiSelectInput}
                  valueKey="value"
                  labelKey="label"
                  isClearable
                  showError
                  TextFieldProps={{
                    label: 'Loại NCC',
                    margin: 'dense',
                    required: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleChangeSupplierType}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Mã số VAT"
                  name="vatRegistrationNo"
                  required
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Mã số TAT"
                  name="taxNumber4"
                  required
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Tên 1"
                  name="name1"
                  required
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Tên 2"
                  name="name2"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Tên 3"
                  name="name3"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Tên 4"
                  name="name4"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Email"
                  name="email"
                  component={InputControl}
                  onChange={e => {
                    formik.handleChange(e);
                    formik.setFieldTouched('email', true, true);
                  }}
                  disabled={disabled}
                />
                <Field
                  label="Điện thoại"
                  name="phone"
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

GeneralSection.propTypes = {
  classes: PropTypes.object.isRequired,
  itemId: PropTypes.number,
  formDataSchema: PropTypes.object,
  disabled: PropTypes.bool,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default compose()(withImmutablePropsToJS(GeneralSection));
