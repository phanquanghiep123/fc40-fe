export const makeColumnDefs = () => [
  {
    title: 'STT',
    width: 60,
    render: rowData => renderNumberOrder(rowData),
  },
  {
    title: 'Cửa Hàng',
    field: 'shipToCode',
  },
  {
    title: 'Địa Chỉ',
    field: 'routeAddress',
  },
  {
    title: 'Tuyến',
    field: 'routeCode',
  },
  {
    title: 'Số Lượng Giao',
    field: 'quantity',
  },
];

function renderNumberOrder(rowData) {
  if (rowData && rowData.tableData) {
    return rowData.tableData.id + 1;
  }
  return '';
}
