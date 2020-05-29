import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import Expansion from 'components/Expansion';
import Grid from '@material-ui/core/Grid';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import InputControl from 'components/InputControl';
import DatePickerControl from 'components/PickersControl';
/* eslint-disable react/prefer-stateless-function */
class GeneralInfo extends React.Component {
  render() {
    const { formik, classes } = this.props;
    return (
      <Expansion
        title="I. Thông Tin Chung"
        content={
          <Grid container spacing={32}>
            <Grid item lg={3} xl={3} md={3} xs={12}>
              <Grid container className={classes.container}>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    label="Loại Nhập Kho"
                    disabled
                    required
                    name="subTypeName"
                    component={InputControl}
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    name="date"
                    label="Ngày Lập Phiếu"
                    component={DatePickerControl}
                    disabled
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    name="deliveryOrderCode"
                    label="Mã BBGH"
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={3} xl={3} md={3} xs={12}>
              <Grid container className={classes.container}>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    label="Bên Giao Hàng"
                    disabled
                    required
                    name="deliverCodeName"
                    component={InputControl}
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    label="Bên Nhận Hàng"
                    disabled
                    required
                    name="receiverCodeName"
                    component={InputControl}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={3} xl={3} md={3} xs={12}>
              <Grid container>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    name="importerName"
                    label="Nhân Viên Cân Hàng"
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    name="importerPhone"
                    label="Điện Thoại"
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    name="importerEmail"
                    label="Email"
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={3} xl={3} md={3} xs={12}>
              <Grid container className={classes.container}>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    name="supervisorName"
                    label="Nhân Viên Giám Sát"
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <InputControl
                    label="Chuyến Xe"
                    disabled
                    required
                    form={formik}
                    field={{
                      name: 'vehicleNumberingLabel',
                      value: formik.values.vehicleNumberingLabel,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={6} xl={6} md={6} xs={12}>
              <Grid container className={classes.container}>
                <Grid item lg={12} xl={12} md={12} xs={12}>
                  <Field
                    name="note"
                    label="Ghi Chú"
                    component={InputControl}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      />
    );
  }
}
GeneralInfo.propTypes = {
  formik: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default GeneralInfo;
