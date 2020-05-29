/* eslint-disable no-unused-vars */
export const formDataSchema = {
  org: [],
  status: [],
  orgRole: [
    {
      value: 0,
      label: 'Tất cả',
    },
    {
      value: 1,
      label: 'Đơn vị giao hàng',
    },
    {
      value: 2,
      label: 'Đơn vị nhận hàng',
    },
  ],
  deliveryOrg: [],
  receiveOrg: [],
};

const suppliersDataResponse = [
  {
    supplierCode: 2000217,
    supplierName: 'Công ty CP KMS đầu tư SX & TM',
    representativeName: 'Nguyễn Đức Hưng',
    phone: '0964988768',
    zoneRegion: 2,
    province: 89,
    district: 24,
    contractCode: 6,
    contractType: 1,
    contractSigningDate: '13/01/2018',
    contractEffectiveDate: '13/01/2018',
    stockServiceType: 6,
    legalEntityName: '',
    termsOfPayment: '',
    notes: 'Không có ghi chú',
  },
];

const farmProcessorsDataResponse = [
  {
    farmProcessorCode: 4007,
    farmSupplierName: 'NSC Đà Lạt Platform',
    zoneRegion: 2,
    farmSupplierType: 4,
    address: 'Đà Lạt Platform',
  },
];
