import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core';

import Link from '@material-ui/core/Link';

import styles from './styles';

const NotFound = ({ classes, title, subTitle }) => (
  <div className={classes.main}>
    <div className={classes.title}>{title}</div>
    <div className={classes.subTitle}>{subTitle}</div>
    <Link component={RouterLink} to="/" className={classes.description}>
      Quay về trang chủ
    </Link>
  </div>
);

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

NotFound.defaultProps = {
  title: '404',
  subTitle: 'Không tìm thấy trang :(',
};

export default withStyles(styles)(NotFound);
