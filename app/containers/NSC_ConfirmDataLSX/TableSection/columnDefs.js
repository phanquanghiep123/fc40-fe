import React from 'react';
import ConfirmCellRenderer from './ConfirmCellRenderer';
import SelectCellRenderer, { targetFields } from './SelectCellRenderer';

export const makeColumnDefs = (tableData, onUpdateTableData) => [
  {
    title: 'ID',
    field: 'id',
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
    title: 'Loại Sản Phẩm',
    field: 'productType',
  },
  {
    title: 'Batch',
    field: 'slotCode',
  },
  {
    title: 'Khối Lượng',
    field: 'quantity',
  },
  {
    title: 'Ngày Sơ Chế Bắt Đầu',
    field: 'startingProcessDate',
  },
  {
    title: 'Ngày Sơ Chế Kết Thúc',
    field: 'endingProcessDate',
  },
  {
    title: 'Product Version',
    field: targetFields.productVersion,
    render: rowData => (
      <SelectCellRenderer
        rowData={rowData}
        tableData={tableData}
        options={rowData.productVersionOptions}
        onUpdateTableData={onUpdateTableData}
        targetField={targetFields.productVersion}
      />
    ),
  },
  {
    title: 'Trạng Thái',
    field: 'statusName',
  },
  {
    title: 'Xác Nhận',
    field: 'status',
    render: rowData => (
      <ConfirmCellRenderer
        rowData={rowData}
        tableData={tableData}
        onUpdateTableData={onUpdateTableData}
      />
    ),
  },
];
