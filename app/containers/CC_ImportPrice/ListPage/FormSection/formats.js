/* eslint-disable no-unused-vars */

const formRequestParams = {
  retailCode: 'int', // Mã đơn vị nhận hàng
  status: 'str', // Trạng thái
  org: 'str', // Trạng đơn vị,
  userUpdate: '',
};

const importTypeResponse = {
  //
};

export const formDataSchema = {
  status: [], // fixed data
  org: [], // fixed org
  userUpdate: '',
  Approver: [],
  DateTo: '',
  DateFrom: '',
  DateFromTo: '',
  RegionProductionCode: [],
  RegionConsumeCode: [],
  isSubmit: false,
};
