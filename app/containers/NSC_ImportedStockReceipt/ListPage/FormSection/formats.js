/* eslint-disable no-unused-vars */

const formRequestParams = {
  receiverOrgCode: 'int', // Mã đơn vị nhận hàng
  impStockRecptCode: 'str', // Mã phiếu nhập kho
  importType: 'str', // Loại nhập kho
  doCode: 'str', // Mã BBGH
  deliverOrgCode: 'str', // Mã đơn vị giao hàng
  importedDateFrom: 'str', // Ngày nhập kho FROM
  importedDateTo: 'str', // Ngày nhập kho TO
  status: 'str', // Trạng thái
  orgCodes: 'str', // Danh sách Mã đơn vị nhận hàng Ex: “2002, 2004, 2005, 2007”
  weighingStaff: 'str', // Nhân viên cân hàng
  filterProduct: 'str', // Mã sản phẩm và Batch
  pageSize: 'str',
  pageIndex: 'str',
  ids: 'str', // Dành cho phần in
};

const importTypeResponse = {
  //
};

export const formDataSchema = {
  receiverOrgCode: [],
  importType: [],
  deliverOrgCode: [],
  weighingStaffs: [],
  status: [
    {
      value: 0,
      label: 'Tất cả',
    },
    {
      value: 1,
      label: 'Đang cân',
    },
    {
      value: 2,
      label: 'Hoàn thành',
    },
  ], // fixed data
};
