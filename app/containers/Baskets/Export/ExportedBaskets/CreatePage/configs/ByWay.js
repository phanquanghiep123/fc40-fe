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
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: { style: { fontWeight: 'bold' } },
  },
  {
    field: 'locatorReceiverName',
    headerName: 'Kho đích',
  },
  {
    field: 'uoM',
    headerName: 'Đơn vị tính',
  },
  {
    field: 'note',
    headerName: 'Ghi chú',
    tooltipField: 'note',
    cellEditorParams: {
      inputProps: { maxLength: 500 },
    },
  },
];
const columnDefsView = [...columnDefs];
columnDefsView.pop();
export const byWayBasketConfig = {
  value: 27,
  titleSection2: () => `...`,
  renderSection2: () => false,
  addRow: () => false,
  titleSection3: () => `II. Thông Tin Khay Sọt`,
  columnDefs,
  columnDefsView,
  section2ColumnDefs: [],
  validSchema: Yup.object(),
};
