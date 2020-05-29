/**
 * @param {stockList: array} list basket in 'thong tin hang hoa' table
 *
 * @description
 * caculate basket group for table
 */
export const basketGroup = stockList => {
  const dictBasket = {};
  stockList.forEach(basket => {
    if (basket.basketShortName1 && !dictBasket[basket.basketShortName1]) {
      dictBasket[basket.basketShortName1] = {
        quantity: parseInt(basket.basketQuantity1, 10),
        basketCode: basket.basketCode1,
        uoM: basket.basketUoM1,
      };
    } else if (dictBasket[basket.basketShortName1]) {
      dictBasket[basket.basketShortName1] = {
        quantity:
          parseInt(dictBasket[basket.basketShortName1].quantity, 10) +
          parseInt(basket.basketQuantity1, 10),
        basketCode: basket.basketCode1,
        uoM: basket.basketUoM1,
      };
    }

    if (basket.basketShortName2 && !dictBasket[basket.basketShortName2]) {
      dictBasket[basket.basketShortName2] = {
        quantity: parseInt(basket.basketQuantity2, 10),
        basketCode: basket.basketCode2,
        uoM: basket.basketUoM2,
      };
    } else if (dictBasket[basket.basketShortName2]) {
      dictBasket[basket.basketShortName2] = {
        quantity:
          parseInt(dictBasket[basket.basketShortName2].quantity, 10) +
          parseInt(basket.basketQuantity2, 10),
        basketCode: basket.basketCode2,
        uoM: basket.basketUoM2,
      };
    }

    if (basket.basketShortName3 && !dictBasket[basket.basketShortName3]) {
      dictBasket[basket.basketShortName3] = {
        quantity: parseInt(basket.basketQuantity3, 10),
        basketCode: basket.basketCode3,
        uoM: basket.basketUoM3,
      };
    } else if (dictBasket[basket.basketShortName3]) {
      dictBasket[basket.basketShortName3] = {
        quantity:
          parseInt(dictBasket[basket.basketShortName3].quantity, 10) +
          parseInt(basket.basketQuantity3, 10),
        basketCode: basket.basketCode3,
        uoM: basket.basketUoM3,
      };
    }
  });

  // dictBasket
  const basketsTrays = Object.keys(dictBasket).map((basket, index) => ({
    stt: index + 1,
    basketCode: dictBasket[basket].basketCode,
    basketName: basket, // tên khay sọt
    quantity: dictBasket[basket].quantity, // số lượng
    uoM: dictBasket[basket].uoM, // đơn vị
  }));

  return basketsTrays.map((item, index) => ({
    ...item,
    stt: index + 1,
    unit: item.uoM,
  }));
};
