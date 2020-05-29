import moment from 'moment';

import { constSchema } from './schema';
import { ConvertUTCtoClient } from '../../../App/utils';
export const makeTableColumns = () => [
  {
    title: 'Thời gian xử lý',
    field: constSchema.processDate,
    headerStyle: {
      width: '400px',
    },
    render: RowData =>
      moment(RowData[constSchema.processDate]).format('DD/MM/YYYY HH:mm'),
  },
  {
    title: 'Ngày sản xuất',
    field: constSchema.dateProduction,
    headerStyle: {
      width: '400px',
    },
    sort: false,
    render: RowData => {
      const fromDate = ConvertUTCtoClient(
        RowData[constSchema.importFromDate],
        true,
      );
      const toDate = ConvertUTCtoClient(
        RowData[constSchema.importToDate],
        true,
      );

      return `${fromDate} ~ ${toDate}`;
    },
  },

  {
    title: 'Người xử lý',
    field: constSchema.userHandLing,
  },
];
