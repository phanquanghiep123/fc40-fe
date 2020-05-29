import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import Expansion from 'components/Expansion';
import InputControl from 'components/InputControl';
import SelectControl from 'components/SelectControl';

/* eslint-disable react/prefer-stateless-function */
export class InvestigationMonitoringInformation extends React.PureComponent {
  render() {
    const { formik } = this.props;
    return (
      <Expansion
        title="VI. Thông Tin Giám Sát Kiểm Tra"
        content={
          <Grid container justify="flex-start" spacing={40}>
            <Grid item xs={12} md={3}>
              <Field
                name="employeeQC"
                label="Nhân viên QC"
                component={SelectControl}
                required
                onChange={formik.handleChange}
              >
                <MenuItem value={10}>Biên bản - Farm</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Field>
              <Field
                name="employeeKSCL"
                label="Nhân viên KSCL"
                required
                component={SelectControl}
                onChange={formik.handleChange}
              >
                <MenuItem value={10}>Biên bản - Farm</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Field>
            </Grid>

            <Grid item xs={12} md={9} lg={6}>
              <Field
                name="notesStatusProduct"
                label="Các ghi chú về tình trạng hàng hóa (nếu có)"
                component={InputControl}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        }
      />
    );
  }
}

InvestigationMonitoringInformation.propTypes = {
  // classes: PropTypes.object.isRequired,
  /**
   * @formik props pass from Formik
   */
  formik: PropTypes.object,
};

export default InvestigationMonitoringInformation;
