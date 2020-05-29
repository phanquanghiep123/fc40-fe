import { parseJwt } from 'containers/App/utils';
import { CODE, CAN_CODE, SCREEN_CODE } from './groupAuthorize';

/**
 *
 * @param {token: string} token got after login success
 * @description
 *
 * mapping list auth code from api to
 * list auth of screen corresponding to
 */
export default token => {
  // convert to plain object
  const privileges = parseJwt(token)
    .Privileges.replace(/\s/g, '')
    .split(',');

  /**
   * @input ["CC0001C", "CC0001U", "CC0001R"]
   * @output
   * [{ actions: ['CC0001C', 'CC0001U', 'CC0001R'], subject: 'BBGH' }]
   */
  const authScreen = {
    [SCREEN_CODE.HOME]: { actions: [CODE.read], subject: SCREEN_CODE.HOME },
  }; // init home : read

  for (let i = 0, len = privileges.length; i < len; i += 1) {
    const key = CAN_CODE[privileges[i]];
    if (key) {
      if (!authScreen[key]) {
        authScreen[key] = {
          actions: [],
          subject: key,
        };
      }
      authScreen[key].actions.push(privileges[i]);
    }
  }

  return Object.keys(authScreen).map(screen => authScreen[screen]);
};
