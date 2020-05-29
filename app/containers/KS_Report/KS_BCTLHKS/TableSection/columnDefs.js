import React from 'react';
import { formatToCurrency } from '../../../../utils/numberUtils';
const formattedValue = value =>
  Number.isNaN(parseFloat(value)) ? '' : formatToCurrency(value);

export const makeColumnDefsSmall = () => [
  {
    title: 'Đơn vị xuất hủy',
    field: 'plantName',
  },
  {
    title: 'Mã khay sọt',
    field: 'palletBasketCode',
  },
  {
    title: 'Tên khay sọt',
    field: 'palletBasketName',
  },
  {
    title: 'Đơn vị tính',
    field: 'uoM',
    render: params => {
      if (params.total) {
        return <div style={{ fontWeight: 'bold' }}>Tổng</div>;
      }
      return params.uoM;
    },
  },
  {
    title: 'Số lượng hủy',
    field: 'quantity',
    headerStyle: {
      textAlign: 'right',
    },
    cellStyle: {
      textAlign: 'right',
    },
    render: params => {
      if (params.total) {
        return (
          <div style={{ fontWeight: 'bold' }}>
            {formattedValue(params.quantity)}
          </div>
        );
      }
      return formattedValue(params.quantity);
    },
  },
  {
    title: 'Giá trị hủy',
    field: 'price',
    headerStyle: {
      textAlign: 'right',
    },
    cellStyle: {
      textAlign: 'right',
    },
    render: params => {
      if (params.total) {
        return (
          <div style={{ fontWeight: 'bold' }}>
            {formattedValue(params.price)}
          </div>
        );
      }
      return formattedValue(params.price);
    },
    // render: rowData => formattedValue(rowData.price),
  },
];

export const makeColumnDefs = () => [
  {
    headerName: 'Mã PXH',
    field: 'basketDocumentCode',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 100,
    pinned: 'left',
    tooltipField: 'basketDocumentCode',
  },
  {
    headerName: 'Đơn vị xuất hủy',
    field: 'plantName',
    width: 130,
    pinned: 'left',
    tooltipField: 'plantName',
  },
  {
    headerName: 'Mã PYCH',
    width: 120,
    field: 'receiptCode',
    pinned: 'left',
    tooltipField: 'receiptCode',
  },
  {
    headerName: 'Mã tài sản',
    field: 'assetCode',
    width: 100,
    pinned: 'left',
    tooltipField: 'assetCode',
  },
  {
    headerName: 'Mã khay sọt',
    field: 'palletBasketCode',
    width: 100,
    pinned: 'left',
    tooltipField: 'palletBasketCode',
  },
  {
    headerName: 'Tên khay sọt',
    field: 'palletBasketName',
    width: 150,
    tooltipField: 'palletBasketName',
  },
  {
    headerName: 'Đơn vị tính',
    field: 'uoM',
    width: 50,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Số lượng hủy',
    field: 'quantity',
    width: 100,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    cellStyle: {
      textAlign: 'right',
    },
    cellClass: 'ag-border-left',
  },
  {
    headerName: 'Giá trị hủy',
    cellClass: 'ag-border-left',
    field: 'price',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    resizable: true,
    cellStyle: {
      textAlign: 'right',
    },
    tooltipField: 'price',
  },
  {
    headerName: 'Nguyên nhân hủy',
    cellClass: 'ag-border-left',
    field: 'reasonName',
    width: 100,
    tooltipField: 'reasonName',
  },
  {
    headerName: 'Thời gian xuất hủy',
    field: 'exportDate',
    width: 110,
    tooltipField: 'exportDate',
  },
  {
    headerName: 'Thời gian tạo PYCH',
    field: 'receiptDate',
    width: 110,
    tooltipField: 'receiptDate',
  },
  {
    headerName: 'Thời gian phê duyệt',
    field: 'approvalDate',
    width: 110,
    tooltipField: 'approvalDate',
  },
  {
    headerName: 'Người tạo PYCH',
    field: 'requesterName',
    resizable: true,
    width: 150,
    tooltipField: 'requesterName',
  },
  {
    headerName: 'Người phê duyệt cấp 1',
    field: 'approver1Name',
    resizable: true,
    width: 120,
    tooltipField: 'approver1Name',
  },
  {
    headerName: 'Người phê duyệt cấp 2',
    field: 'approver2Name',
    resizable: true,
    width: 120,
    tooltipField: 'approver2Name',
  },
  {
    headerName: 'Người phê duyệt cấp 3',
    field: 'approver3Name',
    resizable: true,
    width: 120,
    tooltipField: 'approver3Name',
  },
  {
    headerName: 'Người xuất hủy',
    field: 'exporterName',
    resizable: true,
    width: 120,
    tooltipField: 'exporterName',
  },
];
