import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';

import DatePickerControl from 'components/PickersControl';

import { makeSelectData } from './selectors';
import { regionOption, supplierOption } from './data';

import styles from './styles';

export function Section1({ classes, formik, ...props }) {
  return (
    <Card className={classes.section}>
      <CardContent className={classes.cardContent}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6} lg={3}>
                <Field
                  name="consumeRegion"
                  label="Vùng Tiêu Thụ"
                  component={MuiInput}
                  select
                  options={[regionOption, ...props.regions]}
                  valueKey="regionCode"
                  labelKey="regionName"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Field
                  name="supplierCode"
                  label="NCC"
                  component={MuiInput}
                  select
                  options={[supplierOption, ...props.suppliers]}
                  valueKey="supplierCode"
                  labelKey="supplierName"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Field
                  name="status"
                  label="Trạng Thái"
                  component={MuiInput}
                  select
                  options={props.sendStatus}
                  valueKey="statusCode"
                  labelKey="statusName"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Field
                  name="date"
                  label="Ngày Gửi Mail"
                  component={DatePickerControl}
                  style={{
                    marginTop: 5,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8} justify="flex-end">
              <Grid item>
                <MuiButton
                  outline
                  className={classes.button}
                  onClick={formik.handleResetClick}
                >
                  Bỏ Lọc
                </MuiButton>
              </Grid>
              <Grid item>
                <MuiButton
                  className={classes.button}
                  onClick={formik.handleSubmitClick}
                >
                  Tìm Kiếm
                </MuiButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  regions: PropTypes.array,
  suppliers: PropTypes.array,
  sendStatus: PropTypes.array,
};

Section1.defaultProps = {
  regions: [],
  suppliers: [],
  sendStatus: [],
};

export const mapStateToProps = createStructuredSelector({
  regions: makeSelectData('master', 'regions'),
  suppliers: makeSelectData('master', 'suppliers'),
  sendStatus: makeSelectData('master', 'sendStatus'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withStyles(styles),
  withConnect,
  withImmutablePropsToJS,
)(Section1);
