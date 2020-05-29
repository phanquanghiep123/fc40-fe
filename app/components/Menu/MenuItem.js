import React from 'react';
import * as PropTypes from 'prop-types';

import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Icon,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import appTheme from '../../containers/App/theme';

export const styles = (theme = appTheme) => ({
  button: {
    marginTop: 1,
    marginBottom: 1,
    borderTopRightRadius: theme.spacing.unit * 4,
    borderBottomRightRadius: theme.spacing.unit * 4,
    '&:focus': {
      backgroundColor: 'transparent',
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  level: {
    width: 'auto',
    marginLeft: 20,
    paddingLeft: 12,
    paddingRight: 12,
    boxShadow: theme.shade.light,
    borderRadius: theme.shape.borderRadius,
    '&$button, &$button:focus, &$button:hover': {
      backgroundColor: '#ffffff',
    },
  },
  level1: {
    paddingLeft: theme.spacing.unit * 3,
    '&$selected, &$selected:hover, &$selected:focus': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  level2: {
    paddingLeft: theme.spacing.unit * 8,
    '&$selected, &$selected:hover, &$selected:focus': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  selected: {},
  textBold: {
    fontWeight: '600',
  },
});

const muiTheme = (theme = appTheme) =>
  createMuiTheme({
    ...theme,
    overrides: {
      MuiListItem: {
        root: {
          paddingTop: theme.spacing.unit,
          paddingBottom: theme.spacing.unit,
        },
      },
    },
  });

/* eslint-disable no-nested-ternary */
export const MenuItem = ({
  classes,
  label,
  count,
  level,
  active,
  hasChildren,
  ...props
}) => (
  <MuiThemeProvider theme={muiTheme()}>
    <ListItem
      {...props}
      button
      classes={{
        root:
          level === 0
            ? classes.level
            : level === 1
              ? classes.level1
              : classes.level2,
        button: classes.button,
        selected: classes.selected,
      }}
      selected={active && level === count - 1} // coloring last item
    >
      <ListItemText
        primary={label}
        classes={{
          primary: active && level !== 0 && classes.textBold,
        }}
      />
      {level <= 1 && // ignore level 0
        hasChildren &&
        (active ? (
          <Icon fontSize="small">arrow_drop_up</Icon>
        ) : (
          <Icon fontSize="small">arrow_drop_down</Icon>
        ))}
    </ListItem>
  </MuiThemeProvider>
);

MenuItem.propTypes = {
  /**
   * Label of menu item
   */
  label: PropTypes.node.isRequired,
  count: PropTypes.number,
  /**
   * Level of menu item
   */
  level: PropTypes.number,
  /**
   * Flag for status active of menu item
   */
  active: PropTypes.bool,
  /**
   * Flag for menu item has children
   */
  hasChildren: PropTypes.bool,
};

MenuItem.defaultProps = {
  count: 0,
  level: 0,
};

export default withStyles(styles())(MenuItem);
