import { times, clone } from 'lodash';

import { dispatch } from 'app';
import request, { optionReq, METHOD_REQUEST, checkStatus } from 'utils/request';
import { loadingError, setLoading } from 'containers/App/actions';

import { NUMBER_LOCALE_FORMAT, DATETIME_LOCALE_FORMAT } from './constants';
import { CANCEL, AGREE, DELETE_TITLE } from './messages';
import { productCast } from './Schema';

// ***************************************
// #region ajax utilities

export async function get(url, callback) {
  try {
    const response = await request(
      url,
      optionReq({ method: METHOD_REQUEST.GET }),
    );

    // checkStatus(response);

    callback(response);
  } catch (err) {
    dispatch(loadingError(err.message));
  }
}

export async function post(url, body, callback) {
  try {
    dispatch(setLoading(true));
    const response = await request(
      url,
      optionReq({
        method: METHOD_REQUEST.POST,
        body,
      }),
    );

    checkStatus(response);

    callback(response);
  } catch (err) {
    dispatch(loadingError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
}

export async function deleteRequest(url, callback) {
  try {
    const response = await request(
      url,
      optionReq({ method: METHOD_REQUEST.DELETE }),
    );

    checkStatus(response);

    callback(response);
  } catch (err) {
    dispatch(loadingError(err.message));
  }
}

// #endregion

// #region format
export function formatCurrencyTableCell(params) {
  return formatCurrency(params.value) || '';
}

export function formatCurrency(value) {
  if (Number.isNaN(value)) return 0;
  if (typeof value !== 'number') return 0;

  return value.toLocaleString(NUMBER_LOCALE_FORMAT);
}

export function defaultToZero(number) {
  return number || 0;
}

export function toNumber(value) {
  return Number(value);
}

export function parseNumberCellValue(params) {
  return parseReadableStringToNumber(params.newValue);
}

export function parseReadableStringToNumber(string) {
  if (isString(string)) {
    return Number(string.replace(/,/g, ''));
  }

  return string;
}

export function formatDatetimeTableCell(params) {
  return formatDatetime(params.value);
}

export function normalizeNonISODateString(string) {
  if (typeof string !== 'string') return string;

  if (string.includes('Z')) {
    return string;
  }

  return `${string}Z`;
}

export function formatDatetime(ISODateString) {
  const date = new Date(ISODateString);

  return `${date.toLocaleDateString(
    DATETIME_LOCALE_FORMAT,
  )} ${date.toLocaleTimeString(DATETIME_LOCALE_FORMAT)}`;
}

// #endregion

export function coerceEmptyStringToNull(obj) {
  const keys = Object.keys(obj);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < keys.length; i++) {
    // eslint-disable-next-line no-param-reassign
    if (isEmptyString(obj[keys[i]])) obj[keys[i]] = null;
  }

  return obj;
}

export function isString(string) {
  return typeof string === 'string';
}

// check if object `obj` has exactly `number` properties
export function hasProperties(obj, number) {
  return Object.keys(obj).length === number;
}

export function isEmptyString(value) {
  return isString(value) && value.length === 0;
}

// #endregion

export function makeConfirmationOption(
  message,
  callback,
  title = DELETE_TITLE,
) {
  return {
    title,
    message,
    actions: [
      {
        text: CANCEL,
      },
      {
        text: AGREE,
        color: 'primary',
        onClick: callback,
      },
    ],
  };
}

export function makeArrayOfProductCast(quantity = 5) {
  return times(quantity, () => clone(productCast));
}
