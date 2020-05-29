import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

export const styles = theme => ({
  root: {
    boxShadow: theme.shade.grey,
    borderRadius: theme.shape.borderRadius / 2,
  },
  outline: {
    borderColor: theme.palette.common.white,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      borderColor: 'transparent',
    },
  },
  icon: {
    height: 36,
    minWidth: 42,
    padding: 0,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

export const MuiButton = ({
  classes,
  icon,
  iconAlign,
  IconProps,
  outline,
  children,
  className,
  ...props
}) => {
  let LeftIcon = null;
  let RightIcon = null;

  if (icon) {
    if (iconAlign === 'left') {
      LeftIcon = (
        <Icon
          {...IconProps}
          className={classNames(IconProps.className, {
            [classes.leftIcon]: children,
          })}
        >
          {icon}
        </Icon>
      );
    } else {
      RightIcon = (
        <Icon
          {...IconProps}
          className={classNames(IconProps.className, {
            [classes.rightIcon]: children,
          })}
        >
          {icon}
        </Icon>
      );
    }
  }

  return (
    <Button
      color="primary"
      variant={outline ? 'outlined' : 'contained'}
      className={classNames(
        className,
        classes.root,
        { [classes.outline]: outline },
        { [classes.icon]: icon && !children },
      )}
      {...props}
    >
      {LeftIcon}
      {children}
      {RightIcon}
    </Button>
  );
};

MuiButton.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  iconAlign: PropTypes.oneOf(['left', 'right']),
  IconProps: PropTypes.object,
  outline: PropTypes.bool,
  children: PropTypes.node,
};

MuiButton.defaultProps = {
  outline: false,
  iconAlign: 'left',
  IconProps: {},
};

export default withStyles(styles)(MuiButton);
