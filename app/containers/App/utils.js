/* eslint-disable no-bitwise */
import { parseJSON } from 'utils/request';
import { isEmpty, slice, findIndex } from 'lodash';
import moment from 'moment';
function getFileName(response) {
  let filename = '';
  const disposition = response.headers.get('content-disposition');
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /UTF-8(.*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
    }
  }
  return filename;
}

/**
 * Generate UUID - Universal unique ID
 * @param a - placeholder
 * @returns {string}
 * @link https://gist.github.com/jed/982883
 */
export function generateUUID(a = undefined) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
}

/**
 * Save excel file from API response
 *
 * @return {function(*): *}
 */

export function makeSaveFileFunc(name) {
  return response => {
    if (!response.headers.get('content-type')) {
      throw Object({ message: 'Không thể tải xuống' });
    }
    if (response.headers.get('content-type').indexOf('application/json') > -1)
      return parseJSON(response);
    if (response.status === 200) {
      const fileName = name || getFileName(response);
      response.blob().then(myBlob => {
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(myBlob, fileName);
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(myBlob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }
    return response;
  };
}

/**
 * Serialize query params
 *
 * @param {object} queryParams
 * @returns {string}
 */
export function serializeQueryParams(queryParams) {
  return Object.keys(queryParams)
    .filter(
      key =>
        typeof queryParams[key] !== 'undefined' &&
        queryParams[key] !== null &&
        queryParams[key] !== '',
    )
    .map(key => `${key}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
}

// Lấy giá trị từ SelectAutocomplete nếu không có giá trị được chọn thì map tất cả
export function getSAVWithJoin(selectedObj, options = []) {
  return selectedObj instanceof Object
    ? selectedObj.value
    : options.map(item => item.value).join(',');
}
// Lấy giá trị từ SelectAutocomplete nếu không có giá trị được chọn thì để trống
export function getSAVWithoutJoin(selectedObj) {
  return selectedObj instanceof Object ? selectedObj.value : '';
}

export function getSAVWithDefault(selectedObj, defaulValue) {
  return selectedObj instanceof Object ? selectedObj.value : defaulValue;
}

/**
 * Check if Date Object is valid date
 *
 * @param {Object} dateObj
 * @return {boolean}
 */
export function isValidDate(dateObj) {
  return dateObj instanceof Date && !Number.isNaN(dateObj.getTime());
}

/**
 * Convert date into format dd/mm/yyyy
 *
 * @param {(string|Date)} date
 * @param {boolean} withYear
 * @returns {string|boolean}
 */
export function convertDateString(date, withYear = true) {
  if (date === null) {
    return false;
  }

  let dateObj = date;
  if (typeof date === 'string' && date.length > 0) {
    dateObj = new Date(date);
  }

  if (!isValidDate(dateObj)) {
    return false;
  }

  function twoDigits(num) {
    return `0${num}`.slice(-2);
  }

  if (!withYear) {
    return `${twoDigits(dateObj.getDate())}/${twoDigits(
      dateObj.getMonth() + 1,
    )}`;
  }

  return `${twoDigits(dateObj.getDate())}/${twoDigits(
    dateObj.getMonth() + 1,
  )}/${dateObj.getFullYear()}`;
}

/**
 * Convert date into format hh:mm:ss
 *
 * @param {(string|Date)} date
 * @returns {string|boolean}
 */
export function convertTimeString(date) {
  if (date === null) {
    return false;
  }

  let dateObj = date;
  if (typeof date === 'string' && date.length > 0) {
    dateObj = new Date(date);
  }

  if (!isValidDate(dateObj)) {
    return false;
  }

  function twoDigits(num) {
    return `0${num}`.slice(-2);
  }

  return `${twoDigits(dateObj.getHours())}:${twoDigits(
    dateObj.getMinutes(),
  )}:${twoDigits(dateObj.getSeconds())}`;
}

/**
 * Convert date into format dd/mm/yyyy hh:mm:ss
 *
 * @param {(string|Date)} date
 * @param {boolean} withYear
 * @returns {string|boolean}
 */
export function convertDateTimeString(date, withYear = true) {
  if (date === null) {
    return false;
  }

  let dateObj = date;
  if (typeof date === 'string' && date.length > 0) {
    dateObj = new Date(date);
  }

  if (!isValidDate(dateObj)) {
    return false;
  }

  function twoDigits(num) {
    return `0${num}`.slice(-2);
  }

  if (!withYear) {
    return `${twoDigits(dateObj.getDate())}/${twoDigits(
      dateObj.getMonth() + 1,
    )} ${twoDigits(dateObj.getHours())}:${twoDigits(
      dateObj.getMinutes(),
    )}:${twoDigits(dateObj.getSeconds())}`;
  }

  return `${twoDigits(dateObj.getDate())}/${twoDigits(
    dateObj.getMonth() + 1,
  )}/${dateObj.getFullYear()} ${twoDigits(dateObj.getHours())}:${twoDigits(
    dateObj.getMinutes(),
  )}:${twoDigits(dateObj.getSeconds())}`;
}
/**
 * Convert date into format dd/mm/yyyy hh:mm
 *
 * @param {(string|Date)} date
 * @param {boolean} withYear
 * @returns {string|boolean}
 */
export function convertDateTimeStringNoSecond(date, withYear = true) {
  if (date === null) {
    return false;
  }

  let dateObj = date;
  if (typeof date === 'string' && date.length > 0) {
    dateObj = new Date(date);
  }

  if (!isValidDate(dateObj)) {
    return false;
  }

  function twoDigits(num) {
    return `0${num}`.slice(-2);
  }

  if (!withYear) {
    return `${twoDigits(dateObj.getDate())}/${twoDigits(
      dateObj.getMonth() + 1,
    )} ${twoDigits(dateObj.getHours())}:${twoDigits(
      dateObj.getMinutes(),
    )}:${twoDigits(dateObj.getSeconds())}`;
  }

  return `${twoDigits(dateObj.getDate())}/${twoDigits(
    dateObj.getMonth() + 1,
  )}/${dateObj.getFullYear()} ${twoDigits(dateObj.getHours())}:${twoDigits(
    dateObj.getMinutes(),
  )}`;
}

export function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = decodeURIComponent(
    atob(base64Url)
      .split('')
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );

  return JSON.parse(base64);
}

/**
 * Convert date into format hh:mm
 *
 * @param {(string|Date)} date
 * @returns {string|boolean}
 */
export function convertHourMinString(date) {
  if (date === null) {
    return false;
  }

  let dateObj = date;
  if (typeof date === 'string' && date.length > 0) {
    dateObj = new Date(date);
  }

  if (!isValidDate(dateObj)) {
    return false;
  }

  function twoDigits(num) {
    return `0${num}`.slice(-2);
  }

  return `${twoDigits(dateObj.getHours())}:${twoDigits(dateObj.getMinutes())}`;
}

/**
 * Calculate date gap
 * @param fromDate - from this date
 * @param toDate - to this date
 * @returns {number}
 */
export function calcDateGap(fromDate, toDate) {
  const dt1 = new Date(fromDate);
  const dt2 = new Date(toDate);
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      86400000, // 1000 * 60 * 60 * 24
  );
}
export function getFarmsWithFromAndTo(farms = [], from = null, to = null) {
  if (isEmpty(farms) || (!from && !to)) return farms;
  const startIndex = from ? findIndex(farms, obj => obj.value === from) : 0;
  const toIndex = to ? findIndex(farms, obj => obj.value === to) : startIndex;
  const lenght = toIndex > startIndex ? toIndex : startIndex;
  return slice(farms, startIndex, lenght + 1);
}

export function converYearMonthDay(date) {
  return moment([date.getFullYear(), date.getMonth(), date.getDate()]);
}

/**
 * Generate option "Tất cả"
 * @param {array} data - field options
 * @param {object} optionAll
 * @returns {array}
 */
export function genOptionAll(
  data,
  optionAll = {
    value: 0,
    label: 'Tất cả',
  },
) {
  return data.length > 1 ? [optionAll] : [];
}

export function ConvertUTCtoClient(datetime, sortDate = false) {
  const localDate = moment
    .utc(datetime)
    .local()
    .format();
  return sortDate
    ? convertDateString(localDate)
    : convertDateTimeString(localDate);
}

export function setSortMuiTable(tableRef, orderBy, orderDirection) {
  // eslint-disable-next-line no-param-reassign
  tableRef.dataManager.orderBy = orderBy;
  // eslint-disable-next-line no-param-reassign
  tableRef.dataManager.orderDirection = orderDirection;
  tableRef.dataManager.sortData();
  tableRef.dataManager.pageData();
  tableRef.setState(tableRef.dataManager.getRenderState());
}

/**
 * Update filters to URL
 * @param {Object} history - history object provided by react-router-dom
 * @param {Object} filters - submittedFilters
 */
export function updateUrlFilters(history, filters) {
  if (typeof filters !== 'object') return;
  const filterStr = serializeQueryParams({ ...filters, total: null });
  history.replace(`${history.location.pathname}?${filterStr}`);
}

/**
 * Get value of nested key inside object safely
 * @param object
 * @param keys
 * @returns {*}
 */
export function getNested(object, ...keys) {
  return keys.reduce((a, b) => (a || {})[b], object);
}

/**
 * Check if valid number string
 * @param str
 * @returns {boolean}
 */
export function isNumberString(str) {
  if (!str && str !== 0) return false;
  if (typeof str === 'number') return true;
  return typeof str === 'string' && /^[-+]?[0-9]*(.[0-9]+)?$/g.test(str.trim());
}

/**
 * Convert url param values
 * @param obj
 */
export function convertUrlParamValues(obj) {
  const newObj = { ...obj };
  const keys = Object.keys(newObj);

  keys.forEach(key => {
    const value = newObj[key];
    if (isNumberString(value)) {
      newObj[key] = parseFloat(value);
    }
    if (value === 'true') newObj[key] = true;
    if (value === 'false') newObj[key] = false;
    if (typeof value === 'object') {
      newObj[key] = convertUrlParamValues(value);
    }
  });

  return newObj;
}

/**
 * Get all URL params
 * @param {string|Object} urlOrHistory - url string or history object provided by react router dom
 * @see https://www.sitepoint.com/get-url-parameters-with-javascript/
 */
export function getUrlParams(urlOrHistory) {
  let url = urlOrHistory;

  if (typeof urlOrHistory === 'object') {
    url =
      getNested(urlOrHistory, 'location', 'search') ||
      urlOrHistory.search ||
      '';
  }

  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  const obj = {};

  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    [queryString] = queryString.split('#');

    // split our query string into its component parts
    const arr = queryString.split('&');

    for (let i = 0; i < arr.length; i += 1) {
      // separate the keys and the values
      const a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      const paramName = a[0];
      let paramValue = typeof a[1] === 'undefined' ? true : a[1];

      if (typeof paramValue === 'string')
        paramValue = decodeURIComponent(paramValue);

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?]$/)) {
        // create key if it doesn't exist
        const key = paramName.replace(/\[(\d+)?]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+]$/)) {
          // get the index value and add the entry at the appropriate position
          const index = /\[(\d+)]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else if (!obj[paramName]) {
        // if it doesn't exist, create property
        obj[paramName] = paramValue;
      } else if (obj[paramName] && typeof obj[paramName] === 'string') {
        // if property does exist and it's a string, convert it to an array
        obj[paramName] = [obj[paramName]];
        obj[paramName].push(paramValue);
      } else {
        // otherwise add the property
        obj[paramName].push(paramValue);
      }
    }
  }

  const searchKeys = Object.keys(obj);
  searchKeys.forEach(key => {
    const searchValue = obj[key];
    if (isNumberString(searchValue)) {
      obj[key] = parseFloat(searchValue);
    }
  });

  return convertUrlParamValues(obj);
}

/**
 * Open window print
 * @param printData
 * @param isPreview
 */
export function openPrintWindow(printData, isPreview = false) {
  const win = window.open('', 'win', 'width="100%",height="100%"'); // a window object
  if (win === null)
    throw Object({
      message:
        'Trình duyệt đang chặn popup trên trang này! Vui lòng bỏ chặn popup',
    });

  win.document.open('text/html', 'replace');
  win.document.write(printData);
  win.document.close();

  if (!isPreview) {
    win.onload = function() {
      win.print();
      win.close();
    };
  }
}
