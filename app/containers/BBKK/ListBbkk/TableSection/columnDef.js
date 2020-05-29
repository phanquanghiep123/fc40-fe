import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import React from 'react';
import Icon from '@material-ui/core/Icon';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import CancelIcon from '@material-ui/icons/Cancel';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { convertDateTimeString } from '../../../App/utils';
// import { Can } from 'authorize/ability-context';
// import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
// import { convertDateTimeString } from 'App/utils';
export const columnDefs = openDeleteDialog => [
  {
    title: 'Mã BBKK',
    field: 'basketStockTakingCode',
  },
  {
    title: 'Trạng Thái',
    field: 'statusName',
  },
  {
    title: 'Xử Lý Sau Kiểm Kê',
    field: 'afterStatusName',
  },
  {
    title: 'Đơn vị Kiểm Kê',
    field: 'plantName',
  },
  {
    title: 'Loại Kiểm Kê',
    field: 'stocktakingTypeName',
  },
  {
    title: 'Đợt Kiểm Kê',
    field: 'stocktakingRound',
  },
  {
    title: 'Thời Gian Thực Hiện Kiểm Kê',
    field: 'date',
    // sort: false,
    render: rowData => convertDateTimeString(rowData.date),
  },
  {
    title: 'Người thực hiện',
    field: 'personnelStocktakingName',
    sort: false,
    cellStyle: {
      width: '30%',
    },
  },
  {
    title: 'Thao Tác',
    field: 'action',
    cellStyle: {
      width: '15%',
    },
    resizable: true,
    sort: false,
    render: rowData => {
      const delEditPermisson =
        rowData.status === 2 && rowData.afterStatus === 1;
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Can do={CODE.suaDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {rowData.isEditable && (
              <span style={{ width: 40, height: 40 }}>
                <Link
                  to={`/danh-sach-bien-ban-kiem-ke/chinh-sua-bien-ban-kiem-ke-khay-sot?form=2&id=${
                    rowData.id
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
          <Can do={CODE.suaKKDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {delEditPermisson && (
              <span style={{ width: 40, height: 40 }}>
                <Link
                  to={`/danh-sach-bien-ban-kiem-ke/chinh-sua-bien-ban-kiem-ke-khay-sot?form=2&id=${
                    rowData.id
                  }`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <IconButton title="Chỉnh sửa" style={{ padding: '.5rem' }}>
                    <Edit />
                  </IconButton>
                </Link>
              </span>
            )}
          </Can>
          <Can do={CODE.xoaDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {rowData.isDeletable && (
              <span style={{ width: 40, height: 40 }}>
                <IconButton
                  title="Xóa"
                  style={{ padding: '.5rem' }}
                  onClick={() => {
                    openDeleteDialog(rowData.id);
                  }}
                >
                  <Delete />
                </IconButton>
              </span>
            )}
          </Can>
          <Can do={CODE.xlSauKKDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {rowData.isTransfer && (
              <span style={{ width: 40, height: 40 }}>
                <Link
                  to={`/danh-sach-bien-ban-kiem-ke/xu-ly-sau-kiem-ke?plantCode=${
                    rowData.plantCode
                  }&basketStockTakingCode=${rowData.basketStockTakingCode}`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <IconButton title="Điều Chuyển" style={{ padding: '.5rem' }}>
                    <AutorenewIcon />
                  </IconButton>
                </Link>
              </span>
            )}
          </Can>
          <Can do={CODE.dieuChinhDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {rowData.isAdjust && (
              <span style={{ width: 40, height: 40 }}>
                <Link
                  to={`/danh-sach-bien-ban-kiem-ke/dieu-chinh-bien-ban-kiem-ke-khay-sot?form=1&id=${
                    rowData.id
                  }`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <IconButton title="Điều Chỉnh" style={{ padding: '.5rem' }}>
                    <Icon fontSize="small">build</Icon>
                  </IconButton>
                </Link>
              </span>
            )}
          </Can>
          <Can do={CODE.xemDieuChinhDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {rowData.isReceipAdjustDetail && (
              <span style={{ width: 40, height: 40 }}>
                <Link
                  to={`/danh-sach-bien-ban-kiem-ke/xem-dieu-chinh-bien-ban-kiem-ke-khay-sot?form=2&id=${
                    rowData.id
                  }`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <IconButton
                    title="Xem Điều Chỉnh"
                    style={{ padding: '.5rem' }}
                  >
                    <ListAltIcon />
                  </IconButton>
                </Link>
              </span>
            )}
          </Can>
          <Can do={CODE.huyDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {rowData.isCancel && (
              <span style={{ width: 40, height: 40 }}>
                <Link
                  to={`/danh-sach-bien-ban-kiem-ke/huy-bien-ban-kiem-ke-khay-sot?form=4&id=${
                    rowData.id
                  }`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <IconButton title="Hủy" style={{ padding: '.5rem' }}>
                    <CancelIcon />
                  </IconButton>
                </Link>
              </span>
            )}
          </Can>
          <Can do={CODE.xoaKKDSBBKK} on={SCREEN_CODE.DSBBKK}>
            {delEditPermisson && (
              <span style={{ width: 40, height: 40 }}>
                <IconButton
                  title="Xóa"
                  style={{ padding: '.5rem' }}
                  onClick={() => {
                    openDeleteDialog(rowData.id);
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
