import React from 'react';
// import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Button from './Button';

export const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.grey.A100,
    },
  },
});

export function ButtonWhite({ classes, className, text = 'Lưu', ...rest }) {
  return (
    <Button
      className={classNames(className, classes.root)}
      text={text}
      {...rest}
    />
  );
}

export default withStyles(styles)(ButtonWhite);
