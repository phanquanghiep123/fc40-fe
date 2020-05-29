/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
// import FontFaceObserver from 'fontfaceobserver';
import history from 'utils/history';
// import 'sanitize.css/sanitize.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-icons/iconfont/material-icons.css';
import { SnackbarProvider } from 'notistack';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// authorize
import { AbilityContext } from 'authorize/ability-context';
import ability from 'authorize/ability';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess'; // eslint-disable-line import/extensions

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Observe loading of Roboto (to remove Roboto, remove the <link> tag in
// the index.html file and this observer)
// const openSansObserver = new FontFaceObserver('Roboto', {});

// When Roboto is loaded, add a font-family using Roboto to the body
// openSansObserver.load().then(() => {
//   document.body.classList.add('fontLoaded');
// });

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
export const { dispatch } = store;

const MOUNT_NODE = document.getElementById('app');

// test ability
// window.ability = ability;

const render = messages => {
  ReactDOM.render(
    <AbilityContext.Provider value={ability}>
      <Provider store={store}>
        <LanguageProvider messages={messages}>
          <ConnectedRouter history={history}>
            <SnackbarProvider maxSnack={3}>
              <App />
            </SnackbarProvider>
          </ConnectedRouter>
        </LanguageProvider>
      </Provider>
    </AbilityContext.Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() =>
      Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/de.js'),
      ]),
    ) // eslint-disable-line prettier/prettier
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  // require('offline-plugin/runtime').install();
  const runtime = require('offline-plugin/runtime'); // eslint-disable-line global-require

  runtime.install({
    onUpdateReady: () => {
      // console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated: () => {
      // console.log('SW Event:', 'onUpdated');
      // Reload the webpage to load into the new version
      window.location.reload();
    },
  });
}
