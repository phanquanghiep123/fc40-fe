import moment from 'moment';
const Today = new Date();
const Year = Today.getFullYear();
const Month = Today.getMonth();
const fristDayOfMonth = 1;
const lastDayOfMonth = new Date(Year, Month + 1, 0).getDate();
const a = moment([Year, Month, fristDayOfMonth]);
const b = moment([Year, Month, lastDayOfMonth]);
const numberShowColumnDate = b.diff(a, 'days') + 1;
export const initialSchema = {
  Today,
  Year,
  Month,
  fristDayOfMonth,
  lastDayOfMonth,
  farmIdFrom: '',
  farmIdTo: '',
  LSXCodeFrom: '',
  LSXCodeTo: '',
  dateFrom: new Date(Year, Month, fristDayOfMonth),
  dateTo: new Date(Year, Month, lastDayOfMonth),
  productCode: '',
  productName: '',
  pageSize: 5,
  pageIndex: 0,
  totalItem: 0,
  productCodeOrName: '',
  sort: ['plantCode', 'regionCode', 'productionOrderCode'],
  numberShowColumnDate,
  plantCode: {},
  regionsCode: {},
  Regions: [],
  Farms: [],
  LSXs: [],
  filterArg: ['productCode'],
  isSubmit: false,
  isRun: false,
};
export const farm = {
  name: 'name',
  value: 'value',
};

export const lsxsx = {
  name: 'name',
  value: 'value',
};
