import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import React from 'react';
import { Can } from 'authorize/ability-context';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons/index';
import { Link } from 'react-router-dom';
import { linksTo } from './linksTo';
import { convertDateString, convertHourMinString } from '../../../App/utils';

export const makeColumnDefs = openDeleteDialog => [
  {
    title: 'Mã BBGNHH',
    field: 'deliveryReceiptCode',
  },
  {
    title: 'Loại BBGNHH',
    field: 'deliveryReceiptTypeName',
  },
  {
    title: 'Đơn Vị Giao Hàng',
    field: 'deliveryPlant',
  },
  {
    title: 'Đơn Vị Nhận Hàng',
    field: 'receiver',
  },
  {
    title: 'Mã Phiếu Xuất Kho',
    field: 'stockExportReceiptCode',
  },
  {
    title: 'Nhà Vận Chuyển',
    field: 'transporter',
  },
  {
    title: 'Biển Số Xe',
    field: 'drivingPlate',
  },
  {
    title: 'Giờ Xuất Phát Theo Qui Định',
    render: rowData => convertHourMinString(rowData.regulatedDepartureDate),
  },
  {
    title: 'Thời Gian Xuất Phát Thực Tế',
    render: rowData => convertHourMinString(rowData.actualDepartureDate),
  },
  {
    title: 'Ngày Giao Hàng',
    // field: 'deliveryDate',
    render: rowData => convertDateString(rowData.deliveryDate),
  },
  {
    title: 'Người Tạo Phiếu',
    field: 'creatorName',
  },
  {
    title: 'Thao Tác',
    headerStyle: {
      textAlign: 'center',
    },
    render: rowData => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 40, height: 40 }}>
          <Can do={CODE.suaBBGNHH} on={SCREEN_CODE.BBGNHH}>
            <Link
              to={`${linksTo.editBBGNHH}${rowData.id}?type=${
                rowData.deliveryReceiptType
              }`}
              style={{
                textDecoration: 'none',
              }}
            >
              <IconButton title="Chỉnh sửa" style={{ padding: '.5rem' }}>
                <Edit />
              </IconButton>
            </Link>
          </Can>
        </span>
        <span
          style={
            !rowData.isAutomatic
              ? { display: 'inline', width: 32, height: 32 }
              : { display: 'none' }
          }
        >
          <Can do={CODE.xoaBBGNHH} on={SCREEN_CODE.BBGNHH}>
            <IconButton
              title="Xóa"
              style={{ padding: '.5rem' }}
              onClick={() => {
                openDeleteDialog(rowData.id);
              }}
            >
              <Delete />
            </IconButton>
          </Can>
        </span>
      </div>
    ),
  },
];
