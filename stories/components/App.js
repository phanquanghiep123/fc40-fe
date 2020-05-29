import React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';

import theme from '../../app/containers/App/theme';

/* eslint-disable no-underscore-dangle */
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

export default function App({ children, ...props }) {
  return (
    <div {...props}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </div>
  );
}
