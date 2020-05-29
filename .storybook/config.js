import { configure } from '@storybook/react';
import { addDecorator, addParameters } from '@storybook/react';

import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs/react';

import '../stories/styles.css';

addDecorator(withKnobs);
addDecorator(
  withInfo({
    inline: true,
    header: false,
    source: false,
    styles: {
      infoBody: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 20,
      },
      source: { h1: { marginTop: 0, fontSize: '1.25rem' } },
    },
    maxPropStringLength: 1000,
  }),
);

addParameters({
  options: {
    showPanel: false,
  },
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
