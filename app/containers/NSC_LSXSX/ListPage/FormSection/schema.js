import { constSchema } from '../TableSection/schema';
export const initialSchema = {
  dateFrom: new Date(),
  dateTo: new Date(),
  sort: [[`-${constSchema.processDate}`]],
  plantCode: {},
  regionsCode: {},
  Regions: [],
  Farms: [],
  LSXs: [],
  filterArg: [],
  isSubmit: false,
  pageSize: 5,
  pageIndex: 0,
  totalItem: 0,
  isRuning: false,
};
export const farm = {
  name: 'name',
  value: 'value',
};

export const lsxsx = {
  name: 'name',
  value: 'value',
};
