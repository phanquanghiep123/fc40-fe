import { constSchema } from './schema';

export const makeTableColumns = () => [
  {
    headerName: 'Ngày xử lý',
    field: constSchema.date,
    lockPosition: true,
    width: 180,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    pinned: 'left',
    tooltipField: 'date',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    headerName: 'Đơn vị quản lý',
    field: constSchema.plantName,
    resizable: true,
    lockPosition: true,
    width: 160,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    pinned: 'left',
    tooltipField: 'plantName',
  },
  {
    headerName: 'Mã khay sọt',
    field: constSchema.basketCode,
    lockPosition: true,
    resizable: true,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 140,
    tooltipField: 'basketCode',
  },
  {
    headerName: 'Tên khay sọt',
    field: constSchema.basketName,
    lockPosition: true,
    resizable: true,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 200,
    tooltipField: 'basketName',
  },
  {
    headerName: 'Đơn vị tính',
    field: constSchema.uom,
    lockPosition: true,
    resizable: true,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    width: 120,
    tooltipField: 'uom',
  },
  {
    headerName: 'Nhập',
    field: constSchema.importQuantity,
    cellStyle: {
      textAlign: 'right',
    },
    tooltipField: 'importQuantity',
    resizable: true,
    lockPosition: true,
    cellClass: 'ag-border-left',
    headerClass: 'ag-border-left',
    width: 120,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    headerName: 'Xuất',
    field: constSchema.exportQuantity,
    cellStyle: {
      textAlign: 'right',
    },
    resizable: true,
    lockPosition: true,
    tooltipField: 'exportQuantity',

    width: 120,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    headerName: 'Hủy',
    field: constSchema.waitInventory,
    cellStyle: {
      textAlign: 'right',
    },
    tooltipField: 'waitInventory',

    resizable: true,
    lockPosition: true,
    width: 120,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    headerName: 'Đi đường',
    field: constSchema.roadInventory,
    cellStyle: {
      textAlign: 'right',
    },
    tooltipField: 'roadInventory',

    resizable: true,
    width: 120,
    lockPosition: true,
    cellClass: 'ag-border-left-right',
    headerClass: 'ag-border-left-right',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
];
