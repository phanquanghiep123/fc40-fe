import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import React from 'react';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { convertDateTimeString } from '../../App/utils';

export const columnDefs = openDeleteDialog => [
  {
    title: 'Mã PNKS',
    field: 'basketDocumentCode',
  },
  {
    title: 'Loại Nhập Khay Sọt',
    field: 'subTypeName',
  },
  {
    title: 'Trạng Thái',
    field: 'statusName',
  },
  {
    title: 'Đơn vị Giao Hàng',
    field: 'deliverName',
  },
  {
    title: 'Đơn Vị Nhận Hàng',
    field: 'receiverName',
  },
  {
    title: 'Mã BBGH',
    field: 'deliveryOrderCode',
    render: rowData => (
      <div>
        {!rowData.isReceived && (
          <Link
            to={`/danh-sach-bien-ban-giao-hang/chinh-sua-bien-ban-giao-hang/${
              rowData.deliveryOrderId
            }`}
            style={{
              textDecoration: 'none',
            }}
          >
            {rowData.deliveryOrderCode}
          </Link>
        )}
        {rowData.isReceived && (
          <Link
            to={`/danh-sach-bien-ban-giao-hang/xem-bien-ban-giao-hang/${
              rowData.deliveryOrderId
            }`}
            style={{
              textDecoration: 'none',
            }}
          >
            {rowData.deliveryOrderCode}
          </Link>
        )}
      </div>
    ),
  },
  {
    title: 'Người Nhập Khay Sọt',
    field: 'importerName',
    sort: false,
  },
  {
    title: 'Người Giám Sát',
    field: 'supervisorName',
    sort: false,
  },
  {
    title: 'Ngày Nhập Khay Sọt',
    field: 'date',
    render: rowData => convertDateTimeString(rowData.date),
  },
  {
    title: 'Thời Gian Tạo Phiếu',
    field: 'dateCreate',
    render: rowData => convertDateTimeString(rowData.date),
  },
  {
    title: 'Thao Tác',
    field: 'action',
    width: 80,
    resizable: true,
    render: rowData => {
      const permissionDel = rowData.editable && rowData.deletable;
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Can do={CODE.suaDSPNKS} on={SCREEN_CODE.DSPNKS}>
            {rowData.editable && (
              <span style={{ width: 40, height: 40 }}>
                <Link
                  to={`/danh-sach-phieu-nhap-khay-sot/chinh-sua-phieu-nhap-kho-khay-sot?form=2&id=${
                    rowData.basketDocumentId
                  }`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <IconButton title="Chỉnh Sửa" style={{ padding: '.5rem' }}>
                    <Edit />
                  </IconButton>
                </Link>
              </span>
            )}
          </Can>
          <Can do={CODE.xoaDSPNKS} on={SCREEN_CODE.DSPNKS}>
            {permissionDel && (
              <span style={{ width: 40, height: 40 }}>
                <IconButton
                  title="Xóa"
                  style={{ padding: '.5rem' }}
                  onClick={() => {
                    openDeleteDialog(rowData.basketDocumentId);
                  }}
                >
                  <Delete />
                </IconButton>
              </span>
            )}
          </Can>
        </div>
      );
    },
  },
];
