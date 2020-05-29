import * as Yup from 'yup';
import { localstoreUtilites } from 'utils/persistenceData';
const auth = localstoreUtilites.getAuthFromLocalStorage();
export const validSchema = Yup.object().shape({
  deliveryOrderCode: Yup.string().required('Trường không được bỏ trống'),
  user: Yup.string().required('Trường không được bỏ trống'),
  receiverCode: Yup.string().required('Trường không được bỏ trống'),
  deliverName: Yup.string().required('Trường không được bỏ trống'),
});

export const initialSchema = {
  subType: 1, // Loại nhập kho
  subTypeName: '', // Loại nhập kho
  date: new Date(), // Ngày lập phiếu
  deliveryOrderCode: '', // Mã biên bản giao hàng
  deliveryOrderCodeLabel: '', // Hiển thị mã biên bản giao hàng
  deliverCode: '', // Mã bên giao hàng
  deliverName: '', // Hiển thị mã bên giao hàng
  importerName: '', // Nhân viên cân hàng
  user: `${auth.meta.fullName}`, // Nhân viên cân hàng
  userID: `${auth.meta.userId}`, // Nhân viên cân hàng
  phone: `${auth.meta.phoneNumber}`, // ăn theo nhân viên
  email: `${auth.meta.email}`, // ăn theo nhân viên
  supervisor: '', // Nhân viên giám sát
  supervisorID: '', // Nhân viên giám sát
  vehicleNumbering: 0, // Chuyến xe
  vehicleNumberingLabel: '', // Chuyến xe
  vehicleNumberings: [],
  note: '', // Ghi chú
  receiverCode: '', // Mã bên nhận hàng
  // status: '', // Trạng thái
  receiverName: '',
};
