import React from 'react';

export const { Provider, Consumer } = React.createContext({});

export const connectContext = Component => props => (
  <Consumer>{context => <Component {...props} context={context} />}</Consumer>
);
