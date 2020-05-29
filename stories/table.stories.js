import React from 'react';

import { storiesOf } from '@storybook/react';

import MuiTable from '../app/components/MuiTable';

import App from './components/App';
import Code from './components/Code';

import TableBasic from './examples/TableBasic';

const TableBasicCode = require('!raw-loader!./examples/TableBasic');

storiesOf('Table', module)
  .addParameters({
    info: {
      propTables: [MuiTable],
      propTablesExclude: [App, Code, TableBasic],
    },
  })
  .add('Basic Example', () => (
    <App>
      <TableBasic />
      <Code>{TableBasicCode}</Code>
    </App>
  ));
