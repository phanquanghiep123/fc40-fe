import React from 'react';
import { convertDateString } from '../../../App/utils';
import { NUMBER_LOCALE_FORMAT } from '../constants';

function formatCurrencyTableCell(value) {
  if (Number.isNaN(value)) return 0;
  if (typeof value !== 'number') return 0;
  return value.toLocaleString(NUMBER_LOCALE_FORMAT) || '';
}
export const makeTableColumns = formData => [
  {
    title: 'Đơn vị',
    field: 'plantCode',
    render: rowData => {
      if (!formData.org) {
        return '';
      }

      const matches = formData.org.filter(
        item => item.value === rowData.plantCode,
      );

      if (matches.length > 0 && matches[0].label) {
        return matches[0].label;
      }

      return '';
    },
  },
  {
    title: 'Vùng sản xuất',
    field: 'regionCode',
    render: rowData => {
      if (!formData.RegionConsumeCode) {
        return '';
      }

      const matches = formData.RegionConsumeCode.filter(
        item => item.value === rowData.regionCode,
      );

      if (matches.length > 0 && matches[0].label) {
        return matches[0].label;
      }

      return '';
    },
  },
  {
    title: 'Mã sản phẩm',
    field: 'productCode',
  },
  {
    title: 'Tên sản phẩm',
    field: 'productName',
  },
  {
    title: 'Batch',
    field: 'batch',
  },
  {
    title: 'Giá phê duyệt',
    field: 'unitPrice',
    render: rowData => (
      <span> {formatCurrencyTableCell(rowData.unitPrice)} </span>
    ),
  },
  {
    title: 'Số lượng (từ)',
    field: 'weightFrom',
  },
  {
    title: 'Số lượng (đến)',
    field: 'weightTo',
  },
  {
    title: 'Đơn vị tính',
    field: 'uom',
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
    title: 'Ghi chú',
    field: 'note',
  },
];
