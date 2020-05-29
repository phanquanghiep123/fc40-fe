import React from 'react';
import { convertDateString, convertDateTimeString } from '../../../App/utils';
import CheckboxCell from './CheckboxCell';

export const makeTableColumns = (currentSelectedIds, selectionChange) => [
  {
    title: '',
    field: 'Checkbox',
    render: rowData => (
      <CheckboxCell
        rowData={rowData}
        currentSelectedIds={currentSelectedIds}
        onSelectionChange={selectionChange}
      />
    ),
  },
  {
    title: 'Vùng Cung Cấp',
    field: 'supplyRegion',
  },
  {
    title: 'Ngày Sơ Chế',
    field: 'processDate',
    render: rowData => {
      if (!rowData.processDate) {
        return '';
      }

      return convertDateString(rowData.processDate);
    },
  },
  {
    title: 'NSC',
    field: 'processorCode',
  },
  {
    title: 'Farm/NCC',
    field: 'farmSupplierCode',
  },
  {
    title: 'Tên Farm/NCC',
    field: 'farmSupplierName',
  },
  {
    title: 'Mã Đặt Hàng',
    field: 'planningCode',
  },
  {
    title: 'Tên SP',
    field: 'productName',
  },
  {
    title: 'Vùng Tiêu Thụ',
    field: 'consumptionRegion',
  },
  {
    title: 'Tên Khách Hàng',
    field: 'customerName',
  },
  {
    title: 'Loại Cửa Hàng',
    field: 'customerType',
  },
  {
    title: 'SL Thực Đặt',
    field: 'realOrderQuantity',
  },
  {
    title: 'SL Chia Dự Kiến',
    field: 'planningDivideQuantity',
  },
  {
    title: 'Cảnh Báo',
    field: 'warning',
  },
  {
    title: 'Phiên Bản',
    field: 'version',
  },
  {
    title: 'Ngày Giờ Cập Nhật',
    field: 'updatedAt',
    render: rowData => {
      if (!rowData.updatedAt) {
        return '';
      }

      return convertDateTimeString(rowData.updatedAt);
    },
  },
];
