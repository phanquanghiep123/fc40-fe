import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import baseStyles from './styles';

export const styles = theme => ({
  ...baseStyles(theme),
});

export function Heading({ classes }) {
  return (
    <section className={classes.heading}>
      <Typography variant="h5" className={classes.titleText}>
        Danh Sách Phiếu Đang Cân Xuất Kho
      </Typography>
    </section>
  );
}

Heading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Heading);
