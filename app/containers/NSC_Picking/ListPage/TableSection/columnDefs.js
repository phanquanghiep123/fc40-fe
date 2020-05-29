import React from 'react';
import { Link } from '@material-ui/core';
import { convertDateTimeString, convertTimeString } from '../../../App/utils';
export const makeColumnDefs = onDownloadFile => [
  {
    title: 'Tên File',
    render: rowData =>
      rowData.fileName ? (
        <Link
          href="#tai-file"
          to="#tai-file"
          onClick={e => {
            e.preventDefault();
            onDownloadFile(rowData.id, 1);
          }}
        >
          {rowData.fileName}
        </Link>
      ) : null,
  },
  {
    title: 'Tên File Lỗi',
    render: rowData =>
      rowData.fileErrorName ? (
        <Link
          href="#tai-file-loi"
          to="#tai-file"
          onClick={e => {
            e.preventDefault();
            onDownloadFile(rowData.id, 2);
          }}
          style={{ color: 'red' }}
        >
          {rowData.fileErrorName}
        </Link>
      ) : null,
  },
  {
    title: 'Thực Hiện',
    field: 'fullName',
  },
  {
    title: 'Thời Điểm Import',
    field: 'importTime',
    render: rowData => convertDateTimeString(rowData.importTime, false),
  },
  {
    title: 'Thời Gian Xử Lý',
    render: rowData =>
      `${convertDateTimeString(rowData.startTime, false)} - ${convertTimeString(
        rowData.endTime,
      )}`,
  },
  {
    title: 'Kết Quả',
    render: rowData =>
      `${rowData.totalRecord}/${rowData.totalInsert}/${rowData.errorRecord}`,
  },
  {
    title: 'Danh Sách NSC',
    field: 'processingHouses',
  },
];
