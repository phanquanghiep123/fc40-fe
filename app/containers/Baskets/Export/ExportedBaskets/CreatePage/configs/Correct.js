import * as Yup from 'yup';
const columnDefs = [
  {
    field: 'stt',
    headerName: 'STT',
    width: 70,
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
  },
  {
    field: 'locatorDeliverName',
    headerName: 'Kho nguồn',
  },
  {
    field: 'basketCode',
    headerName: 'Mã Khay Sọt',
  },
  {
    field: 'basketName',
    headerName: 'Tên Khay Sọt',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'deliveryQuantity',
    headerName: 'SL Xuất',
    headerClass: 'ag-numeric-header',
    cellClass: 'ag-numeric-cell',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'uoM',
    headerName: 'Đơn vị tính',
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    tooltipField: 'note',
  },
];
const columnDefsView = [...columnDefs];
columnDefsView.pop();
export const correctBasketConfig = {
  value: 25,
  renderSection2: () => false,
  addRow: () => false,
  titleSection2: () => ``,
  titleSection3: () => `II. Thông Tin Khay Sọt`,
  section2ColumnDefs: [],
  columnDefs,
  columnDefsView,
  validSchema: Yup.object(),
};
