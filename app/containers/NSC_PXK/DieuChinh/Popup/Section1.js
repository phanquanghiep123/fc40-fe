import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'formik';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';

import styles from '../styles';

export function Section1({ classes }) {
  return (
    <Card className={classes.section}>
      <CardContent className={classes.cardContent}>
        <Grid container spacing={16}>
          <Grid item xs={12} md={6} lg={3}>
            <Field
              name="plantName"
              label="Đơn Vị"
              component={MuiInput}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Field
              name="receiverCode"
              label="Mã Farm/NCC"
              component={MuiInput}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Field
              name="receiverName"
              label="Tên Farm/NCC"
              component={MuiInput}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Section1);
