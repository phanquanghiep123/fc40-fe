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
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import MuiInput from 'components/MuiInput';
import MuiButton from 'components/MuiButton';

import { connectContext } from './connect';
import { makeSelectData } from './selectors';

import { getReceiptDisplayName } from './utils';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
  actionButtons: {
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingTop: theme.spacing.unit * 2,
  },
  buttonScale: {
    width: 100,
  },
});

export class Section1 extends React.Component {
  onScaleClick = () => {
    this.props.context.onScaleClick();
  };

  onPlantChange = event => {
    this.props.context.onPlantChange(event.target.value);
  };

  render() {
    const { classes, receipts, organizations } = this.props;

    return (
      <Card className={classes.section}>
        <CardHeader
          title="I. Chọn Phiếu Xuất Kho Để Cân"
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item md={12} lg={4}>
                  <Field
                    name="plantCode"
                    label="Đơn Vị Xuất Hàng"
                    component={MuiInput}
                    select
                    options={organizations}
                    disabled={false}
                    labelKey="name"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onInputChange={this.onPlantChange}
                  />
                </Grid>
                <Grid item md={12} lg={8}>
                  <Field
                    name="receiptId"
                    label="Phiếu Xuất Kho"
                    component={MuiInput}
                    select
                    options={receipts}
                    disabled={false}
                    valueKey="id"
                    getOptionLabel={getReceiptDisplayName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.actionButtons}>
              <MuiButton
                onClick={this.onScaleClick}
                className={classes.buttonScale}
              >
                Cân
              </MuiButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

Section1.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.shape({
    onScaleClick: PropTypes.func,
    onPlantChange: PropTypes.func,
  }),
  receipts: PropTypes.array,
  organizations: PropTypes.array,
};

Section1.defaultProps = {
  receipts: [],
  organizations: [],
};

const mapStateToProps = createStructuredSelector({
  receipts: makeSelectData('receipts'),
  organizations: makeSelectData('master', 'organizations'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  connectContext,
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(Section1);
