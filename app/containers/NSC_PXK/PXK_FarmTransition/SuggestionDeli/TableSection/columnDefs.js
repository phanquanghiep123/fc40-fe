import React from 'react';

export const makeColumnDefs = () => [
  {
    title: 'Mã Kế Hoạch',
    field: 'planningCode',
  },
  {
    title: 'Mã Bán Hàng',
    field: 'productCode',
  },
  {
    title: 'Tên TP',
    field: 'productName',
  },
  {
    title: 'Mã Farm/NCC',
    field: 'plantCode',
  },
  {
    title: 'Tên Farm/NCC',
    field: 'plantName',
  },
  {
    title: 'Đơn Vị Tính',
    field: 'uom',
  },
  {
    title: 'SL Chia Thực Tế',
    field: 'actualPickingQuantity',
  },
  {
    title: 'SL Đã Xuất',
    field: 'exportedQuantity',
  },
  {
    title: 'SL Còn Lại',
    field: 'remainQuantity',
  },
  {
    title: 'SL Chia Chọn',
    field: 'pickingQuantity',
    render: rowData => {
      if (rowData) {
        return (
          <span style={rowData.isHighLight ? { color: '#f00000' } : {}}>
            {rowData.pickingQuantity}
          </span>
        );
      }
      return null;
    },
  },
];
