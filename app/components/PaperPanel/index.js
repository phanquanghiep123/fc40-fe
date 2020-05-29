import React from 'react';
import { withStyles, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const style = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
  heading: {
    paddingLeft: theme.spacing.unit * 2,
    width: '100%',
    color: theme.palette.text.primary,
  },
});

const PaperPanel = props => {
  const { children, classes, title } = props;
  return (
    <Paper className={classes.root} elevation={1}>
      <Typography variant="h6" gutterBottom className={classes.heading}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

PaperPanel.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.object,
  title: PropTypes.string,
};

export default withStyles(style)(PaperPanel);
