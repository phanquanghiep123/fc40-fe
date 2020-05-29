/**
 * [
 *  { productCode: '5000001' },
 *  { productCode: '5000002' },
 * ]
 * => 5000001,5000002
 */
export const getProductCodes = datas => {
  if (datas && datas.length > 0) {
    const parts = [];

    for (let i = 0; i < datas.length; i += 1) {
      const data = datas[i];
      if (data && data.productCode) {
        parts.push(data.productCode);
      }
    }

    return parts.join(',');
  }
  return '';
};
