export const tableDataResponseSchema = [
  {
    supplyRegion: 'string', // Vùng cung cấp/
    processDate: 'DateTime', // Ngày sơ chế
    processorCode: 'string', // NSC
    farmSupplierCode: 'string', // Farm// NCC
    farmSupplierName: 'string', // Tên Farm// NCC
    planningCode: 'string', // Mã đặt hàng
    productName: 'string', // Tên sản phẩm
    consumptionRegion: 'string', // Vùng tiêu thụ
    customerName: 'string', // Tên khách hàng
    customerType: 'string', // Loại cửa hàng
    realQuantity: 'double', // Số lượng thực đặt
    planningDivideQuantity: 'double', // Số lượng chia dự kiến
    version: 'int', // Version
    updatedAt: 'DateTime', // Thêm mới
  },
];

export const demoTableData = [
  {
    supplyRegion: 'string',
    processingDate: '2019-05-23T08:12:31.775Z',
    processorCode: 'string',
    farmSupplierCode: 'string',
    farmSupplierName: 'string',
    pCode: 'string',
    productName: 'string',
    consumptionRegion: 'string',
    customerName: 'string',
    cGroupCode: 'string',
    realQuantity: 'double',
    planningDivideQuantity: 'double',
    version: 'int',
  },
  {
    supplyRegion: 'string',
    processingDate: '2019-05-25T08:12:31.775Z',
    processorCode: 'string',
    farmSupplierCode: 'string',
    farmSupplierName: 'string',
    pCode: 'string',
    productName: 'string',
    consumptionRegion: 'string',
    customerName: 'string',
    cGroupCode: 'string',
    realQuantity: 'double',
    planningDivideQuantity: 'double',
    version: 'int',
  },
];
