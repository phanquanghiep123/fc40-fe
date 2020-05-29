import { NUM_DIGITS } from 'utils/constants';

/**
 * Cho phép nhập số không âm
 */
export const validNumber = value => {
  if (
    value.formattedValue === '' || // empty
    (!/^0./g.test(value.value) && // 0%, not 0*%
      value.floatValue >= 0)
  ) {
    return true;
  }
  return false;
};

/**
 * Cho phép nhập số thập phân không âm
 */
export const validDecimal = (value, digits = NUM_DIGITS) => {
  if (value.formattedValue === '') {
    return true;
  }

  if (value.floatValue >= 0) {
    const [, countDigits] = String(value.floatValue).split('.');

    if (countDigits) {
      if (countDigits.length > digits) {
        return false;
      }
    }
    return true;
  }
  return false;
};

/*
* Cho phép nhập số thập phân lớn hơn 0
* */
export const validDecimalGreatThanZero = (value, digits = NUM_DIGITS) => {
  if (value.formattedValue === '') {
    return true;
  }
  if (value.floatValue > 0) {
    const [countDigits] = String(value.floatValue).split('.');

    if (countDigits) {
      if (countDigits.length > digits) {
        return false;
      }
    }
    return true;
  }
  return false;
};
/**
 * Cho phép nhập số nguyên không âm
 */
export const validInteger = value => {
  if (
    value.formattedValue === '' || // empty
    (!/^0./g.test(value.value) && // 0%, not 0*%
      value.floatValue >= 0 &&
      Number.isInteger(value.floatValue))
  ) {
    return true;
  }
  return false;
};
