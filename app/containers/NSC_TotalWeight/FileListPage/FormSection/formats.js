/* eslint-disable no-unused-vars */
export const formDataSchema = {
  unitCode: [],
  regions: [],
  unitCodes: '', // hidden
  processingDate: '',
  supplierCode: '',
  isPurchaseStopping: '',
  isWarning: '',
};

export const formDemoData = {
  unitCode: [
    {
      value: '0',
      label: 'Tất cả',
    },
    {
      value: '1',
      label: 'Đơn vị 1',
    },
    {
      value: '2',
      label: 'Đơn vị 2',
    },
  ],
  unitCodes: '1,2,3',
};
