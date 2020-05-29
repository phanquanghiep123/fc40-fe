import moment from 'moment';
import { constSchema } from '../TableSection/schema';
const Today = new Date();
const Year = Today.getFullYear();
const Month = Today.getMonth();
const fristDayOfMonth = 1;
const lastDayOfMonth = new Date(Year, Month + 1, 0).getDate();
const a = moment([Year, Month, fristDayOfMonth]);
const b = moment([Year, Month, lastDayOfMonth]);
const numberShowColumnDate = b.diff(a, 'days');
const FromDate = new Date(Year, Month, fristDayOfMonth);
const ToDate = new Date(Year, Month, lastDayOfMonth);
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
  dateFrom: FromDate,
  dateTo: ToDate,
  productCode: '',
  productName: '',
  pageSize: 5,
  pageIndex: 0,
  totalItem: 0,
  productCodeOrName: '',
  sort: [
    constSchema.plantCode,
    constSchema.regionCode,
    constSchema.productionOrderCode,
    constSchema.finishDate,
  ],
  numberShowColumnDate,
  plantCode: {},
  regionsCode: {},
  Regions: [],
  Farms: [],
  LSXs: [],
  filterArg: [constSchema.productCode],
  isSubmit: false,
};
export const farm = {
  name: 'name',
  value: 'value',
};

export const lsxsx = {
  name: 'name',
  value: 'value',
};
