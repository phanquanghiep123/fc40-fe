/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { LOGIN_SUCCESS, SUBMIT_LOGIN } from './constants';

/**
 *
 * @param  {res : objetc} response is returned from api when login succes
 *
 * @return {object}    An action object with a type of LOGIN_SUCCESS
 */
export function loginSuccess(res) {
  return {
    type: LOGIN_SUCCESS,
    res,
  };
}

/**
 *
 * @param {login: object} : {username, password}
 * @param {password: string}
 *
 * @return action object login
 */
export function submitLogin(login) {
  return {
    type: SUBMIT_LOGIN,
    login,
  };
}
