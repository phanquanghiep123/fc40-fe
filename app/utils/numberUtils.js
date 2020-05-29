import { bignumber, add, subtract, multiply, divide } from 'mathjs';
import baseIteratee from 'lodash/_baseIteratee';
import { NUM_DIGITS } from './constants';

/**
 * Cộng 2 số thập phân
 */
export function addNumbers(a, b) {
  return add(bignumber(a), bignumber(b)).toNumber();
}

/**
 * Trừ 2 số thập phân
 */
export function subtractNumbers(a, b) {
  return subtract(bignumber(a), bignumber(b)).toNumber();
}

/**
 * Nhân 2 số thập phân
 */
export function multiplyNumbers(a, b) {
  return multiply(bignumber(a), bignumber(b)).toNumber();
}

/**
 * Chia 2 số thập phân
 */
export function divideNumbers(a, b) {
  return divide(bignumber(a), bignumber(b)).toNumber();
}

/**
 * Kiểm tra giá trị là số
 * @param {number|string} value
 * @returns `boolean`
 */
export function isNumber(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return Number.isFinite(value * 1);
  }
  return false;
}

/**
 * Định dạng sang số, trả về 0 nếu giá trị không phải là sô
 * @param {number|string} value
 * @returns `number`
 */
export function formatToNumber(value) {
  if (isNumber(value)) {
    return value * 1;
  }
  return 0;
}

/**
 * Định dạng sang số thập phân, trả về 0 nếu giá trị không phải là sô
 * @param {number|string} value
 * @param {number} digits số chữ số sau dấu thập phân, mặc định là 3
 * @returns `number`
 */
export function formatToDecimal(value, digits = NUM_DIGITS) {
  if (isNumber(value)) {
    return Number((value * 1).toFixed(digits));
  }
  return 0;
}

/**
 * Định dạng sang số tiền có dấu phẩy phân cách hàng nghìn, trả về chuỗi giá trị 0 nếu giá trị không phải là sô
 * @param {number|string} value
 * @param {number} digits số chữ số sau dấu thập phân, mặc định là 3
 * @returns `string`
 */
export function formatToCurrency(value, digits = NUM_DIGITS) {
  const decimalValue = formatToDecimal(value, digits).toString();
  return decimalValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
// Mở rộng sumBy của lodash để có thể cộng số thập phân
// ví dụ 0.2 + 0.123 = 0.323
export function sumBy(array, iteratee) {
  return array && array.length ? baseSum(array, baseIteratee(iteratee, 2)) : 0;
}

// Mở rộng sumBy của lodash để có thể cộng số thập phân
// ví dụ 0.2 + 0.123 = 0.323
function baseSum(array, iteratee) {
  let result = 0;

  let index = -1;

  const { length } = array;

  // eslint-disable-next-line no-plusplus
  while (++index < length) {
    const current = iteratee(array[index]);
    if (current !== undefined && current !== '') {
      result = result === undefined ? current : addNumbers(result, current);
    }
  }
  return result;
}
