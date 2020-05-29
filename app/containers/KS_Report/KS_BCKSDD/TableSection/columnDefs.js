import { formatToCurrency } from 'utils/numberUtils';

export const numberCurrency = params =>
  params.value ? formatToCurrency(params.value) : params.value;

export const makeColumnDefs = () => [
  {
    headerName: 'BBGH',
    field: 'doCode',
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 130,
  },
  {
    headerName: 'Đơn vị giao',
    field: 'deliveryName',
    width: 130,
  },
  {
    headerName: 'Đơn vị nhận',
    width: 130,
    field: 'receiverName',
  },
  {
    headerName: 'Trạng thái',
    field: 'status',
    width: 100,
  },
  {
    headerName: 'Phân loại cảnh báo',
    field: 'basketDocumentStatusName',
    width: 180,
    cellStyle: value => {
      if (value.data.basketDocumentStatus === 1) {
        return { background: 'red', color: 'white' };
      }
      if (value.data.basketDocumentStatus === 2) {
        return { background: 'orange', color: 'white' };
      }
      if (value.data.basketDocumentStatus === 4) {
        return { background: '#009c52', color: 'white' };
      }
      return {};
    },
  },
  {
    headerName: 'Ngày xuất',
    field: 'date',
    width: 110,
  },
  {
    headerName: 'Ngày dự định nhận',
    field: 'plannedArrivalDate',
    width: 110,
  },
  {
    headerName: 'Ngày nhận thực tế',
    field: 'actualArrivalDate',
    width: 100,
  },
  {
    headerName: 'Thời gian tạo PNK',
    field: 'importBywayDate',
    width: 110,
  },
  {
    headerName: 'Mã khay sọt',
    field: 'palletBasketCode',
    width: 110,
  },
  {
    headerName: 'Tên khay sọt',
    field: 'palletBasketName',
    width: 160,
  },
  {
    headerName: 'Đơn vị tính',
    field: 'uoM',
    width: 100,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    headerName: 'Số lượng giao',
    field: 'deliveryQuantity',
    width: 125,
    headerClass: 'ag-numeric-header',
    cellClass: 'ag-border-left',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    valueFormatter: numberCurrency,
    cellStyle: {
      textAlign: 'right',
    },
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'Số lượng thực nhận',
    headerClass: 'ag-numeric-header',
    field: 'quantityActual',
    width: 130,
    cellClass: 'ag-border-left',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    cellStyle: {
      textAlign: 'right',
    },
    valueFormatter: numberCurrency,
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
  {
    headerName: 'Chênh lệch (Giao - Nhận)',
    headerClass: 'ag-numeric-header',
    field: 'difference',
    width: 130,
    cellClass: 'ag-border-left',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    valueFormatter: numberCurrency,
    cellStyle: {
      textAlign: 'right',
    },
    pinnedRowCellRendererParams: {
      valueFormatter: numberCurrency,
    },
  },
];
