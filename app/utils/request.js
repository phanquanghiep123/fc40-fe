/* eslint-disable no-underscore-dangle */
import 'whatwg-fetch';
import { localstoreUtilites } from 'utils/persistenceData';
import MESSAGE from 'containers/App/messageGlobal';

/**
 * @scale auto
 * url connect socket
 */
export const socketUrl = window._env_.SOCKET_URL;
// export const socketUrl = 'wss://localhost:7443/';
// 'wss://localhost:7443/'
// 'ws://192.168.1.92:8089/intranet/scale'
export const socketPath = '';

/**
 * @base Ulr
 */
export const baseUrl = window._env_.BASE_URL;
// export const baseUrl = 'https://fc40-api-gateway-dev.fc40.3si.vn/';
// 'http://118.70.67.54:8135/' : publish

export const signalRUrl = window._env_.SIGNALR_URL;
// export const signalRUrl = 'http://192.168.1.92:5100/';

export const PATH_GATEWAY = {
  REPORTADAPTER_API: 'report-adapter/api/v1',
  IDENTITY: 'identity-api/api/v1',
  BFF_SPA_API: 'bff-spa-api/api/v1',
  AUTHORIZATION_API: 'authorization-api/api/v1',
  MASTERDATA_API: 'resourceplanning-api/api/v1',
  AUTHENTICATION_API: 'authentication-api/api/v1',
  COMMUNICATIONREQUIREMENT_API: 'capacitycontrol-api/api/v1',
  RESOURCEPLANNING_API: 'resourceplanning-api/api/v1',
  FORECASTING_API: 'forecasting-api/api/v1',
};

/**
 * @Methoddocker mssql new user
 * base on request http(s)
 */
export const METHOD_REQUEST = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
};

/**
 *
 * @param {method: string}: GET, POST, PUT, DELETE...
 * @param {body: object}: payload send to server
 * @param {authReq: bool}: reuqest is authorized (must to send with token)
 * @return config header for request
 */
export const optionReq = (
  { method, body, authReq } = { method: 'GET', body: null, authReq: true },
) => {
  const opt = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      accessToken: localstoreUtilites.getAuthFromLocalStorage().meta
        .accessToken,
    },
  };
  if (body) opt.body = JSON.stringify(body);
  if (!authReq) delete opt.headers.Authorization;
  if (body instanceof FormData) {
    delete opt.headers.Accept;
    delete opt.headers['Content-Type'];
    opt.body = body;
  }
  return opt;
};

export const responseCode = {
  ok: 200,
  error: 500,
  badRequest: 400,
  unauthorized: 401,
  forbid: 403,
  notFound: 404,
};

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
export function parseJSON(response) {
  // if (response.status === responseCode.forbid) {
  //   window.location.assign('/trang-404');
  // }

  if (
    response.status === responseCode.unauthorized &&
    window.location.pathname !== '/dang-nhap'
  ) {
    logout();
  }

  return response.json();
}

export const logout = () => {
  localstoreUtilites.removeAuthFromLocalStorage();
  window.location.assign('/dang-nhap');
};

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 * @param  {string} message    A default message when response's status is 404
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
export function checkStatus(response, message) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response;
  }

  let error = { message: MESSAGE.ERROR_SOTHING_HAPPEN };

  if (response.message) {
    error = { message: response.message };
  } else if (response.statusCode === responseCode.error) {
    error = { message: MESSAGE.ERROR_SERVER };
  } else if (response.statusCode === responseCode.notFound) {
    error = {
      message: message || MESSAGE.ERROR_NOTFOUND,
    };
  } else if (response.statusCode === responseCode.badRequest) {
    error = { message: MESSAGE.ERROR_SERVER_REJECT };
  }

  throw error;
}

/**
 * Request with token
 */
export function requestAuth(path, options = {}, saveFile) {
  return request(path, { ...optionReq(), ...options }, saveFile);
}

/**
 * Request with token
 */
export function tempRequestAuth(path, options = {}, saveFile) {
  return tempRequest(path, { ...optionReq(), ...options }, saveFile);
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} path       The path we want to request. e.g: /login
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(path, options, saveFile) {
  let callback;
  if (saveFile) {
    callback = saveFile;
  } else {
    callback = parseJSON;
  }
  return fetch(`${baseUrl}${path}`, options).then(callback);
}

/**
 * Cloned from the function request above for testing local api
 *
 * @param path
 * @param options
 * @param saveFile
 * @returns {Promise<Response>}
 */
export function tempRequest(path, options, saveFile) {
  let callback;
  if (saveFile) {
    callback = saveFile;
  } else {
    callback = parseJSON;
  }
  return fetch(path, options).then(callback);
}
