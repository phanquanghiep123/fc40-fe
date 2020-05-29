import { constSchema } from './schema';

const fistColumns = [
  {
    headerName: 'Ngày tồn',
    field: constSchema.date,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    tooltipField: 'date',
    width: 115,
    pinned: 'left',
  },
  {
    headerName: 'Đơn vị quản lý',
    field: constSchema.plantName,
    headerClass: 'ag-border-left-right',
    cellClass: 'ag-border-left-right',
    width: 140,
    tooltipField: 'plantName',
    pinned: 'left',
  },
  {
    headerName: 'Mã khay sọt',
    field: constSchema.basketCode,
    headerClass: 'ag-header-cell-label',
    cellClass: 'ag-border-left',
    tooltipField: 'basketCode',
    width: 110,
    pinned: 'left',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    headerName: 'Tên khay sọt',
    field: constSchema.basketName,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    tooltipField: 'basketName',
    width: 152,
  },
  {
    headerName: 'Đơn vị tính',
    field: constSchema.uom,
    headerClass: 'ag-border-left',
    cellClass: 'ag-border-left',
    tooltipField: 'uom',
    width: 120,
  },
];

const locatorColumns = locators =>
  (!!locators &&
    locators.length > 0 &&
    locators.map(item => ({
      headerName: item.name,
      tooltipField: item.basketLocatorCode,
      field: `${item.basketLocatorCode}`,
      headerClass: 'ag-border-left',
      cellClass: 'ag-border-left',
      pinnedRowCellRenderer: 'customPinnedRowRenderer',
      pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
      cellStyle: {
        textAlign: 'right',
      },
      width: 132,
    }))) ||
  [];

export const makeTableColumns = (columns = []) => [
  ...fistColumns,
  ...locatorColumns(columns),
];
