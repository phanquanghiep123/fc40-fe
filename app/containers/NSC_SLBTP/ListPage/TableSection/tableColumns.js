import React from 'react';
import { constSchema } from './schema';
export const makeTableColumns = (joinCol = []) => {
  const minWidth = 120;
  const defaultCol = [
    {
      title: 'Vùng sản xuất',
      field: constSchema.regionName,
      headerStyle: {
        minWidth,
      },
      sorting: false,
      render: RowData =>
        RowData.is_after === true ? (
          <strong>{RowData[constSchema.regionName]}</strong>
        ) : (
          <span>{RowData[constSchema.regionName]}</span>
        ),
    },
    {
      title: 'Tên Farm',
      field: constSchema.plantName,
      sorting: false,
      headerStyle: {
        minWidth,
      },
    },

    {
      title: 'Mã Farm',
      field: constSchema.plantCode,
      headerStyle: {
        minWidth,
      },
    },
    {
      title: 'Mã LSX',
      field: constSchema.productionOrderCode,
      headerStyle: {
        minWidth,
      },
    },
    {
      title: 'Mã kế hoạch',
      sorting: false,
      field: constSchema.planningCode,
      headerStyle: {
        minWidth,
      },
    },
    {
      title: 'Tên kế hoạch',
      sorting: false,
      field: constSchema.planningName,
      headerStyle: {
        minWidth: 150,
      },
    },
    {
      title: 'Mã sản phẩm',
      field: constSchema.productCode,
      headerStyle: {
        minWidth,
      },
    },
    {
      title: 'Tên sản phẩm',
      sorting: false,
      field: constSchema.productName,
      headerStyle: {
        minWidth,
      },
    },
    {
      title: 'Đơn vị tính',
      sorting: false,
      field: constSchema.baseUnit,
      headerStyle: {
        minWidth,
      },
      render: row =>
        (row.is_after === true && (
          <strong>{row[constSchema.baseUnit]}</strong>
        )) ||
        row[constSchema.baseUnit],
    },
  ];
  return [...defaultCol, ...joinCol];
};
