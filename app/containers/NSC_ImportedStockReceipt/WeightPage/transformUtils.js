import findLast from 'lodash/findLast';

import { BasketPalletSchema } from './Schema';

import { TYPE_USER, TYPE_IMPORT, TYPE_PROCESSING } from './constants';

export const getDefaultScale = datas => {
  const defaultScale = BasketPalletSchema.cast();

  if (datas && datas.length > 0) {
    const turnScale = findLast(
      datas,
      item => item && (item.basketCode || item.palletCode),
    );
    if (turnScale) {
      return BasketPalletSchema.cast(
        { ...turnScale, basketQuantity: undefined },
        { stripUnknown: true },
      );
    }
  }

  return defaultScale;
};

export const getWeightProducts = (datas, documentId) => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];
      const nextData = {
        ...data,
        value: Object.values({
          documentId,
          productCode: data.productCode,
          processingType: data.processingType,
          slotCode: data.slotCode,
          finshedProductCode: data.finshedProductCode,
        }).join('.'),
        documentId,
      };

      results.push(nextData);
    }
  }

  return results;
};

export const formatWeighedProduct = data => {
  const nextData = {
    ...data,
    turnToScales: data.turnToScales.filter(
      item => item && item.quantity > 0,
      // item && item.quantity > 0 && item.basketCode && item.basketQuantity > 0,
    ),
  };

  return nextData;
};

export const transformBasket = datas => {
  const result = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      const nextData = {
        basketCode: data.palletBasketCode,
        basketName: data.shortName,
        basketWeight: data.netWeight,
        uoM: data.uoM,
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

export const transformWeighedProduct = data => {
  const result = { ...data };

  result.basketPallet = getDefaultScale(data.turnToScales);

  result.defaultQuantity = data.quantity;
  result.defaultProcessingType = data.processingType;

  if (data.isSupplier === TYPE_USER.NCC) {
    // [Cân hàng của NCC]
    // Nếu [Nhập xuất thẳng] thì luôn là [Sơ chế]
    if (data.importType === TYPE_IMPORT.IMPORT_RIGHT) {
      result.processingType = TYPE_PROCESSING.SO_CHE;
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
