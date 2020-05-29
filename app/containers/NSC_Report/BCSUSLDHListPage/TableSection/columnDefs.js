import React from 'react';
import { convertDateString } from '../../../App/utils';
const padding = '5px 0 5px 10px';

const alignRight = {
  textAlign: 'right',
  paddingRight: 5,
};

const highlight = (record, isNA) => {
  const style = { fontWeight: 'bold' };
  if (record >= 0) {
    style.color = '#1B801D';
  } else {
    style.color = '#DD0C0C';
  }

  if (isNA) {
    style.color = '#DD0C0C';
  }

  return style;
};
export const makeColumnDefs = () => [
  {
    title: 'Ngày Giao Hàng',
    field: 'receivedDate',
    render: rowData => convertDateString(rowData.receivedDate),
  },
  {
    title: 'Mã NSC',
    field: 'receiverCode',
  },
  {
    title: 'Tên NSC',
    field: 'receiverName',
  },
  {
    title: 'Mã NCC',
    field: 'deliverCode',
  },
  {
    title: 'Tên NCC',
    field: 'deliverName',
  },
  {
    title: 'Mã Sản Phẩm',
    field: 'productCode',
  },
  {
    title: 'Tên Sản Phẩm',
    field: 'productName',
  },
  {
    title: 'SL Đặt',
    field: 'plannedTotalQuantity',
    headerStyle: alignRight,
    cellStyle: alignRight,
  },
  {
    title: 'SL Nhận',
    field: 'actualTotalQuantity',
    headerStyle: alignRight,
    cellStyle: alignRight,
  },
  {
    title: 'Chênh Lệch',
    field: 'differenceQuantity',
    headerStyle: alignRight,
    cellStyle: {
      backgroundColor: '#FAF8F8',
      padding,
      ...alignRight,
    },
    render: rowData => (
      <span style={highlight(rowData.differenceQuantity)}>
        {rowData.differenceQuantity}
      </span>
    ),
  },
  {
    title: '% Thiếu Hàng',
    field: 'farmRateString',
    headerStyle: alignRight,
    cellStyle: {
      backgroundColor: '#FAF8F8',
      padding,
      ...alignRight,
    },
    render: rowData => (
      <span style={highlight(rowData.farmRate, rowData.isHighLightRate)}>
        {rowData.farmRateString}
      </span>
    ),
  },
];
