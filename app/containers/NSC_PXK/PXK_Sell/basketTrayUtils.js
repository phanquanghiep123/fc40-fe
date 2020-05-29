import { mapBasketsTrays } from '../PXK/utils';

/**
 * @param {stockList: array} list basket in 'thong tin hang hoa' table
 *
 * @description
 * caculate basket group for table
 * Những vị trí sử dụng: - thao tác check trên checkbox deli
 *                       - thao tác uncheck trên checkbox deli
 *                       - refresh bảng thông tin khay sọt mỗi khi bảng sản phẩm có thay đổi
 */
export const basketGroup = (stockList, deliBasketsTrays) => {
  const dictBasket = {};
  stockList.forEach(basket => {
    if (basket.basketName1 && !dictBasket[basket.basketName1]) {
      dictBasket[basket.basketName1] = {
        quantity: parseInt(basket.basketQuantity1, 10),
        basketCode: basket.basketCode1,
        basketUoM: basket.basketUoM1,
      };
    } else if (dictBasket[basket.basketName1]) {
      dictBasket[basket.basketName1] = {
        quantity:
          parseInt(dictBasket[basket.basketName1].quantity, 10) +
          parseInt(basket.basketQuantity1, 10),
        basketCode: basket.basketCode1,
        basketUoM: basket.basketUoM1,
      };
    }

    if (basket.basketName2 && !dictBasket[basket.basketName2]) {
      dictBasket[basket.basketName2] = {
        quantity: parseInt(basket.basketQuantity2, 10),
        basketCode: basket.basketCode2,
        basketUoM: basket.basketUoM2,
      };
    } else if (dictBasket[basket.basketName2]) {
      dictBasket[basket.basketName2] = {
        quantity:
          parseInt(dictBasket[basket.basketName2].quantity, 10) +
          parseInt(basket.basketQuantity2, 10),
        basketCode: basket.basketCode2,
        basketUoM: basket.basketUoM2,
      };
    }

    if (basket.basketName3 && !dictBasket[basket.basketName3]) {
      dictBasket[basket.basketName3] = {
        quantity: parseInt(basket.basketQuantity3, 10),
        basketCode: basket.basketCode3,
        basketUoM: basket.basketUoM3,
      };
    } else if (dictBasket[basket.basketName3]) {
      dictBasket[basket.basketName3] = {
        quantity:
          parseInt(dictBasket[basket.basketName3].quantity, 10) +
          parseInt(basket.basketQuantity3, 10),
        basketCode: basket.basketCode3,
        basketUoM: basket.basketUoM3,
      };
    }

    if (basket.basketName4 && !dictBasket[basket.basketName4]) {
      dictBasket[basket.basketName4] = {
        quantity: parseInt(basket.basketQuantity4, 10),
        basketCode: basket.basketCode4,
        basketUoM: basket.basketUoM4,
      };
    } else if (dictBasket[basket.basketName4]) {
      dictBasket[basket.basketName4] = {
        quantity:
          parseInt(dictBasket[basket.basketName4].quantity, 10) +
          parseInt(basket.basketQuantity4, 10),
        basketCode: basket.basketCode4,
        basketUoM: basket.basketUoM4,
      };
    }

    if (basket.basketName5 && !dictBasket[basket.basketName5]) {
      dictBasket[basket.basketName5] = {
        quantity: parseInt(basket.basketQuantity5, 10),
        basketCode: basket.basketCode5,
        basketUoM: basket.basketUoM5,
      };
    } else if (dictBasket[basket.basketName5]) {
      dictBasket[basket.basketName5] = {
        quantity:
          parseInt(dictBasket[basket.basketName5].quantity, 10) +
          parseInt(basket.basketQuantity5, 10),
        basketCode: basket.basketCode5,
        basketUoM: basket.basketUoM5,
      };
    }
  });

  // dictBasket
  let basketsTrays = Object.keys(dictBasket).map((basket, index) => ({
    stt: index + 1,
    basketCode: dictBasket[basket].basketCode,
    basketName: basket, // tên khay sọt
    quantity: dictBasket[basket].quantity, // số lượng
    basketUoM: dictBasket[basket].basketUoM, // đơn vị
  }));
  basketsTrays = basketsTrays.concat(deliBasketsTrays);

  return mapBasketsTrays(basketsTrays);
};
