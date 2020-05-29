import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const Group = ({ classes, children }) => (
  <Grid
    item
    xl={3}
    lg={3}
    md={6}
    xs={12}
    sm={12}
    className={classes.spaceGroup}
  >
    {children}
  </Grid>
);

Group.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.any,
};

export default Group;
