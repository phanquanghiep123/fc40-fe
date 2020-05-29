/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { ThemeProvider } from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';
import viLocale from 'date-fns/locale/vi';

import DateFnsUtils from '@date-io/date-fns';

import ability from 'authorize/ability';

import SingInPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ResetPassword from 'containers/ResetPasswordPage/Loadable';

import PrivateRoute from './PrivateRoute';

import GlobalStyle from '../../global-styles';

import appRoutes from './routes';

import theme from './theme';

/* eslint-disable no-underscore-dangle */
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const getRoutes = routes =>
  routes.map((route, i) => {
    let isCan = true;
    // Kiểm tra người dùng có quyền trên route?
    if (Array.isArray(route.canDo) && route.canOn) {
      isCan = false;
      route.canDo.forEach(item => {
        if (ability.can(item, route.canOn)) {
          isCan = true;
        }
      });
    } else if (route.canDo && route.canOn) {
      isCan = ability.can(route.canDo, route.canOn);
    }

    return (
      <PrivateRoute
        key={String(i)}
        exact
        path={route.path}
        title={route.title}
        isCan={isCan}
        component={route.component}
      />
    );
  });

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
          <Helmet titleTemplate="%s - VinEco" defaultTitle="VinEco">
            <meta name="describe" content="VinEco" />
          </Helmet>
          <Switch>
            <Route exact path="/dang-nhap" component={SingInPage} />
            <Route exact path="/dat-lai-mat-khau" component={ResetPassword} />
            {getRoutes(appRoutes)}
            <Route path="" component={NotFoundPage} />
          </Switch>
          <GlobalStyle />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}
