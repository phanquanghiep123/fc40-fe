import React, { Component } from 'react';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
const backgroundHomePage = require('../../images/background_homepage.svg');

export default class App extends Component {
  state = {};

  render() {
    return (
      <Can do={CODE.read} on={SCREEN_CODE.HOME}>
        <div
          style={{
            backgroundImage: `url(${backgroundHomePage})`,
            backgroundSize: 'contain' /* <------ */,
            backgroundRepeat: 'no-repeat',
            backgroundPosition:
              'center bottom' /* optional, center the image */,
            height: 'calc(100vh - 150px)',
          }}
        />
      </Can>
    );
  }
}
