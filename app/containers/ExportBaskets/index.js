/**
 *
 * ExportBaskets
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { withStyles } from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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
class ExportBaskets extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <React.Fragment>
          <Grid item>
            <Typography variant="h5" className={classes.titleText}>
              Danh Sách Phiếu Xuất Khay Sọt
            </Typography>
          </Grid>
          <FormSection location={this.props.location} />
          <TableSection history={this.props.history} />
        </React.Fragment>
      </div>
    );
  }
}

ExportBaskets.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  location: PropTypes.object,
};

const withReducer = injectReducer({ key: 'exportBaskets', reducer });
const withSaga = injectSaga({ key: 'exportBaskets', saga });

export default compose(
  withStyles(styles),
  withReducer,
  withSaga,
  withImmutablePropsToJS,
)(ExportBaskets);
