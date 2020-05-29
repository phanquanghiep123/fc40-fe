import React from 'react';
import { formatToCurrency } from '../../../../utils/numberUtils';
import { convertDateString } from '../../../App/utils';
import { constSchema } from './schema';

export const makeTableColumns = (joinCol = []) => {
  const defaultCol = [
    {
      title: 'Vùng',
      field: constSchema.regionName,
      headerStyle: {
        minWidth: '150px',
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
        minWidth: '150px',
      },
    },

    {
      title: 'Mã Farm',
      field: constSchema.plantCode,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      title: 'Mã LSX',
      field: constSchema.productionOrderCode,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      title: 'Mã kế hoạch',
      field: constSchema.planningCode,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      title: 'Tên kế hoạch',
      field: constSchema.planningName,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      title: 'Mã sản phẩm',
      field: constSchema.productCode,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      title: 'Tên sản phẩm',
      field: constSchema.productName,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      title: 'Thời gian bắt đầu LSX',
      field: constSchema.plannedFrom,
      render: RowData => convertDateString(RowData[constSchema.plannedFrom]),
      headerStyle: {
        minWidth: '170px',
      },
    },
    {
      title: 'Thời gian kết thúc LSX',
      field: constSchema.plannedTo,
      render: RowData => convertDateString(RowData[constSchema.plannedTo]),
      headerStyle: {
        minWidth: '170px',
      },
    },
    {
      title: 'Thời gian cập nhật',
      field: constSchema.lastUpdateDateTime,
      render: RowData =>
        convertDateString(RowData[constSchema.lastUpdateDateTime]),
      headerStyle: {
        minWidth: '170px',
      },
    },
    {
      title: 'Sản lượng yêu cầu',
      field: constSchema.orderQuantity,
      headerStyle: {
        minWidth: '170px',
      },
      render: RowData => {
        const orderQuantity = RowData[constSchema.orderQuantity];
        return (
          orderQuantity &&
          ((RowData.is_after === true && (
            <strong>{formatToCurrency(orderQuantity)}</strong>
          )) || <span>{formatToCurrency(orderQuantity)}</span>)
        );
      },
    },
    {
      title: 'Đơn vị tính',
      field: constSchema.baseUnit,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      title: 'Tổng SL TP dự kiến',
      field: constSchema.plannedQuantity,
      headerStyle: {
        minWidth: '170px',
      },
      render: RowData => {
        const plannedQuantity = RowData[constSchema.plannedQuantity];
        return (
          (plannedQuantity &&
            (RowData.is_after === true && (
              <strong>{formatToCurrency(plannedQuantity)}</strong>
            ))) || <span>{formatToCurrency(plannedQuantity)}</span>
        );
      },
    },
  ];
  return defaultCol.concat(joinCol);
};
