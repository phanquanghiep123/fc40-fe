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
  ToDate: null,
  FromDate: null,
  DateFromTo: null,
  purposeStorage: [],
  warningTypes: [],
  users: [],
  locators: [
    {
      locatorCode: '0',
      description: 'Tất cả',
    },
  ],
  isSubmit: false,
};
