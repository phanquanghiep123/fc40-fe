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
export class AddressSection extends React.PureComponent {
  handleChangeRegionCode = option => {
    this.props.formik.setFieldValue('regionCode', option.value);
  };

  render() {
    const { classes, formik, formDataSchema, disabled } = this.props;

    const listregionCode = formDataSchema.regionCode.filter(
      x => x.value !== '0',
    );

    return (
      <Grid item xs={12} className={classes.section}>
        <Expansion
          title="II. Thông tin địa chỉ"
          content={
            <Grid container justify="space-between">
              <Grid item lg={6} xl={6} md={6} xs={12} className={classes.group}>
                <Field
                  label="Địa chỉ"
                  name="street"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Địa chỉ 4"
                  name="street4"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Địa chỉ 5"
                  name="street5"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Quận/Huyện"
                  name="district"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Mã Tỉnh/TP"
                  name="provinceCode"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                {/* <Field
                  label="Vùng/Miền"
                  name="regionCode"
                  component={SelectControl}
                  required
                  onChange={formik.handleChange}
                  disabled={disabled}
                >
                  {formDataSchema.regionCode.map(item => {
                    const label =
                      item.value.toString() === '0'
                        ? 'Vui lòng chọn'
                        : item.label;
                    return (
                      <MenuItem value={item.value} key={item.value}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Field> */}
                <Field
                  name="regionCode"
                  options={listregionCode}
                  component={MuiSelectInput}
                  valueKey="value"
                  labelKey="label"
                  isClearable
                  showError
                  TextFieldProps={{
                    label: 'Vùng/Miền',
                    margin: 'dense',
                    required: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.handleChangeRegionCode}
                />
              </Grid>
              <Grid item lg={3} xl={3} md={6} xs={12} className={classes.group}>
                <Field
                  label="Tỉnh/Thành Phố"
                  name="city"
                  component={InputControl}
                  onChange={formik.handleChange}
                  disabled={disabled}
                />
                <Field
                  label="Quốc gia"
                  name="country"
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

AddressSection.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  formDataSchema: PropTypes.object,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default compose()(withImmutablePropsToJS(AddressSection));
