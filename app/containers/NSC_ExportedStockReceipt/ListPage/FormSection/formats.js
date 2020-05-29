/* eslint-disable no-unused-vars */

const formRequestParams = {
  deliverCode: '',
  expStockRecptCode: '',
  receiverCode: '',
  exportedDateFrom: '',
  exportedDateTo: '',
  status: '',
  exportType: '',
  orgCodes: '',
  pageSize: '',
  pageIndex: '',
  ids: '',
};

const importTypeResponse = {
  //
};

export const formDataSchema = {
  deliverCode: [],
  exportType: [],
  receiverCode: [],
  users: [],
  status: [
    {
      value: 0,
      label: 'Tất cả',
    },
    {
      value: 1,
      label: 'Đang cân',
    },
    {
      value: 2,
      label: 'Hoàn thành',
    },
  ], // fixed data
};
