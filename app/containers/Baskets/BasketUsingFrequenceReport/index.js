/**
 *
 * BasketUsingFrequenceReport
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withStyles } from '@material-ui/core';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import reducer from './reducer';
import saga from './saga';
import FormSection from './FormSection';
import TableSection from './TableSection';

export const styles = () => ({
  titleText: {
    fontWeight: 500,
    marginTop: 20,
    marginBottom: 20,
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class BasketUsingFrequenceReport extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <React.Fragment>
          <Grid item>
            <Typography variant="h5" className={classes.titleText}>
              Báo Cáo Tần Suất Sử Dụng Khay Sọt
            </Typography>
          </Grid>
          <FormSection {...this.props} />
          <TableSection {...this.props} />
        </React.Fragment>
      </div>
    );
  }
}

BasketUsingFrequenceReport.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  location: PropTypes.object,
  ui: PropTypes.object,
};

const withReducer = injectReducer({
  key: 'basketUsingFrequenceReport',
  reducer,
});

const withSaga = injectSaga({ key: 'basketUsingFrequenceReport', saga });

export default compose(
  withStyles(styles),
  withReducer,
  withSaga,
  withImmutablePropsToJS,
)(BasketUsingFrequenceReport);
