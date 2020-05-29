/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const selectRouter = state => state.get('router');

const makeSelectLoading = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['system', 'loading']),
  );

const makeSelectStatus = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['system', 'status']),
  );

const makeSelectDialog = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['ui', 'openDialog']),
  );

const makeSelectLocation = () =>
  createSelector(selectRouter, routerState => routerState.get('location'));

const makeSelectAuth = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['auth', 'isAuthenticated']),
  );

const makeSelectMenu = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['auth', 'menu']),
  );

const makeSelectHeader = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['auth', 'header']),
  );

const makeSelectFullName = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['auth', 'fullName']),
  );

const makeSelectUserIdLogin = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['auth', 'userIdLogin']),
  );

const makeSelectStatusDevice = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['device', 'status']),
  );

const makeSelectedWeight = () =>
  createSelector(selectGlobal, globalState =>
    globalState.getIn(['device', 'weight']),
  );

export {
  selectGlobal,
  makeSelectLoading,
  makeSelectLocation,
  makeSelectStatus,
  makeSelectDialog,
  makeSelectAuth,
  makeSelectMenu,
  makeSelectHeader,
  makeSelectFullName,
  makeSelectUserIdLogin,
  makeSelectStatusDevice,
  makeSelectedWeight,
};
