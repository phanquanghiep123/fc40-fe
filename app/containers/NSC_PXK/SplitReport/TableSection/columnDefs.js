import { convertDateString } from '../../../App/utils';

export const makeColumnDefs = () => [
  {
    title: '',
    width: 60,
    render: rowData => renderNumberOrder(rowData),
  },
  {
    title: 'Ngày Sơ Chế',
    field: 'processDate',
    render: rowData => convertDateString(rowData.processDate),
  },
  {
    title: 'Mã NSC',
    field: 'processorCode',
  },
  {
    title: 'Tên NSC',
    field: 'processorName',
  },
  {
    title: 'Mã Farm/NCC',
    field: 'farmSupplierCode',
  },
  {
    title: 'Tên Farm/NCC',
    field: 'farmSupplierName',
  },
  {
    title: 'Mã Kế Hoạch',
    field: 'planningCode',
  },
  {
    title: 'Tên Sản Phẩm',
    field: 'productName',
  },
  {
    title: 'Mã Khách Hàng',
    field: 'customerCode',
  },
  {
    title: 'Tên Khách Hàng',
    field: 'customerName',
  },
  {
    title: 'Đơn Vị Tính',
    field: 'saleUnit',
  },
  {
    title: 'SL Chia Dự Kiến',
    field: 'planedPickingQuantity',
    cellStyle: {
      width: 90,
      minWidth: 90,
    },
  },
  {
    title: 'SL Cân',
    field: 'realQuantity',
    cellStyle: {
      width: 76,
      minWidth: 76,
    },
  },
  {
    title: 'Chênh Lệch',
    field: 'differentQuantity',
    cellStyle: {
      width: 80,
      minWidth: 80,
    },
  },
  {
    title: 'Tỉ Lệ',
    field: 'differentRatioString',
    cellStyle: {
      width: 72,
      minWidth: 72,
    },
  },
];

function renderNumberOrder(rowData) {
  if (rowData && rowData.tableData) {
    return rowData.tableData.id + 1;
  }
  return '';
}
