import { getWeightProducts } from '../../containers/NSC_ImportedStockReceipt/WeightPage/transformUtils';

export const transformBasket = datas => {
  const result = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      const nextData = {
        palletBasketCode: data.palletBasketCode,
        palletBasketName: data.shortName,
        basketWeight: data.netWeight,
      };

      result.push(nextData);
    }
  }

  return result;
};

export const transformPallet = datas => {
  const result = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      const nextData = {
        palletCode: data.palletCode,
        palletName: data.palletName,
        palletWeight: data.weight,
      };

      result.push(nextData);
    }
  }

  return result;
};
export const transformWeighedReceipts = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      if (data && data.weightProducts.length > 0) {
        const { weightProducts, ...nextData } = datas[i];
        const nextWeightProducts = getWeightProducts(
          weightProducts,
          nextData.id,
        );

        results.push({ ...nextData, options: nextWeightProducts });
      }
    }
  }

  return results;
};
