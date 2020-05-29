export const mappingData = (schema, importStockId, data) => {
  const returnObj = Object.assign({}, schema);
  returnObj.id = importStockId || '';
  returnObj.subType = data.subType || '';
  returnObj.subTypeName = data.subTypeName || '';
  // subType: , // Loại nhập kho
  returnObj.date = data.date || ''; // Ngày lập phiếu
  returnObj.deliveryOrderCode = data.deliveryOrderCode || ''; // Mã biên bản giao hàng
  returnObj.deliverCode = data.deliverCode || ''; // Mã bên giao hàng
  returnObj.deliverName = data.deliverCodeName || ''; // Hiển thị mã bên giao hàng
  returnObj.user = data.importerName || ''; // Nhân viên cân hàng
  returnObj.userID = data.userID || ''; // Nhân viên cân hàng
  returnObj.phone = data.importerPhone || ''; // ăn theo nhân viên
  returnObj.email = data.importerEmail || ''; // ăn theo nhân viên
  returnObj.supervisorID = data.supervisorID || ''; // Nhân viên giám sát
  returnObj.supervisor = data.supervisorName || '';
  returnObj.vehicleNumbering = data.vehicleNumbering || ''; // vehicleNumbering: 1, // Chuyến xe
  returnObj.vehicleNumberingLabel = data.vehicleNumbering
    ? `Chuyến ${data.vehicleNumbering}`
    : ''; // vehicleNumbering: 1, // Chuyến xe
  returnObj.note = data.note || ''; // Ghi chú
  returnObj.receiverCode = data.receiverCode || ''; // Mã bên nhận hàng
  returnObj.receiverName = data.receiverCodeName || '';

  return returnObj;
};
