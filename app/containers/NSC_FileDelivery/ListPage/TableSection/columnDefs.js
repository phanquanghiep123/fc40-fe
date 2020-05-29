import { convertDateString } from '../../../App/utils';

export const makeColumnDefs = () => [
  {
    title: 'Ngày Đặt Hàng',
    render: rowData => convertDateString(rowData.orderDate),
  },
  {
    title: 'Tên NSC',
    field: 'plantName',
  },
  {
    title: 'Mã NCC/Farm',
    field: 'vendorCode',
  },
  {
    title: 'Tên NCC/Farm',
    field: 'vendorName',
  },
  {
    title: 'Mã Kế Hoạch',
    field: 'planningMaterialCode',
  },
  {
    title: 'Mã Sản Phẩm',
    field: 'salingMaterialCode',
  },
  {
    title: 'Tên Sản Phẩm',
    field: 'salingMaterialName',
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
    title: 'SL Đặt Thực',
    field: 'orderQuantity',
  },
  {
    title: 'Đơn Vị Đặt',
    field: 'orderUoM',
  },
  {
    title: 'SL Chia Dự Kiến',
    field: 'pickingQuantity',
  },
  {
    title: 'Đơn Vị Chia',
    field: 'pickingUoM',
  },
  {
    title: 'SL Giao',
    field: 'deliveryQuantity',
  },
  {
    title: 'KL Giao',
    field: 'deliveryUoM',
  },
  {
    title: 'Mã Khay',
    field: 'zmarCode',
  },
  {
    title: 'Khay',
    field: 'zmarName',
  },
  {
    title: 'KL Khay',
    field: 'zmarQuantity',
  },
];
