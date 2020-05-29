import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const style = theme => ({
  paper: {
    backgroundColor: theme.palette.secondary.main,
    margin: `0 -${theme.spacing.unit * 3}px`,
    borderRadius: '0px',
    textAlign: 'center',
    color: 'white',
    padding: theme.spacing.unit * 1.5,
  },
});

function Footer(props) {
  const { classes } = props;
  return <Paper className={classes.paper}>FC4.0 © 2019 VinEco.</Paper>;
}

Footer.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(style)(Footer);
