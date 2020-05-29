export const ASSETS_TABLE = 'assetsTable'; // bảng tài sản
export const ASSETS_TABLE_PINNED = 'assetsTable_pinned'; // dòng tính Tổng
export const BASKETS_TABLE = 'basketsTable'; // bảng khay sọt
export const BASKETS_TABLE_PINNED = 'basketsTable_pinned'; // dòng tính tổng

/**
 * Fields names in general section - inherit from previous views
 * (phần thông tin chung khi chọn phiếu xuất huỷ)
 */
export const generalSectionFields = {
  id: 'id', // id phiếu xuất hủy
  basketDocumentCode: 'basketDocumentCode', // mã phiếu xuất khay sọt
  subType: 'subType', // mã loại xuất kho - object
  deliver: 'deliver', // đơn vị huỷ - object
  cancelRequest: 'cancelRequest', // phiếu yêu cầu huỷ - object
  reason: 'reason', // lý do - object
  total: 'total', // tổng ước tính giá trị lần này - string
  note: 'note', // ghi chú - string
  date: 'date', // ngày xuất kho - Date Object
  supervisor: 'supervisor', // nhân viên giám sát - object
  user: 'user', // nhân viên xuất kho - object
  phone: 'phone', // điện thoại nhân viên xuất kho - string
  email: 'email', // email nhân viên xuất kho - string
  isAutoReceipt: 'isAutoReceipt', // check phiếu tự động - bool
  needConfirmation: 'needConfirmation', // cần message confirm - bool
  printTimes: 'printTimes', // số lần in
  status: 'status', // trạng thái phiếu
  statusName: 'statusName', // trạng thái phiếu
};

/**
 * Field names in assets table
 * (bảng thông tin tài sản sở hữu thanh lý/huỷ)
 */
export const assetsTableFields = {
  stt: 'stt',
  id: 'id',
  seqFC: 'seqFC',
  assetCode: 'assetCode', // mã tài sản
  ownerCode: 'ownerCode',
  ownerName: 'ownerName', // đơn vị sở hữu
  palletBasketCode: 'palletBasketCode',
  palletBasketName: 'palletBasketName', // tên khay sọt
  tempCancelValue: 'tempCancelValue', // giá trị huỷ tạm tính
  cancelValue: 'cancelValue', // giá trị huỷ
  cancelQuantity: 'cancelQuantity', // SL huỷ
  uom: 'uom', // đơn vị tính
  causeCode: 'causeCode', // mã nguyên nhân huỷ
  causeName: 'causeName', // nguyên nhân huỷ
  priorStatus: 'priorStatus', // trạng thái trước khi huỷ
  note: 'note',
};

/**
 * Field names in baskets in-use table
 * (bảng thông tin khay sọt sử dụng thanh lý/huỷ)
 */
export const basketsTableFields = {
  stt: 'stt',
  id: 'id',
  locatorCode: 'locatorCode', // mã kho nguồn
  locatorName: 'locatorName', // kho nguồn
  palletBasketCode: 'palletBasketCode', // mã khay sọt
  palletBasketName: 'palletBasketName', // tên khay sọt
  maxCancelQuantity: 'maxCancelQuantity', // SL huỷ tối đa (chỉ có ở phiếu tự động)
  cancelQuantity: 'cancelQuantity', // SL huỷ
  difference: 'difference', // chênh lệch (chỉ có ở phiếu tự động)
  uom: 'uom', // đơn vị tính
  images: 'images',
  note: 'note',
  causeCode: 'causeCode', // mã nguyên nhân huỷ
  causeName: 'causeName', // nguyên nhân huỷ
  priorStatus: 'priorStatus', // trạng thái trước khi huỷ
};

export const basketDocumentStatus = {
  All: 0,
  NotDone: 1,
  ByWay: 2,
  WaitForConfirm: 3,
  Completed: 4, // hoàn thành
};
