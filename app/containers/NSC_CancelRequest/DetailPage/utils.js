/* eslint-disable indent */
import {
  basketsInfoFields,
  assetsTableFields,
  basketsInUseFields,
} from './tableFields';
import { formatToCurrency, formatToNumber } from '../../../utils/numberUtils';
import { isNumberString } from '../../App/utils';
import { loadingError } from '../../App/actions';
import {
  ASSET_TABLE,
  ASSET_TABLE_PINNED,
  BASKET_INFO_TABLE,
  BASKET_INUSE_TABLE,
  BASKET_INUSE_TABLE_PINNED,
} from './constants';

export const numericParser = params =>
  formatToNumber(params.newValue) || undefined;

/**
 * Notify if form is invalid
 * @param formik
 * @param dispatch
 */
export const notifyIfFormIsInvalid = (formik, dispatch) => {
  if (!formik || !formik.isValid) {
    dispatch(
      loadingError(
        'Dữ liệu nhập chưa đủ hoặc không chính xác. Vui lòng kiểm tra lại.',
      ),
    );
  }
};

/**
 * Search Select Options
 * @param {string} inputValue
 * @param {Array|null} options
 * @return {Array}
 */
export const searchSelectOptions = (inputValue, options) => {
  if (!options || !options.length) return [];

  const filter1 = options.filter(
    opt =>
      opt && (opt.value || opt.value === 0) && opt.value.includes(inputValue),
  );
  const filter2 = options.filter(
    opt =>
      opt && (opt.label || opt.label === 0) && opt.label.includes(inputValue),
  );

  const filteredObj = {};
  [...filter1, ...filter2].forEach(opt => {
    filteredObj[opt.value] = opt;
  });

  return Object.keys(filteredObj).map(key => filteredObj[key]);
};

/**
 * Calculate Baskets Info Table Data
 * @param assetsData - data from assets table
 * @param basketsInUseData - data from baskets in use table
 * @return {Array} - data for baskets info table
 */
export const calculateBasketsInfoTableData = (assetsData, basketsInUseData) => {
  if (!assetsData || !basketsInUseData) return [];
  const t1 = basketsInfoFields;
  const t2 = assetsTableFields;
  const t3 = basketsInUseFields;

  const basketInfo = {};
  assetsData.forEach(rowData => {
    if (!rowData) return;

    const id = rowData[t2.palletBasketCode];
    const cancelQuantityInStock = basketInfo[id]
      ? basketInfo[id][t1.cancelQuantityInStock] +
        parseFloat(
          isNumberString(rowData[t2.cancelQuantity])
            ? rowData[t2.cancelQuantity]
            : '0',
        )
      : parseFloat(
          isNumberString(rowData[t2.cancelQuantity])
            ? rowData[t2.cancelQuantity]
            : '0',
        );

    basketInfo[id] = {
      [t1.palletBasketCode]: rowData[t2.palletBasketCode],
      [t1.palletBasketName]: rowData[t2.palletBasketName],
      [t1.cancelQuantityInUse]: 0,
      [t1.cancelQuantityInStock]: cancelQuantityInStock,
      [t1.inUseInStockDiff]: 0 - cancelQuantityInStock,
      [t1.uom]: rowData.uom,
    };
  });

  basketsInUseData.forEach(rowData => {
    if (!rowData) return;
    const id = rowData[t3.palletBasketCode];
    if (!id) return;

    const cancelQuantityInUse = basketInfo[id]
      ? basketInfo[id][t1.cancelQuantityInUse] +
        parseFloat(rowData[t3.cancelQuantity] || '0')
      : parseFloat(rowData[t3.cancelQuantity] || '0');

    basketInfo[id] = {
      ...(basketInfo[id] || {
        [t1.palletBasketCode]: rowData[t3.palletBasketCode],
        [t1.palletBasketName]: rowData[t3.palletBasketName],
        [t1.cancelQuantityInStock]: 0,
        [t1.uom]: rowData.uom,
      }),
      [t1.cancelQuantityInUse]: cancelQuantityInUse,
      [t1.inUseInStockDiff]:
        cancelQuantityInUse -
        (basketInfo[id] ? basketInfo[id][t1.cancelQuantityInStock] : 0),
    };
  });

  return Object.keys(basketInfo).map(id => basketInfo[id]);
};

/**
 * Calculate total row for asset table
 * @param basketsInUseTableData
 * @return {{currentCancelValue: number, cancelValue: number, cancelQuantity: number, palletBasketName: string}}
 */
export const calculateTotalRowBasketsInUseTable = basketsInUseTableData => {
  const t = basketsInUseFields;
  const totalRow = {
    [t.maxCancelQuantity]: 0,
    [t.inStockQuantity]: 0,
    [t.cancelQuantity]: 0,
    [t.maxCancelQuantityDiff]: 0,
    [t.inStockQuantityDiff]: 0,
  };

  if (!basketsInUseTableData) {
    return { ...totalRow, [t.palletBasketName]: 'Tổng' };
  }

  basketsInUseTableData.forEach(item => {
    if (!item) return;
    Object.keys(totalRow).forEach(key => {
      totalRow[key] += parseFloat(item[key] || 0) || 0;
    });
  });

  return { ...totalRow, [t.palletBasketName]: 'Tổng' };
};

/**
 * Calculate total row for asset table
 * @param assetData
 * @return {{currentCancelValue: number, cancelValue: number, cancelQuantity: number, palletBasketName: string}}
 */
export const calculateTotalRowAssetTable = assetData => {
  const totalRow = {
    cancelValue: 0,
    cancelQuantity: 0,
    currentCancelValue: 0,
  };

  if (!assetData) {
    return { ...totalRow, palletBasketName: 'Tổng' };
  }

  assetData.forEach(item => {
    if (!item) return;
    Object.keys(totalRow).forEach(key => {
      totalRow[key] += parseFloat(item[key] || 0) || 0;
    });
  });

  return { ...totalRow, palletBasketName: 'Tổng' };
};

/**
 * Update baskets info table data - Cập nhật bảng thông tin khay sọt sử dụng - sở hữu
 * @param formik
 * @param {Array} customAssetsData - provide custom asset data if needed
 * @param {Array} customBasketsInUseData - provide custom baskets in use data
 */
export const onUpdateBasketsInfoTableData = (
  formik,
  customAssetsData = undefined,
  customBasketsInUseData = undefined,
) => {
  const assetsData = customAssetsData || formik.values[ASSET_TABLE];
  const basketsInUseData =
    customBasketsInUseData || formik.values[BASKET_INUSE_TABLE];
  const basketInfoTableData = calculateBasketsInfoTableData(
    assetsData,
    basketsInUseData,
  );

  formik.setFieldValue(BASKET_INFO_TABLE, basketInfoTableData);
};

/**
 * Update Asset Total Row + Update total cancel value in general section
 * Cập nhật thông tin tổng của bảng tài sản sở hữu
 * @param formik
 * @param assetTableData
 */
export const onUpdateAssetPinnedData = (formik, assetTableData = undefined) => {
  const assetData = assetTableData || formik.values[ASSET_TABLE];
  const totalRow = calculateTotalRowAssetTable(assetData);

  formik.setFieldValue(ASSET_TABLE_PINNED, [totalRow]);
  formik.setFieldValue(
    'totalCancelValue',
    formatToCurrency(totalRow.cancelValue.toString()),
  );
  formik.setFieldValue(
    'totalCurrentCancelValue',
    formatToCurrency(totalRow.currentCancelValue.toString()),
  );
};

/**
 * Update Asset Total Row + Update total cancel value in section 1
 * Cập nhật thông tin tổng của bảng khay sọt sử dụng
 * @param formik
 * @param customTableData
 */
export const onUpdateBasketsInUsePinnedData = (
  formik,
  customTableData = undefined,
) => {
  const tableData = customTableData || formik.values[BASKET_INUSE_TABLE];
  const totalRow = calculateTotalRowBasketsInUseTable(tableData);

  formik.setFieldValue(BASKET_INUSE_TABLE_PINNED, [totalRow]);
};
