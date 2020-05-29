import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

export const styles = theme => ({
  root: {
    boxShadow: theme.shade.grey,
    borderRadius: 2,
    paddingLeft: 24,
    paddingRight: 24,
  },
  icon: {
    height: 36,
    minWidth: 42,
    padding: 0,
  },
  outline: {
    borderColor: '#fff',
    backgroundColor: '#fff',
    '&:hover': {
      borderColor: 'transparent',
    },
  },
});

export function MuiButton({
  classes,
  text,
  icon,
  IconProps,
  outline,
  className,
  ...props
}) {
  return (
    <Button
      color="primary"
      variant={outline ? 'outlined' : 'contained'}
      className={classNames(
        className,
        classes.root,
        icon && classes.icon,
        outline && classes.outline,
      )}
      {...props}
    >
      {icon ? <Icon {...IconProps}>{icon}</Icon> : text}
    </Button>
  );
}

MuiButton.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  text: PropTypes.string,
  IconProps: PropTypes.object,
  outline: PropTypes.bool,
};

MuiButton.defaultProps = {
  outline: false,
};

export default withStyles(styles)(MuiButton);
