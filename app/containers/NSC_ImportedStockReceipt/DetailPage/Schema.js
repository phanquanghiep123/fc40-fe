import * as Yup from 'yup';

export const validSchema = Yup.object().shape({});

export const initialSchema = {
  receiverName: 1,
  importerName: '',
  importerPhone: '',
  importerEmail: '',
  supervisorName: '',
  subTypeName: '',
  deliverCodeName: '',
  receiverCodeName: '',
  date: '',
  deliveryOrderCode: '',
  deliverCode: '',
  deliveryName: 'VinEco Quảng Ninh',
  receiverCode: '', // mã bên nhận hàng
  userID: '',
  phone: '',
  email: '',
  supervisorID: '',
  vehicleNumberingLabel: '',
  vehicleNumber: 0,
  note: '',
  basketDocumentId: '',
  basketDocumentStatus: '',
};
