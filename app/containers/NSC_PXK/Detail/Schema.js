import * as Yup from 'yup';

export default Yup.object().shape({
  // Mã PXK
  documentCode: Yup.string(),

  // Tên Loại xuất kho
  subTypeName: Yup.string(),

  // Tên Đơn vị giao hàng
  deliverName: Yup.string(),

  // Tên Đơn vị nhận hàng
  receiverName: Yup.string(),

  // Thời gian lập phiếu
  date: Yup.date(),

  // Nhân viên cân hàng
  exporterName: Yup.string(),

  // Điện thoại
  exporterPhone: Yup.string(),

  // Email
  exporterEmail: Yup.string(),

  // Nhân viên giám sát
  supervisorName: Yup.string(),

  // Ghi chú
  note: Yup.string(),

  // Danh sách sản phẩm xuất kho
  documentDetails: Yup.array().of(
    Yup.object().shape({
      // Mã sản phẩm
      productCode: Yup.string(),

      // Tên sản phẩm
      productName: Yup.string(),

      // Batch
      slotCode: Yup.string(),

      // Kho nguồn
      locatorNameFrom: Yup.string(),

      // Kho đích
      locatorNameTo: Yup.string(),

      // Số lượng xuất
      exportedQuantity: Yup.number(),

      // Đơn vị đp
      uom: Yup.string(),

      // Tên Trạng thái
      statusName: Yup.string(),
    }),
  ),
});
