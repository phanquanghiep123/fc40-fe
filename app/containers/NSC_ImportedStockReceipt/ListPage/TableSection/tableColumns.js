import React from 'react';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons/index';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { convertDateString } from '../../../App/utils';
import { SUBTYPE } from '../constants';

const editRow = rowData => !rowData.autoFlag && rowData.editable;

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
    title: 'Phiếu Xuất Liên Quan',
    field: 'documentCodeRefer',
    render: rowData => {
      if (rowData.subType === SUBTYPE.TRANSFER_GOODS_CODE) {
        return (
          <Link
            to={`danh-sach-phieu-xuat-kho/xem-phieu-xuất-chuyen-ma-hang-hoa?form=3&id=${
              rowData.documentIdRefer
            }`}
            style={{ textDecoration: 'none' }}
          >
            {rowData.documentCodeRefer}
          </Link>
        );
      }
      if (
        rowData.subType === SUBTYPE.INTERNAL ||
        rowData.subType === SUBTYPE.TRANSFER
      ) {
        return (
          <Link
            to={`danh-sach-phieu-xuat-kho/xem-phieu-xuat-kho/${
              rowData.documentIdRefer
            }?type=${rowData.subTypeRefer}&form=3&plantId=${
              rowData.deliverCodeRefer
            }`}
            style={{ textDecoration: 'none' }}
          >
            {rowData.documentCodeRefer}
          </Link>
        );
      }
      return '';
    },
  },
  {
    title: 'Thao Tác',
    headerStyle: {
      textAlign: 'center',
    },
    render: rowData => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ width: 40, height: 40 }}>
          {editRow(rowData) && (
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
