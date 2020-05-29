import React from 'react';

export const { Provider, Consumer } = React.createContext({});

export const connectContext = Component => props => (
  // eslint-disable-next-line prettier/prettier
  <Consumer>
    {context => <Component {...props} context={context} />}
  </Consumer>
);
