import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import React from 'react';
import { Can } from 'authorize/ability-context';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons/index';
import { TYPE_PXK } from 'containers/NSC_PXK/PXK/constants';
import { linksTo } from './linksTo';
import { convertDateString } from '../../../App/utils';
import { TYPE_FORM } from '../../../NSC_PXK/PXK/Business';

export const makeTableColumns = (
  formData,
  openDeleteDialog,
  viewImportedStock,
) => [
  {
    title: 'Mã Phiếu Xuất Kho',
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
    title: 'Loại Xuất Kho',
    field: 'subType',
    render: rowData => {
      if (!formData.exportType) {
        return '';
      }

      const matches = formData.exportType.filter(
        item => item.value === rowData.subType,
      );

      if (matches.length > 0 && matches[0].label) {
        return matches[0].label;
      }
      return '';
    },
  },
  {
    title: 'Đơn Vị Xuất Hàng',
    field: 'deliverName',
  },
  {
    title: 'Đơn Vị Nhận Hàng',
    field: 'receiverName',
  },
  {
    title: 'Người Xuất Kho',
    field: 'userName',
  },
  {
    title: 'Người Giám Sát',
    field: 'supervisorName',
  },
  {
    title: 'Ngày Xuất Kho',
    field: 'date',
    render: rowData => convertDateString(rowData.date),
  },
  {
    title: 'Phiếu Nhập Liên Quan',
    field: 'documentCodeRefer',
    render: rowData => {
      if (rowData.subType === TYPE_PXK.PXK_CHUYEN_MA) {
        return (
          <Link
            to={`danh-sach-phieu-can-nhap-kho/xem-phieu-nhap-chuyen-ma-hang-hoa?form=2&id=${
              rowData.documentIdRefer
            }`}
            style={{ textDecoration: 'none' }}
          >
            {rowData.documentCodeRefer}
          </Link>
        );
      }
      if (
        rowData.subType === TYPE_PXK.PXK_NOI_BO ||
        rowData.subType === TYPE_PXK.PXK_DIEU_CHUYEN
      ) {
        return (
          <button
            type="button"
            style={{
              color: 'blue',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() =>
              viewImportedStock({
                importedStockId: rowData.documentIdRefer,
                receiverCodeRefer: rowData.receiverCodeRefer,
              })
            }
          >
            {rowData.documentCodeRefer}
          </button>
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
        {!rowData.autoFlag && (
          <Can do={CODE.suaPXCM} on={SCREEN_CODE.PXCM}>
            {rowData.subType === TYPE_PXK.PXK_CHUYEN_MA && (
              <Link
                to={`danh-sach-phieu-xuat-kho/chinh-sua-phieu-xuat-chuyen-ma-hang-hoa?form=2&id=${
                  rowData.documentId
                }`}
                style={{
                  textDecoration: 'none',
                  visibility: rowData.editable ? 'visible' : 'hidden',
                }}
              >
                <IconButton style={{ padding: '.5rem' }}>
                  <Edit />
                </IconButton>
              </Link>
            )}
          </Can>
        )}
        {!rowData.autoFlag && (
          <Can do={CODE.suaPXK} on={SCREEN_CODE.PXK}>
            {rowData.subType !== TYPE_PXK.PXK_CHUYEN_MA && (
              <Link
                to={`${linksTo.editPage}/${rowData.documentId}?type=${
                  rowData.subType
                }&form=${TYPE_FORM.EDIT}&plantId=${rowData.deliverCode}`}
                style={{
                  textDecoration: 'none',
                  visibility: rowData.editable ? 'visible' : 'hidden',
                }}
              >
                <IconButton style={{ padding: '.5rem' }}>
                  <Edit />
                </IconButton>
              </Link>
            )}
          </Can>
        )}

        {!rowData.autoFlag && (
          <Can do={CODE.xoaPXCM} on={SCREEN_CODE.PXCM}>
            {rowData.subType === TYPE_PXK.PXK_CHUYEN_MA && (
              <IconButton
                style={{
                  padding: '.5rem',
                  visibility: rowData.deletable ? 'visible' : 'hidden',
                }}
                onClick={() => {
                  openDeleteDialog(rowData.documentId);
                }}
              >
                <Delete />
              </IconButton>
            )}
          </Can>
        )}
        {!rowData.autoFlag && (
          <Can do={CODE.xoaPXK} on={SCREEN_CODE.PXK}>
            {rowData.subType !== TYPE_PXK.PXK_CHUYEN_MA && (
              <IconButton
                style={{
                  padding: '.5rem',
                  visibility: rowData.deletable ? 'visible' : 'hidden',
                }}
                onClick={() => {
                  openDeleteDialog(rowData.documentId);
                }}
              >
                <Delete />
              </IconButton>
            )}
          </Can>
        )}
      </div>
    ),
  },
];
