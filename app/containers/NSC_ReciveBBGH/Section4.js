import React from 'react';
import { Button, Grid, MenuItem, Fab } from '@material-ui/core';
import Expansion from 'components/Expansion';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import TimePickerControl from 'components/TimePickersControl';
import InputControl from '../../components/InputControl';
import SelectControl from '../../components/SelectControl';

import {
  VEHICLE_ROUTE_TYPE_1,
  VEHICLE_ROUTE_TYPE_4,
  VEHICLE_ROUTE_TYPE_5,
} from './constants';
import {
  addViolation,
  deleteViolation,
  changeMinStandardTemperature,
  changeMaxStandardTemperature,
  changeActualTemperature,
  changeVehicleRoute,
} from './Utils';

export const VehicleDetail = props => {
  const { classes, masterCode, prs, vehicleRoute } = props;
  const requiredTemp =
    // eslint-disable-next-line eqeqeq
    prs.values.vehicleRouteType != VEHICLE_ROUTE_TYPE_1 &&
    // eslint-disable-next-line eqeqeq
    prs.values.vehicleRouteType != VEHICLE_ROUTE_TYPE_5;

  return (
    <Expansion
      title="IV. Thông Tin Trạng Thái Xe"
      content={
        <Grid container spacing={32}>
          <Grid item lg={3} xs={12}>
            <Grid container spacing={8} className={classes.container}>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Thời Gian Trả Hàng Xong"
                  name="deliveryTime"
                  component={TimePickerControl}
                  onChangeTimePicker={() => {}}
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Thời Gian Nổ Xe Lạnh Trả Hàng"
                  name="coolingVehicleTime"
                  type="number"
                  component={InputControl}
                  onChange={prs.handleChange}
                  disabled={!requiredTemp}
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Loại Xe.Tuyến"
                  name="vehicleRouteType"
                  component={SelectControl}
                  onChange={event => {
                    prs.handleChange(event);
                    changeVehicleRoute(event, prs, vehicleRoute);
                  }}
                >
                  {vehicleRoute.map(status => (
                    <MenuItem
                      key={status.vehicleRouteCode}
                      value={status.vehicleRouteCode}
                    >
                      {status.vehicleType}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} xs={12}>
            <Grid container spacing={8} className={classes.container}>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Nhiệt Độ Thực Tế"
                  component={InputControl}
                  onChange={event => {
                    prs.handleChange(event);
                    changeActualTemperature(event, prs);
                  }}
                  type="number"
                  name="actualTemperature"
                  disabled={!requiredTemp}
                  required={requiredTemp}
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Nhiệt Độ Tiêu Chuẩn Min"
                  component={InputControl}
                  onChange={event => {
                    prs.handleChange(event);
                    changeMinStandardTemperature(event, prs);
                  }}
                  type="number"
                  name="minStandardTemperature"
                  // eslint-disable-next-line eqeqeq
                  required={prs.values.vehicleRouteType == VEHICLE_ROUTE_TYPE_4}
                  // eslint-disable-next-line eqeqeq
                  disabled={prs.values.vehicleRouteType != VEHICLE_ROUTE_TYPE_4}
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Nhiệt Độ Tiêu Chuẩn Max"
                  component={InputControl}
                  onChange={event => {
                    prs.handleChange(event);
                    changeMaxStandardTemperature(event, prs);
                  }}
                  type="number"
                  name="maxStandardTemperature"
                  // eslint-disable-next-line eqeqeq
                  required={prs.values.vehicleRouteType == VEHICLE_ROUTE_TYPE_4}
                  // eslint-disable-next-line eqeqeq
                  disabled={prs.values.vehicleRouteType != VEHICLE_ROUTE_TYPE_4}
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  name="temperatureStatus"
                  label="Trạng Thái Nhiệt Độ"
                  component={SelectControl}
                  onChange={prs.handleChange}
                >
                  {masterCode.temperatureStatus.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} xs={12}>
            <Grid container spacing={8} className={classes.container}>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Nhiệt Độ Chip 1"
                  component={InputControl}
                  onChange={prs.handleChange}
                  name="chipTemperature1"
                  type="number"
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Nhiệt Độ Chip 2"
                  component={InputControl}
                  onChange={prs.handleChange}
                  name="chipTemperature2"
                  type="number"
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  name="chipTemperatureStatus"
                  label="Trạng Thái Nhiệt Độ Chip"
                  component={SelectControl}
                  onChange={prs.handleChange}
                >
                  {masterCode.temperatureStatus.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3} xs={12}>
            <Grid container spacing={8} className={classes.container}>
              <Grid item lg={12} xs={12}>
                <Field
                  name="vehiclePallet"
                  label="Pallet Lót Sàn Xe"
                  component={SelectControl}
                  onChange={prs.handleChange}
                >
                  {masterCode.vehiclePallet.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  name="vehicleCleaning"
                  label="Vệ Sinh Xe"
                  component={SelectControl}
                  onChange={prs.handleChange}
                  required
                >
                  {masterCode.vehicleCleaning.map(status => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>
              <Grid item lg={12} xs={12}>
                <Field
                  label="Ghi Chú Về Vận Chuyển"
                  name="notes"
                  component={InputControl}
                  onChange={prs.handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={12} xs={12}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={8}
            >
              <input
                accept="image/*"
                className={classes.input}
                style={{ display: 'none' }}
                id="flatButtonFile"
                multiple
                type="file"
                onChange={e => addViolation(e, prs)}
              />
              <label htmlFor="flatButtonFile">
                <Button
                  className={classes.chooseFileBtn}
                  component="span"
                  id="avatar"
                  variant="contained"
                >
                  Chọn file
                </Button>
              </label>
            </Grid>
          </Grid>
          <Grid item lg={12} xs={12}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={8}
            >
              {prs.values.deliveryOrderTransportViolationList.map(
                (item, index) => (
                  <Grid item>
                    <span className={classes.imageWrapper}>
                      <img
                        className={classes.image}
                        alt={index}
                        src={item.violationPicture}
                      />
                      {item.violationPicture && (
                        <Fab
                          color="primary"
                          className={classes.deleteImage}
                          onClick={() => deleteViolation(item, prs)}
                        >
                          x
                        </Fab>
                      )}
                    </span>
                  </Grid>
                ),
              )}
            </Grid>
          </Grid>
        </Grid>
      }
    />
  );
};

VehicleDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  masterCode: PropTypes.object,
  vehicleRoute: PropTypes.array,
  prs: PropTypes.object,
};
