import React from 'react';
// import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from './Button';

export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.orange[800],
    color: theme.palette.getContrastText(theme.palette.orange[800]),
    '&:hover': {
      backgroundColor: theme.palette.orange[900],
      color: theme.palette.getContrastText(theme.palette.orange[900]),
    },
  },
});

export function CompleteButton({ classes, className, text, ...rest }) {
  return (
    <Button
      className={classNames(className, classes.root)}
      text={text}
      {...rest}
    />
  );
}

export default withStyles(styles)(CompleteButton);
