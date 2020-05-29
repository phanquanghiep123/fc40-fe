import React from 'react';

import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

import { MTableToolbar } from 'material-table';

export const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
  },
  title: {
    flex: '1 1 auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    '& *': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  spacer: {},
  actions: {},
  highlight: {
    backgroundColor: '#ffffff',
  },
  searchField: {
    paddingLeft: 0,
    verticalAlign: 'baseline',
  },
});

export const muiTheme = (theme, { localization }) =>
  createMuiTheme({
    ...theme,
    props: {
      MuiInputBase: {
        placeholder: localization.searchPlaceholder || 'Search...',
      },
    },
    overrides: {
      MuiInput: {
        root: {
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            width: '12em',
          },
          '&$focused': {
            [theme.breakpoints.up('sm')]: {
              width: '15em',
            },
          },
          transition: theme.transitions.create('width'),
        },
        underline: {
          border: '1px solid rgba(0, 0, 0, 0.42)',
          paddingTop: theme.spacing.unit / 2,
          paddingRight: theme.spacing.unit,
          paddingBottom: theme.spacing.unit / 2,
          paddingLeft: theme.spacing.unit,
          borderRadius: 999,
          '&:after': {
            borderBottom: 0,
          },
          '&:before': {
            borderBottom: 0,
          },
          '&:hover:not($disabled):not($focused):not($error):before': {
            borderBottom: 0,
            '@media (hover: none)': {
              borderBottom: 0,
            },
          },
        },
      },
    },
  });

export const MuiTableToolbar = props => {
  const options = { localization: props.localization };

  return (
    <MuiThemeProvider theme={theme => muiTheme(theme, options)}>
      <MTableToolbar {...props} />
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(MuiTableToolbar);
