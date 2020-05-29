/* eslint-disable indent */
import { formatToDecimal } from 'utils/numberUtils';

import { SanPhamSchema, LenhSanXuatSchema } from './Schema';

import { TYPE_DIEUCHINH } from './constants';

/**
 * Tỷ lệ chênh lệch = (Khối lượng nhận - Khối lượng giao) / Khối lượng giao (%)
 *
 * @param {number} deliveryQuantity Khối lượng giao
 * @param {number} receiveQuantity Khối lượng nhận
 */
export const getDifferentRatio = (deliveryQuantity, receiveQuantity) => {
  const differentRatio =
    (receiveQuantity - deliveryQuantity) / deliveryQuantity;
  return `${formatToDecimal(differentRatio * 100, 2)}%`;
};

/**
 * Khối lượng chênh lệch = Khối lượng nhận - Khối lượng giao
 *
 * @param {number} deliveryQuantity Khối lượng giao
 * @param {number} receiveQuantity Khối lượng nhận
 */
export const getDifferentQuantity = (deliveryQuantity, receiveQuantity) => {
  const differentQuantity = receiveQuantity - deliveryQuantity;
  return formatToDecimal(differentQuantity);
};

/**
 * Trạng thái điều chỉnh của phiếu
 */
export const getReceiptStatus = datas => {
  if (datas && datas.length) {
    const foundData = datas.find(
      item => item && item.differenceStatus === TYPE_DIEUCHINH.NOT_ADJUSTED,
    );
    if (foundData) {
      return TYPE_DIEUCHINH.NOT_ADJUSTED;
    }
  }
  return TYPE_DIEUCHINH.ADJUSTED;
};

/**
 * Format dữ liệu Danh sách phiếu điều chỉnh
 */
export const transformReceipts = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const parentData = datas[i];

      if (parentData) {
        const childDatas = parentData.listDetails;
        const receiptStatus = getReceiptStatus(childDatas);

        if (childDatas && childDatas.length > 0) {
          for (let j = 0, clen = childDatas.length; j < clen; j += 1) {
            const childData = childDatas[j];

            if (childData) {
              const isMainRow = j === 0;
              const isLastRow = j === clen - 1;

              const rowData = {
                rowIndex: i + 1,
                ...(isMainRow
                  ? {
                      isMainRow: true,
                      ...parentData,
                      receiptStatus,
                    }
                  : {}),
                ...(isLastRow ? { isLastRow: true } : {}),
                ...childData,
              };

              results.push(rowData);
            }
          }
        }
      }
    }
  }

  return results;
};

/**
 * Format dữ liệu Danh sách sản phẩm đièu chỉnh
 */
export const transformProducts = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const parentData = datas[i];

      if (parentData) {
        const childDatas = parentData.farmProductionOrderDtos;

        if (childDatas && childDatas.length > 0) {
          for (let j = 0, clen = childDatas.length; j < clen; j += 1) {
            const childData = childDatas[j];

            if (childData) {
              const isMainRow = j === 0;
              const isLastRow = j === clen - 1;

              const rowData = {
                rowIndex: i + 1,
                ...(isMainRow
                  ? {
                      isMainRow: true,
                      ...parentData,
                    }
                  : {}),
                ...(isLastRow ? { isLastRow: true } : {}),
                ...childData,
                differenceStatus: parentData.differenceStatus,
              };

              results.push(rowData);
            }
          }
        }
      }
    }
  }

  return results;
};

/**
 * Format ngược Danh sách sản phẩm đièu chỉnh
 */
export const transformReverseProducts = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const rowData = datas[i];

      if (rowData) {
        const childData = LenhSanXuatSchema.cast(rowData, {
          stripUnknown: true,
        });

        if (rowData.isMainRow) {
          const parentData = SanPhamSchema.cast(rowData, {
            stripUnknown: true,
          });

          results[rowData.rowIndex - 1] = {
            ...parentData,
            farmProductionOrderDtos: [childData],
          };
        } else {
          const parentData = results[rowData.rowIndex - 1];

          results[rowData.rowIndex - 1] = {
            ...parentData,
            farmProductionOrderDtos: [
              ...parentData.farmProductionOrderDtos,
              childData,
            ],
          };
        }
      }
    }
  }

  return results;
};

/**
 * Format dữ liệu từ Plant
 */
export const transformPlants = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      const nextData = {
        name: data.plantName,
        value: data.plantCode,
      };

      results.push(nextData);
    }
  }

  return results;
};

/**
 * Format dữ liệu từ Supplier
 */
export const transformSuppliers = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      const nextData = {
        name: data.name1,
        value: data.supplierCode,
      };

      results.push(nextData);
    }
  }

  return results;
};

/**
 * Format dữ liệu từ Đơn vị nhận hàng
 */
export const transformOrganizations = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    const allOption = {
      name: 'Tất cả',
      value: '',
    };
    return [allOption, ...datas];
  }

  return results;
};

/**
 * Format dữ liệu từ Trạng thái điều chỉnh
 */
export const transformDifferentTypes = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    const allOption = {
      name: 'Tất cả',
      id: 0,
    };
    return [allOption, ...datas];
  }

  return results;
};
