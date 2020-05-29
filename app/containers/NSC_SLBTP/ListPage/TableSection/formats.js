import initialSchema from './schema';

export const tableDataResponse = {
  statusCode: 200,
  message: '',
  developerMessage: '',
  data: [initialSchema],
  meta: {
    pageIndex: 0,
    pageSize: 10,
    count: 1,
    menu: null,
    accessToken: null,
    fullName: null,
  },
};
