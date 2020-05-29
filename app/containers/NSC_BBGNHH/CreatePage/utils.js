/* eslint-disable indent */
import moment from 'moment';
import dateFns from 'date-fns';

import isEmpty from 'lodash/isEmpty';

import {
  isNumber,
  addNumbers,
  formatToNumber,
  formatToDecimal,
} from 'utils/numberUtils';
import { splitTimes } from 'utils/datetimeUtils';
import { TYPE_BBGNHH } from './constants';

/**
 * Thêm thời gian
 */
export const addHours = (time, amount) => {
  const date = formatDate(new Date(time), formatTime(time));
  return moment(date).add(amount, 'h');
};

/**
 * So sánh thời gian lớn hơn
 */
export const greaterTime = (time1, time2) => {
  const date1 = formatDate(new Date(), formatTime(time1));
  const date2 = formatDate(new Date(), formatTime(time2));
  return dateFns.isAfter(date1, date2);
};

/**
 * Format thành dạng thời gian 24h
 *
 * @example
 * formatTime('') => ''
 * formatTime(new Date()) => '22:00'
 */
export const formatTime = date => {
  if (date) {
    if (dateFns.isValid(new Date(date))) {
      return dateFns.format(new Date(date), 'HH:mm');
    }
    return date;
  }
  return '';
};

/**
 * Format thành ngày giờ theo thời gian truyền vào
 *
 * @example
 * formatDate(new Date(), '22:00')
 */
export const formatDate = (date, time) => {
  const { hours, minutes } = splitTimes(time || 0);

  let nextDate = new Date();
  if (dateFns.isValid(new Date(date))) {
    nextDate = new Date(date);
  }

  nextDate.setHours(hours, minutes);
  return nextDate;
};

/**
 * Sắp xếp theo Cửa hàng và Mã tuyến
 */
export const sortStockList = datas => {
  if (datas && datas.length > 0) {
    return datas.sort((a, b) => {
      if (a && b) {
        if (a.shipToCode < b.shipToCode) {
          return -1;
        }
        if (a.shipToCode > b.shipToCode) {
          return 1;
        }
        if (a.routeCode < b.routeCode) {
          return -1;
        }
        if (a.routeCode > b.routeCode) {
          return 1;
        }
      }
      return 0;
    });
  }
  return [];
};

/**
 * @returns {number} Giá trị số
 */
export const numberParser = params => {
  if (params.newValue !== '' && isNumber(params.newValue)) {
    return formatToNumber(params.newValue);
  }
  return null;
};

/**
 * @returns {number} Giá trị số thập phân
 */
export const decimalParser = params => {
  if (params.newValue !== '' && isNumber(params.newValue)) {
    return formatToDecimal(params.newValue);
  }
  return null;
};

/**
 * @returns {string} Thời gian định dạng 24h
 */
export const timeFormatter = (params, def = '') => {
  if (
    params.value &&
    params.value.toString() &&
    params.value.toString().length > 1
  ) {
    return formatTime(params.value);
  }
  return def;
};

/**
 * @returns {number|string} Giá trị số hoặc ký tự trắng
 */
export const numberFormatter = (params, def = '') =>
  formatToNumber(params.value) || def;

/**
 * @returns {number|string} Giá trị số hoặc ký tự trắng
 */
export const decimalFormatter = (params, def = '') =>
  formatToDecimal(params.value) || def;

/**
 * @returns {number} Tổng SL xuất của Thông tin hàng hóa
 */
export const getTotalStocks = datas => {
  if (datas && datas.length > 0) {
    return datas.reduce((result, value) => {
      if (value && value.quantity > 0) {
        return addNumbers(result, formatToNumber(value.quantity));
      }
      return result;
    }, 0);
  }
  return null;
};

/**
 * @returns {number} Tổng SL giao của Thông tin khay sọt
 */
export const getTotalBaskets = datas => {
  if (datas && datas.length > 0) {
    return datas.reduce((result, value) => {
      if (value && value.totalQuantity > 0) {
        return addNumbers(result, formatToNumber(value.totalQuantity));
      }
      return result;
    }, 0);
  }
  return null;
};

/**
 * Format dữ liệu cho Đại diện giao hàng
 */
export const transformBasket = (
  datas,
  deliveryReceiptType,
  stocksDataBasket,
) => {
  const results = [
    // {
    //   customerCode,
    //   customerName,
    //   basketCode,
    //   basketName,
    //   basketUoM,
    //   totalQuantity
    // }
  ];
  if (deliveryReceiptType === TYPE_BBGNHH.ICD) {
    if (datas && datas.length > 0) {
      const parts = {
        // customerCode: {
        //   customerCode,
        //   customerName,
        //   basketCode: {
        //     basketCode,
        //     basketName,
        //     basketUoM,
        //     totalQuantity
        //   }
        // }
      };

      // Nhóm theo Sold-to (Mã Khách hàng)
      for (let i = 0, len = datas.length; i < len; i += 1) {
        const data = datas[i];

        if (
          data &&
          data.customerCode &&
          (data.basketCode1 || data.basketCode2 || data.basketCode3)
        ) {
          // Kiểm tra xem Sold-to tồn tại
          if (!parts[data.customerCode]) {
            // Init dữ liệu Sold-to
            parts[data.customerCode] = {
              customerCode: data.customerCode,
              customerName: data.customerName,
              basketCode: {},
            };
          }

          // Kiểm tra xem Khay sọt 1 tôn tại trong Sold-to
          if (
            data.basketCode1 &&
            !parts[data.customerCode].basketCode[data.basketCode1]
          ) {
            parts[data.customerCode].basketCode[data.basketCode1] = {
              basketCode: data.basketCode1,
              basketName: data.basketName1,
              basketUoM: data.basketUoM1,
              totalQuantity: 0,
            };
          }

          // Kiểm tra xem Khay sọt 2 tôn tại trong Sold-to
          if (
            data.basketCode2 &&
            !parts[data.customerCode].basketCode[data.basketCode2]
          ) {
            parts[data.customerCode].basketCode[data.basketCode2] = {
              basketCode: data.basketCode2,
              basketName: data.basketName2,
              basketUoM: data.basketUoM2,
              totalQuantity: 0,
            };
          }

          // Kiểm tra xem Khay sọt 3 tôn tại trong Sold-to
          if (
            data.basketCode3 &&
            !parts[data.customerCode].basketCode[data.basketCode3]
          ) {
            parts[data.customerCode].basketCode[data.basketCode3] = {
              basketCode: data.basketCode3,
              basketName: data.basketName3,
              basketUoM: data.basketUoM3,
              totalQuantity: 0,
            };
          }

          // Nhóm khay sọt theo Sold-to
          if (data.basketCode1 && data.deliverQuantity1 > 0) {
            parts[data.customerCode].basketCode[
              data.basketCode1
            ].totalQuantity += formatToNumber(data.deliverQuantity1);
          }

          if (data.basketCode2 && data.deliverQuantity2 > 0) {
            parts[data.customerCode].basketCode[
              data.basketCode2
            ].totalQuantity += formatToNumber(data.deliverQuantity2);
          }

          if (data.basketCode3 && data.deliverQuantity3 > 0) {
            parts[data.customerCode].basketCode[
              data.basketCode3
            ].totalQuantity += formatToNumber(data.deliverQuantity3);
          }
        }
      }

      // Tổng hợp theo Sold-to (Mã Khách hàng)
      Object.values(parts).forEach(customer => {
        if (customer && customer.customerCode) {
          if (isEmpty(customer.basketCode)) {
            const nextData = {
              customerCode: customer.customerCode,
              customerName: customer.customerName,
            };
            results.push(nextData);
          } else {
            // Tổng hợp khay sọt theo Sold-to
            Object.values(customer.basketCode).forEach(basket => {
              if (basket && basket.basketCode) {
                const nextData = {
                  customerCode: customer.customerCode,
                  customerName: customer.customerName,
                  basketCode: basket.basketCode,
                  basketName: basket.basketName,
                  basketUoM: basket.basketUoM,
                  totalQuantity: basket.totalQuantity,
                };
                results.push(nextData);
              }
            });
          }
        }
      });
    }
  } else {
    stocksDataBasket.forEach(item => {
      results.push({
        ...item,
        totalQuantity: item.deliverQuantity,
      });
    });
  }

  return results;
};

/**
 * Format dữ liệu cho Bên vận chuyển
 */
export const transformTransports = (deliveryDate, datas) => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      if (datas[i]) {
        const nextData = { ...datas[i] };

        // TG xuất phát theo quy định = Ngày giao hàng + Giờ xuất phát theo quy định
        if (nextData.regulatedDepartureDate) {
          nextData.regulatedDepartureDate = formatDate(
            deliveryDate,
            formatTime(nextData.regulatedDepartureDate),
          );
        }

        // TG xuất phát thực tế = Ngày giao hàng + Giờ xuất phát thực tế
        if (nextData.actualDepartureDate) {
          nextData.actualDepartureDate = formatDate(
            deliveryDate,
            formatTime(nextData.actualDepartureDate),
          );
        }

        // TG đến theo quy định = TG xuất phát theo quy định + Thời gian di chuyển
        if (nextData.regulatedDepartureDate) {
          nextData.regulatedArrivalDate = addHours(
            nextData.regulatedDepartureDate,
            nextData.drivingDuration,
          );
        }

        // TG dự kiến đến = TG xuất phát thực tế + Thời gian di chuyển
        if (nextData.actualDepartureDate) {
          nextData.plannedArrivalDate = addHours(
            nextData.actualDepartureDate,
            nextData.drivingDuration,
          );
        }

        // TG xe đến thực tế = Ngày giao hàng + Giờ xe đến thực tế
        if (nextData.actualArrivalDate) {
          nextData.actualArrivalDate = formatDate(
            deliveryDate,
            formatTime(nextData.actualArrivalDate),
          );
        }

        // TG trả hàng xong = Ngày giao hàng + Giờ trả hàng xong
        if (nextData.deliveryTime) {
          nextData.deliveryTime = formatDate(
            deliveryDate,
            formatTime(nextData.deliveryTime),
          );
        }

        results.push(nextData);
      }
    }
  }

  return results;
};

/**
 * Format dữ liệu Thông tin hàng hóa từ Deli
 */
export const transformDeliStocks = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      results.push(...transformDeliStock(datas[i], i));
    }
  }

  return results;
};

/**
 * Format dữ liệu từ Deli
 */
export const transformDeliStock = (data, index) => {
  const results = [];

  if (data && data.stocks) {
    const { stocks, ...otherData } = data;
    const stockIds = transformStockIds(stocks);
    const groupedStocks = groupByUoM(stocks);

    for (let i = 0, len = groupedStocks.length; i < len; i += 1) {
      const stock = groupedStocks[i];

      if (stock) {
        const isMainRow = i === 0;
        const isLastRow = i === len - 1;

        const rowData = {
          rowIndex: index,
          ...(isMainRow
            ? {
                isMainRow: true,
                stockIds,
                ...otherData,
              }
            : {}),
          ...(isLastRow ? { isLastRow: true } : {}),
          ...stock,
        };

        results.push(rowData);
      }
    }
  }

  return results;
};

/**
 * Nhóm dữ liệu từ Deli theo Đơn vị tính
 */
export const groupByUoM = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      if (data) {
        const foundIndex = results.findIndex(
          item => item && item.uoM === data.uoM,
        );
        if (foundIndex !== -1) {
          results[foundIndex].quantity = addNumbers(
            results[foundIndex].quantity,
            formatToNumber(data.quantity),
          );
        } else {
          results.push({
            uoM: data.uoM,
            quantity: formatToNumber(data.quantity),
          });
        }
      }
    }
  }

  return results;
};

/**
 * Format sang dạng phẳng
 *
 * [
 *  { id: 1 },
 *  { id: 2 },
 * ]
 * => [1 , 2]
 */
export const transformStockIds = datas => {
  if (datas && datas.length > 0) {
    const results = [];

    for (let i = 0; i < datas.length; i += 1) {
      const data = datas[i];
      if (data && data.id) {
        results.push(data.id);
      }
    }

    return results;
  }
  return [];
};

/**
 * Format dữ liệu cho Đại diện giao hàng
 */
export const transformDeliveryPerson = datas => {
  const results = [];

  if (datas && datas.length > 0) {
    for (let i = 0, len = datas.length; i < len; i += 1) {
      const data = datas[i];

      if (data) {
        const nextData = {
          ...data,
          fullName: `${datas[i].lastName} ${datas[i].firstName}`,
        };
        results.push(nextData);
      }
    }
  }

  return results;
};

/**
 * Format dữ liệu trước khi Tạo/Cập nhật BBGNHH
 */
export const transformDeliveryReceipt = data => {
  if (data && data.deliveryReceiptTransports) {
    const createDate = new Date(data.createDate);
    const deliveryDate = new Date(data.deliveryDate);
    let deliveryReceiptTransports = transformTransports(
      deliveryDate,
      data.deliveryReceiptTransports,
    );

    // CR #9150
    // Set "Thông tin vận chuyển" to null if transporterCode is null
    if (
      !deliveryReceiptTransports.length ||
      !deliveryReceiptTransports[0].transporterCode
    ) {
      deliveryReceiptTransports = null;
    }

    return {
      ...data,
      createDate,
      deliveryDate,
      deliveryReceiptTransports,
    };
  }
  return data;
};

/**
 * Filter dữ liệu nếu tồn tại customerCode
 */
export const transformDeliveryStocks = datas => {
  if (
    datas.exportStockReceiptProductInfos &&
    datas.exportStockReceiptProductInfos.length > 0
  ) {
    const exportStockReceiptProductInfos = datas.exportStockReceiptProductInfos.filter(
      data => data && data.customerCode,
    );
    const deliveryReceiptBasketInfos = datas.deliveryReceiptBasketInfos.filter(
      data => data && data.customerCode,
    );
    return {
      exportStockReceiptProductInfos,
      deliveryReceiptBasketInfos,
    };
  }
  return {
    exportStockReceiptProductInfos: [],
    deliveryReceiptBasketInfos: [],
  };
};

/**
 * Format sang dạng phẳng
 *
 * [
 *  { stockExportReceiptCode: '5000001' },
 *  { stockExportReceiptCode: '5000002' },
 * ]
 * => 5000001,5000002
 */
export const transformExportReceiptCodes = datas => {
  if (datas && datas.length > 0) {
    const parts = [];

    for (let i = 0; i < datas.length; i += 1) {
      const data = datas[i];
      if (data && data.stockExportReceiptCode) {
        parts.push(data.stockExportReceiptCode);
      }
    }

    return parts.join(',');
  }
  return '';
};
