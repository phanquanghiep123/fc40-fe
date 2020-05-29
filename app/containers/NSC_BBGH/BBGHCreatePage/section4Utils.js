import groupBy from 'lodash/groupBy';

import { addNumbers, formatToNumber } from 'utils/numberUtils';

import { TYPE_SUPERVIOR } from './constants';

/**
 * @param {stockList: array} list basket in 'thong tin hang hoa' table
 *
 * @description
 * caculate basket group for table section 5
 */
export const basketGroup = stockList => {
  const dictBasket = {};
  stockList.forEach(basket => {
    if (basket.basketShortName1 && !dictBasket[basket.basketShortName1]) {
      dictBasket[basket.basketShortName1] = {
        amount: parseInt(basket.deliverQuantity1, 10),
        code: basket.basketCode1,
        unit: basket.basketUoM1,
      };
    } else if (dictBasket[basket.basketShortName1]) {
      dictBasket[basket.basketShortName1] = {
        amount:
          parseInt(dictBasket[basket.basketShortName1].amount, 10) +
          parseInt(basket.deliverQuantity1, 10),
        code: basket.basketCode1,
        unit: basket.basketUoM1,
      };
    }

    if (basket.basketShortName2 && !dictBasket[basket.basketShortName2]) {
      dictBasket[basket.basketShortName2] = {
        amount: parseInt(basket.deliverQuantity2, 10),
        code: basket.basketCode2,
        unit: basket.basketUoM2,
      };
    } else if (dictBasket[basket.basketShortName2]) {
      dictBasket[basket.basketShortName2] = {
        amount:
          parseInt(dictBasket[basket.basketShortName2].amount, 10) +
          parseInt(basket.deliverQuantity2, 10),
        code: basket.basketCode2,
        unit: basket.basketUoM2,
      };
    }

    if (basket.basketShortName3 && !dictBasket[basket.basketShortName3]) {
      dictBasket[basket.basketShortName3] = {
        amount: parseInt(basket.deliverQuantity3, 10),
        code: basket.basketCode3,
        unit: basket.basketUoM3,
      };
    } else if (dictBasket[basket.basketShortName3]) {
      dictBasket[basket.basketShortName3] = {
        amount:
          parseInt(dictBasket[basket.basketShortName3].amount, 10) +
          parseInt(basket.deliverQuantity3, 10),
        code: basket.basketCode3,
        unit: basket.basketUoM3,
      };
    }
  });

  // dictBasket
  const basketsTrays = Object.keys(dictBasket).map((basket, index) => ({
    stt: index + 1,
    code: dictBasket[basket].code,
    name: basket, // tên khay sọt
    amount: dictBasket[basket].amount, // số lượng
    unit: dictBasket[basket].unit,
    amountReal: '', // số lượng thực tế
  }));

  return basketsTrays;
};

export const basketInforGroup = stockList => {
  const dictBasket = {};

  stockList.forEach(basket => {
    if (basket.basketShortName1 && !dictBasket[basket.basketShortName1]) {
      dictBasket[basket.basketShortName1] = {
        deliverQuantity: parseInt(basket.deliverQuantity1, 10),
        basketCode: basket.basketCode1,
        basketUom: basket.basketUoM1,
      };
    } else if (dictBasket[basket.basketShortName1]) {
      dictBasket[basket.basketShortName1] = {
        deliverQuantity:
          parseInt(dictBasket[basket.basketShortName1].deliverQuantity, 10) +
          parseInt(basket.deliverQuantity1, 10),
        basketCode: basket.basketCode1,
        basketUom: basket.basketUoM1,
      };
    }

    if (basket.basketShortName2 && !dictBasket[basket.basketShortName2]) {
      dictBasket[basket.basketShortName2] = {
        deliverQuantity: parseInt(basket.deliverQuantity2, 10),
        basketCode: basket.basketCode2,
        basketUom: basket.basketUoM2,
      };
    } else if (dictBasket[basket.basketShortName2]) {
      dictBasket[basket.basketShortName2] = {
        deliverQuantity:
          parseInt(dictBasket[basket.basketShortName2].deliverQuantity, 10) +
          parseInt(basket.deliverQuantity2, 10),
        basketCode: basket.basketCode2,
        basketUom: basket.basketUoM2,
      };
    }

    if (basket.basketShortName3 && !dictBasket[basket.basketShortName3]) {
      dictBasket[basket.basketShortName3] = {
        deliverQuantity: parseInt(basket.deliverQuantity3, 10),
        basketCode: basket.basketCode3,
        basketUom: basket.basketUoM3,
      };
    } else if (dictBasket[basket.basketShortName3]) {
      dictBasket[basket.basketShortName3] = {
        deliverQuantity:
          parseInt(dictBasket[basket.basketShortName3].deliverQuantity, 10) +
          parseInt(basket.deliverQuantity3, 10),
        basketCode: basket.basketCode3,
        basketUom: basket.basketUoM3,
      };
    }
  });

  // dictBasket
  const basketsInfor = Object.keys(dictBasket).map((basket, index) => ({
    stt: index + 1,
    basketCode: dictBasket[basket].basketCode,
    basketName: basket, // tên khay sọt
    deliverQuantity: dictBasket[basket].deliverQuantity, // số lượng
    basketUom: dictBasket[basket].basketUom,
    receiverQuantity: 0, // số lượng thực tế
  }));
  return basketsInfor;
};

export const getTotalBaskets = datas => {
  if (datas && datas.length > 0) {
    return datas.reduce(
      (result, value) => {
        if (value) {
          let { amount } = result;

          if (value.amount > 0) {
            amount = addNumbers(result.amount, formatToNumber(value.amount));
          }

          return { amount };
        }
        return result;
      },
      { amount: 0 },
    );
  }
  return null;
};

export const validateDuplicate = (datas, afterCheckFunc) => {
  if (datas && datas.length > 0) {
    const getKey = value =>
      `${value.productionOrder}_${value.doConnectingId}_${
        value.processingType
      }`;
    const grouped = groupBy(datas, value => getKey(value));

    for (let i = 0, len = datas.length; i < len; i += 1) {
      const value = datas[i];

      if (
        value &&
        value.doConnectingId &&
        value.processingType &&
        value.productionOrder
      ) {
        const key = getKey(value);
        if (grouped[key] && grouped[key].length > 1) {
          afterCheckFunc(value, i);
        }
      }
    }
  }
};

export const transformStockList = datas => {
  const result = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      let nextData = datas[i];

      if (nextData) {
        nextData = {
          ...nextData,
          isTranscoding:
            nextData.productionSupervior === TYPE_SUPERVIOR.BY_CODE,
        };

        if (nextData.productionSupervior === TYPE_SUPERVIOR.NONE) {
          nextData = {
            ...nextData,
            originalCode: nextData.doConnectingId,
            originalType: nextData.productType,
            originalTypeName: nextData.productTypeName,
            originalDescription: nextData.materialDescription,
          };
        }
      }

      result.push(nextData);
    }
  }

  return result;
};
