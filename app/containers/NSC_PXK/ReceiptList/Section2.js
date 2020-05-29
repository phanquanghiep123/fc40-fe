import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { makeSelectData } from './selectors';

import GridList from './GridList';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
});

export const Section2 = ({ classes, formik, receipts }) => (
  <Card className={classes.section}>
    <CardHeader
      title="II. Danh Sách Phiếu Đang Cân Xuất Kho"
      className={classes.cardHeader}
    />
    <CardContent className={classes.cardContent}>
      <GridList formik={formik} receipts={receipts} />
    </CardContent>
  </Card>
);

Section2.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object,
  receipts: PropTypes.array,
};

Section2.defaultProps = {
  receipts: [],
};

const mapStateToProps = createStructuredSelector({
  receipts: makeSelectData('receipts', 'recently'),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withConnect,
  withImmutablePropsToJS,
  withStyles(styles),
)(Section2);
