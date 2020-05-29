import compact from 'lodash/compact';

import { TYPE_PXK } from './constants';

export const SEPARATOR = ' - ';

/**
 * Tên hiển thị của phiếu
 */
export const getReceiptDisplayName = data => {
  if (data) {
    if (
      [
        TYPE_PXK.PXK_NOI_BO,
        TYPE_PXK.PXK_XUAT_BAN,
        TYPE_PXK.PXK_XUAT_BAN_XA,
      ].includes(data.subType)
    ) {
      return [data.documentCode, data.subTypeName].join(SEPARATOR);
    }

    if (data.subType === TYPE_PXK.PXK_DIEU_CHUYEN) {
      return [data.documentCode, data.subTypeName, data.receiverName].join(
        SEPARATOR,
      );
    }
    return data.documentCode;
  }

  return '';
};

/**
 * Tên hiển thị của sản phẩm
 */
export const getProductDisplayName = data => {
  if (data) {
    return compact([
      data.productName,
      data.processingTypeName,
      data.locatorNameFrom,
      data.slotCode || data.batch,
    ]).join(SEPARATOR);
  }
  return '';
};
