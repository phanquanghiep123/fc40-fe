const Today = new Date();
const Year = Today.getFullYear();
const Month = Today.getMonth();
const fristDayOfMonth = 1;
const lastDayOfMonth = new Date(Year, Month + 1, 0).getDate();
const FromDate = new Date(Year, Month, fristDayOfMonth);
const ToDate = new Date();
export const initialSchema = {
  Today,
  Year,
  Month,
  fristDayOfMonth,
  lastDayOfMonth,
  DateFrom: FromDate,
  DateTo: ToDate,
  pageSize: 10,
  pageIndex: 0,
  totalItem: 0,
  Sort: ['processDate'],
  org: [],
  basketCode: [],
  status: ['0'],
  vendor: [],
  vendorType: ['0'],
};
