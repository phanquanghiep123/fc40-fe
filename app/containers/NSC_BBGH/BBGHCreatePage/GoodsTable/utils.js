import { formatToDecimal, sumBy, formatToCurrency } from 'utils/numberUtils';

export const getColumnDef = (params, field) => {
  let columnDef = params.api.getColumnDef(field);

  if (!columnDef) {
    columnDef = params.api.getColumnDef(`${field}_1`);
  }

  return columnDef;
};

export const getBasketOrder = text => text.replace(/\D/g, '') * 1;

export const getTotalStocks = datas => {
  if (datas && datas.length > 0) {
    return {
      plannedTotalQuatity: formatToCurrency(
        sumBy(datas, 'plannedTotalQuatity'),
      ),
      totalReceivingWeight: formatToCurrency(
        sumBy(datas, 'totalReceivingWeight'),
      ),
    };
  }
  return null;
};

export const numericParser = params => Number(params.newValue);

export const decimalParser = params => formatToDecimal(params.newValue);

export const numericFormatter = params => {
  if (params) {
    if (
      params.value !== '' &&
      params.value !== null &&
      params.value !== undefined &&
      !Number.isNaN(params.value * 1)
    ) {
      return formatToDecimal(params.value);
    }
  }
  return '';
};

export const percentFormatter = params => {
  if (params) {
    if (
      params.value !== '' &&
      params.value !== null &&
      params.value !== undefined &&
      !Number.isNaN(params.value * 1)
    ) {
      return Number((params.value * 1) / 100).toLocaleString(undefined, {
        style: 'percent',
        maximumSignificantDigits: 4,
      });
    }
  }
  return '';
};

export const orderNumberRenderer = ({ rowIndex }) => rowIndex + 1;
