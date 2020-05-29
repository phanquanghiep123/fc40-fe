import React from 'react';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons/index';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { convertDateString } from '../../../App/utils';

export const makeTableColumns = (
  formData,
  editImportStock,
  openDeleteDialog,
) => [
  {
    title: 'Mã Phiếu Cân Nhập Kho',
    field: 'documentCode',
  },
  {
    title: 'Trạng Thái',
    field: 'status',
    render: rowData => {
      if (!formData.status) {
        return '';
      }

      const matches = formData.status.filter(
        item => item.value === rowData.status,
      );

      if (matches.length > 0 && matches[0].label) {
        return matches[0].label;
      }
      return '';
    },
  },
  {
    title: 'Loại Nhập Kho',
    field: 'subTypeName',
  },
  {
    title: 'Đơn Vị Giao Hàng',
    field: 'deliveryName',
  },
  {
    title: 'Mã BBGH',
    field: 'doCode',
  },
  {
    title: 'Chuyến Xe',
    field: 'vehicleNumbering',
  },
  {
    title: 'Nhân Viên Cân Hàng',
    field: 'userName',
  },
  {
    title: 'Nhân Viên Giám Sát',
    field: 'supervisorName',
  },
  {
    title: 'Ngày Nhập Kho',
    field: 'date',
    render: rowData => convertDateString(rowData.date),
  },
  {
    title: 'Thao Tác',
    headerStyle: {
      textAlign: 'center',
    },
    render: rowData => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 40, height: 40 }}>
          {!rowData.autoFlag && (
            <Can do={CODE.suaPCNK} on={SCREEN_CODE.IMPORT_STOCK}>
              <IconButton
                onClick={() => editImportStock(rowData.documentId)}
                style={{
                  padding: '.5rem',
                }}
              >
                <Edit />
              </IconButton>
            </Can>
          )}
        </span>
        <span style={{ width: 40, height: 40 }}>
          {!rowData.autoFlag && (
            <Can do={CODE.xoaPCNK} on={SCREEN_CODE.IMPORT_STOCK}>
              <IconButton
                style={{
                  padding: '.5rem',
                  visibility: rowData.deletable ? 'visible' : 'hidden',
                }}
                onClick={debounce(() => {
                  openDeleteDialog(rowData.documentId);
                }, SUBMIT_TIMEOUT)}
              >
                <Delete />
              </IconButton>
            </Can>
          )}
        </span>
      </div>
    ),
  },
];
