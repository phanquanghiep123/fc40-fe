import * as Yup from 'yup';
export const validSchema = Yup.object().shape({
  deliveryOrderCode: Yup.string().required('Trường không được bỏ trống'),
  user: Yup.string().required('Trường không được bỏ trống'),
  receiverCode: Yup.string().required('Trường không được bỏ trống'),
  deliverName: Yup.string().required('Trường không được bỏ trống'),
});
export const initialSchema = {
  id: 3,
  retailRequestCode: '',
  businessObject: '',
  businessObjectName: '',
  deliverCode: '',
  deliverCodeName: '',
  customerCode: '',
  customerName: '',
  saleOrderId: '',
  customerRetailId: '',
  customerPhoneNumber: '',
  retailCustomerName: '',
  retailCustomerAddress: '',
  date: '2019-08-13T17:35:35',
  userId: '',
  userName: '',
  approverLevel1: '',
  approverLevelName1: '',
  approverLevel2: '',
  approverLevelName2: '',
  note: 'string',
  paymentType: 1,
  paymentTypeName: '',
  detailsCommands: '',
};
