/* eslint-disable no-unused-vars */

const formRequestParams = {
  retailCode: 'int', // Mã đơn vị nhận hàng
  status: 'str', // Trạng thái
  deliveryCode: 'str', // Trạng đơn vị,
  userUpdate: '',
};

const importTypeResponse = {
  //
};

export const formDataSchema = {
  status: [], // fixed data
  deliveryCode: [], // fixed deliveryCode
  userUpdate: '',
  Approver: [],
  isSubmit: false,
};
