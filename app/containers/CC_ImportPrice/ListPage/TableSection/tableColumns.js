import React from 'react';
import { convertDateString } from '../../../App/utils';
import { NUMBER_LOCALE_FORMAT } from '../constants';

function formatCurrencyTableCell(value) {
  return formatCurrency(value) || '';
}

function formatCurrency(value) {
  if (Number.isNaN(value)) return 0;
  if (typeof value !== 'number') return 0;

  return value.toLocaleString(NUMBER_LOCALE_FORMAT);
}

function getLable($arrays, $value) {
  let label = '';
  $arrays.forEach(item => {
    if (item.value === $value) {
      ({ label } = item);
    }
  });
  return label;
}
export const makeTableColumns = formData => [
  {
    title: 'Đơn vị',
    field: 'plantCode',
    render: rowData => (
      <span style={{ width: 40, height: 40 }}>
        {getLable(formData.org, rowData.plantCode)}
      </span>
    ),
  },
  {
    title: 'Ngày hiệu lực (từ)',
    field: 'dateFrom',
    render: rowData => convertDateString(rowData.dateFrom),
  },
  {
    title: 'Ngày hiệu lực (đến)',
    field: 'dateTo',
    render: rowData => convertDateString(rowData.dateTo),
  },
  {
    title: 'Vùng sản xuất',
    field: 'regionProductionCode',
    render: rowData => (
      <span style={{ width: 40, height: 40 }}>
        {getLable(formData.RegionProductionCode, rowData.regionProductionCode)}
      </span>
    ),
  },
  {
    title: 'Vùng tiêu thụ',
    field: 'regionConsumeCode',
    render: rowData => (
      <span style={{ width: 40, height: 40 }}>
        {getLable(formData.RegionConsumeCode, rowData.regionConsumeCode)}
      </span>
    ),
  },

  {
    title: 'Mã Vineco',
    field: 'planningProductCode',
  },

  {
    title: 'Tên Vineco',
    field: 'productName',
  },
  {
    title: 'Nguồn cung cấp',
    field: 'source',
  },
  {
    title: 'Đơn vị',
    field: 'uom',
  },
  {
    title: 'KD bán tại ICD',
    field: 'priceBusinessSaleIcd',
    render: rowData => (
      <span>{formatCurrencyTableCell(rowData.priceBusinessSaleIcd)}</span>
    ),
  },
  {
    title: 'KD bán tại cơ sở',
    field: 'priceBusinessSelfSale',
    render: rowData => (
      <span>{formatCurrencyTableCell(rowData.priceBusinessSelfSale)}</span>
    ),
  },
  {
    title: 'Cơ sở tự bán',
    field: 'priceSelfSale',
    render: rowData => (
      <span>{formatCurrencyTableCell(rowData.priceSelfSale)}</span>
    ),
  },
];
