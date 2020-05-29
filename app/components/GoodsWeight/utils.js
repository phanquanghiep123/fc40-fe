import findLast from 'lodash/findLast';

import { getIn } from 'formik';

import { TYPE_BASE_UNIT } from 'utils/constants';
import { formatToNumber, formatToDecimal } from 'utils/numberUtils';

import { BasketSchema, PalletSchema, BasketPalletSchema } from './Schema';

/**
 * @returns {number} Giá trị số
 */
export function numberParser(params) {
  return formatToNumber(params.newValue);
}

/**
 * @returns {number} Giá trị số thập phân
 */
export function decimalParser(params) {
  return formatToDecimal(params.newValue);
}

/**
 * @returns {number|string} Giá trị số hoặc ký tự trắng
 */
export function numberFormatter(params, valueDef = '') {
  return formatToNumber(params.value) || valueDef;
}

/**
 * Tổng khối lượng của các lần cân
 *
 * @param {array} datas Các lần cân
 * @returns {number}
 */
export function getTotalQuantity(datas) {
  if (datas && datas.length > 0) {
    // Khối lượng thực tế = Tổng (Khối lượng thực)
    const totalQuantity = datas.reduce((sum, value) => {
      if (value && value.realQuantity > 0) {
        return sum + formatToNumber(value.realQuantity);
      }
      return sum;
    }, 0);
    return formatToDecimal(totalQuantity);
  }
  return 0;
}

/**
 * Danh sách các lần cân thỏa mãn
 *
 * @returns {array}
 */
export function getTurnToScales(datas) {
  if (datas && datas.length > 0) {
    return datas.filter(
      // Khối lượng cân
      item => item && item.quantity > 0,
    );
  }
  return [];
}

/**
 * Thông tin khay sọt mặc định
 */
export function getDefaultScale(datas, baskets, pallets) {
  let values = {};

  if (baskets && baskets.length > 0) {
    values = {
      ...values,
      ...baskets[0],
    };
  }
  if (pallets && pallets.length > 0) {
    values = {
      ...values,
      ...pallets[0],
    };
  }

  if (datas && datas.length > 0) {
    const turnScale = findLast(
      datas,
      item => item && (item.basketCode || item.palletCode),
    );

    if (turnScale) {
      if (turnScale.basketCode) {
        values = {
          ...values,
          ...BasketSchema.cast(turnScale, { stripUnknown: true }),
        };
      }
      if (turnScale.palletCode) {
        values = {
          ...values,
          ...PalletSchema.cast(turnScale, { stripUnknown: true }),
        };
      }

      values = {
        ...values,
        basketQuantity: 0,
      };
    }
  }

  return BasketPalletSchema.cast(values, { stripUnknown: true });
}

/**
 * Biến đổi dữ liệu từ api trả về
 *
 * @param {array} datas
 * @returns {array} Danh sách basket
 */
export function transformBaskets(datas) {
  const results = [];
  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      const nextData = {
        basketCode: data.palletBasketCode,
        basketName: data.shortName,
        basketWeight: data.netWeight,
        basketUoM: data.uoM,
      };

      results.push(BasketSchema.cast(nextData));
    }
  }

  return results;
}

/**
 * Biến đổi dữ liệu từ api trả về
 *
 * @param {array} datas
 * @returns {array} Danh sách pallet
 */
export function transformPallets(datas) {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      const nextData = {
        palletCode: data.palletCode,
        palletName: data.palletName,
        palletWeight: data.weight,
      };

      results.push(PalletSchema.cast(nextData));
    }
  }

  return results;
}

/**
 * Tính toán Khối lượng thực
 *
 * @param {object|class} context
 * @param {object}       rowData
 * @requires {number}
 */
export function calculateRealQuantity(context, rowData) {
  /**
   * TH đơn vị cơ bản là KG:
   *    Khối lượng thực = Khối lượng cân - (Khối lượng sọt * Số lượng sọt) - (Khối lượng pallet * Số lượng pallet)
   * TH còn lại:
   *    Khối lượng thực = Khối lượng cân
   */
  // Đơn vị cơ bản
  const baseUoM = getIn(context.props.values, 'baseUoM', TYPE_BASE_UNIT.KG);

  // Khối lượng cân
  const quantityValue = formatToNumber(rowData.quantity);

  if (quantityValue > 0) {
    if (baseUoM === TYPE_BASE_UNIT.KG) {
      const otherValue =
        formatToNumber(rowData.basketWeight) *
          formatToNumber(rowData.basketQuantity) +
        formatToNumber(rowData.palletWeight) *
          formatToNumber(rowData.palletQuantity);
      return formatToDecimal(quantityValue - otherValue);
    }
    return formatToDecimal(quantityValue);
  }
  return 0;
}
