import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import {
  Delete,
  Edit,
  StarHalf,
  Star,
  AddCircle,
} from '@material-ui/icons/index';
import { debounce } from 'lodash';
import { FaBalanceScale, FaPeopleCarry } from 'react-icons/fa';
import {
  DELIVERY_ORDER_BUSSINES,
  DELIVERY_ORDER_FARM_TO_PLANT_2,
} from 'containers/App/constants';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';
import { Can } from 'authorize/ability-context';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { linksTo } from './linksTo';
import {
  convertDateString,
  isValidDate,
  convertDateTimeString,
} from '../../../App/utils';
import {
  BBGH_BASKET_STATUS_CREATE_NEW,
  BBGH_BASKET_STATUS_NORMAL,
  BBGH_BASKET_STATUS_WARNING,
} from '../constants';

import { TYPE_BBGH } from '../../BBGHCreatePage/constants';

const linkToExportDetail = id =>
  `/danh-sach-bien-ban-giao-hang/phieu-xuat-kho-khay-sot?form=3&id=${id}`;

const linkToExportEdit = id =>
  `/danh-sach-bien-ban-giao-hang/phieu-xuat-kho-khay-sot?form=2&id=${id}`;

function renderExportBasketIcon(exportBasketStatus, doCode) {
  if (exportBasketStatus.status === BBGH_BASKET_STATUS_WARNING) {
    if (!exportBasketStatus.isAuthorized) {
      return (
        <IconButton>
          <StarHalf style={{ color: 'red' }} />
        </IconButton>
      );
    }
    return (
      <Link
        to={`${
          exportBasketStatus.ids && exportBasketStatus.ids.length === 1
            ? `${linkToExportEdit(exportBasketStatus.ids[0])}`
            : `/danh-sach-phieu-xuat-kho-khay-sot?doCode=${doCode}`
        }`}
      >
        <IconButton>
          <StarHalf style={{ color: 'red' }} />
        </IconButton>
      </Link>
    );
  }
  if (exportBasketStatus.status === BBGH_BASKET_STATUS_NORMAL) {
    if (!exportBasketStatus.isAuthorized) {
      return (
        <IconButton>
          <Star color="primary" />
        </IconButton>
      );
    }
    return (
      <Link
        to={`${
          exportBasketStatus.ids && exportBasketStatus.ids.length === 1
            ? `${linkToExportDetail(exportBasketStatus.ids[0])}`
            : `/danh-sach-phieu-xuat-kho-khay-sot?doCode=${doCode}`
        }`}
      >
        <IconButton>
          <Star color="primary" />
        </IconButton>
      </Link>
    );
  }
  return null;
}

function renderImportBasketIcon(
  importBasketStatus,
  doCode,
  createNewImportBasket,
  history,
) {
  if (importBasketStatus.status === BBGH_BASKET_STATUS_CREATE_NEW) {
    if (!importBasketStatus.isAuthorized) {
      return (
        <IconButton>
          <AddCircle color="primary" />
        </IconButton>
      );
    }
    return (
      <IconButton
        onClick={() =>
          createNewImportBasket({
            data: { doCode },
            callback: id => {
              history.push(
                `/danh-sach-bien-ban-giao-hang/chinh-sua-phieu-nhap-kho-khay-sot?form=2&id=${id}`,
              );
            },
          })
        }
      >
        <AddCircle color="primary" />
      </IconButton>
    );
  }
  if (importBasketStatus.status === BBGH_BASKET_STATUS_WARNING) {
    if (!importBasketStatus.isAuthorized) {
      return (
        <IconButton>
          <StarHalf style={{ color: 'red' }} />
        </IconButton>
      );
    }
    return (
      <Link
        to={`/danh-sach-bien-ban-giao-hang/chinh-sua-phieu-nhap-kho-khay-sot?form=2&id=${
          importBasketStatus.ids[0]
        }`}
      >
        <IconButton>
          <StarHalf style={{ color: 'red' }} />
        </IconButton>
      </Link>
    );
  }
  if (importBasketStatus.status === BBGH_BASKET_STATUS_NORMAL) {
    if (!importBasketStatus.isAuthorized) {
      return (
        <IconButton>
          <Star color="primary" />
        </IconButton>
      );
    }
    return (
      <Link
        to={`/danh-sach-bien-ban-giao-hang/xem-phieu-nhap-kho-khay-sot?form=3&id=${
          importBasketStatus.ids[0]
        }`}
      >
        <IconButton>
          <Star color="primary" />
        </IconButton>
      </Link>
    );
  }
  return null;
}

export const makeTableColumns = (
  formData,
  openDeleteDialog,
  weighingHandler,
  createNewImportBasket,
  history,
  tableData,
) => [
  {
    title: 'Mã BBGH',
    field: 'doCode',
    cellStyle: value => {
      const rowData = tableData.find(item => item.doCode === value);
      if (
        rowData.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER ||
        rowData.doType === TYPE_BBGH.BASKET_DELIVERY_ORDER_LOAN
      ) {
        return { color: 'blue' };
      }
      return {};
    },
  },
  {
    title: 'PXKS',
    field: 'PXKS',
    headerStyle: {
      width: 80,
      maxWidth: 100,
    },
    render: rowData =>
      renderExportBasketIcon(rowData.doExportBasketStatus, rowData.doCode),
  },
  {
    title: 'PNKS',
    field: 'PNKS',
    headerStyle: {
      width: 80,
      maxWidth: 100,
    },
    render: rowData =>
      renderImportBasketIcon(
        rowData.doImportBasketStatus,
        rowData.doCode,
        createNewImportBasket,
        history,
      ),
  },
  {
    title: 'Trạng Thái',
    field: 'status',
    render: rowData => {
      const statuses = formData.status;
      if (!statuses) {
        return '';
      }

      const status = statuses.filter(stt => stt.value === rowData.status);

      if (status.length > 0 && status[0].label) {
        return status[0].label;
      }
      return '';
    },
    headerStyle: {
      minWidth: 120,
    },
  },
  {
    title: 'Đơn Vị Giao Hàng',
    field: 'deliveryName',
    headerStyle: {
      minWidth: 120,
    },
  },
  {
    title: 'Đơn Vị Nhận Hàng',
    field: 'receiverName',
    headerStyle: {
      minWidth: 120,
    },
  },
  {
    title: 'Số Thứ Tự Xe',
    field: 'vehicleNumbering',
  },
  {
    title: 'Ngày Dự Kiến Đến',
    field: 'plannedArrivalDate',
    render: rowData => convertDateString(rowData.plannedArrivalDate) || '',
  },
  {
    title: 'Thời Gian Dự Kiến Đến',
    field: 'plannedArrivalHour',
  },
  {
    title: 'Thời Gian Xuất Phát',
    field: 'actualDepartureHour',
  },
  {
    title: 'Thời Gian Thực Tế Đến',
    field: 'actualArrivalTime',
    render: rowData => {
      const actualDate = new Date(rowData.actualArrivalDate || undefined);
      const regulatedDate = new Date(rowData.regulatedArrivalDate || undefined);

      if (!isValidDate(actualDate) || !isValidDate(regulatedDate)) {
        return '';
      }

      let isHighlighted = false;
      let cellStyle = {
        display: 'flex',
        flexDirection: 'column',
      };

      // show date if diff
      let dateStr = '';
      if (actualDate.getDate() !== regulatedDate.getDate()) {
        dateStr = convertDateString(actualDate);
        isHighlighted = true;
      }

      // show time
      const actualTime = rowData.actualArrivalTime;
      const regulatedTime = rowData.regulatedArrivalHour;

      if (actualTime !== regulatedTime) {
        isHighlighted = true;
      }

      if (isHighlighted) {
        cellStyle = {
          display: 'flex',
          flexDirection: 'column',
          color: 'red',
        };
      }

      return (
        <div style={cellStyle}>
          <div>{dateStr}</div>
          <div>{actualTime}</div>
        </div>
      );
    },
  },
  {
    title: 'Leadtime Yêu Cầu',
    field: 'regulatedArrivalHour',
    render: rowData => {
      const actualDate = new Date(rowData.actualArrivalDate);
      const regulatedDate = new Date(rowData.regulatedArrivalDate);
      if (!isValidDate(actualDate) || !isValidDate(regulatedDate)) {
        return '';
      }

      let isHighlighted = false;
      let cellStyle = {
        display: 'flex',
        flexDirection: 'column',
      };

      // show date if diff
      let dateStr = '';
      if (actualDate.getDate() !== regulatedDate.getDate()) {
        dateStr = convertDateString(regulatedDate);
        isHighlighted = true;
      }

      // show time
      const actualTime = rowData.actualArrivalTime;
      const regulatedTime = rowData.regulatedArrivalHour;

      if (actualTime !== regulatedTime) {
        isHighlighted = true;
      }

      if (isHighlighted) {
        cellStyle = {
          display: 'flex',
          flexDirection: 'column',
          color: 'red',
        };
      }

      return (
        <div style={cellStyle}>
          <div>{dateStr}</div>
          <div>{regulatedTime}</div>
        </div>
      );
    },
  },
  {
    title: 'Số Lần Cập Nhật',
    field: 'updatedTimes',
    headerStyle: {
      maxWidth: 50,
    },
  },
  {
    title: 'TG Cập Nhật',
    field: 'updatedAt',
    render: rowData => convertDateTimeString(rowData.updatedAt) || '',
  },

  {
    title: 'Thao Tác',
    headerStyle: {
      textAlign: 'center',
    },
    render: rowData => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Can do={CODE.suaTiepNhan} on={SCREEN_CODE.BBGH}>
          <span style={{ width: 40, height: 40 }}>
            <Link
              to={`${linksTo.receivingDeliveryOrder}${rowData.doId}?${
                rowData.doType === DELIVERY_ORDER_BUSSINES ? 'shipperId=0' : ''
              }`}
              style={{
                textDecoration: 'none',
                visibility:
                  rowData.receivable &&
                  rowData.doType !== DELIVERY_ORDER_FARM_TO_PLANT_2
                    ? 'visible'
                    : 'hidden',
              }}
            >
              <IconButton
                title="Tiếp nhận"
                style={{
                  padding: '.5rem',
                }}
              >
                <FaPeopleCarry style={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Link>
          </span>
        </Can>
        <Can do={[CODE.suaPCNK, CODE.taoPCNK]} on={SCREEN_CODE.IMPORT_STOCK}>
          <span
            style={{
              width: 32,
              height: 32,
              visibility: rowData.canWeight ? 'visible' : 'hidden',
            }}
          >
            <IconButton
              title="Cân"
              style={{
                padding: '.5rem',
              }}
              onClick={debounce(
                () => weighingHandler(rowData.doId),
                SUBMIT_TIMEOUT,
              )}
            >
              <FaBalanceScale style={{ fontSize: '1.5rem' }} />
            </IconButton>
          </span>
        </Can>
        <Can do={CODE.suaBBGH} on={SCREEN_CODE.BBGH}>
          <span style={{ width: 40, height: 40 }}>
            <Link
              to={`${linksTo.editDeliveryOrder}${rowData.doId}`}
              style={{
                textDecoration: 'none',
                visibility: rowData.editable ? 'visible' : 'hidden',
              }}
            >
              <IconButton title="Chỉnh sửa" style={{ padding: '.5rem' }}>
                <Edit />
              </IconButton>
            </Link>
          </span>
        </Can>
        <Can do={CODE.xoaBBGH} on={SCREEN_CODE.BBGH}>
          <span style={{ width: 40, height: 40 }}>
            <IconButton
              title="Xóa"
              style={{
                padding: '.5rem',
                visibility: rowData.deletable ? 'visible' : 'hidden',
              }}
              onClick={() => {
                openDeleteDialog(rowData.doId);
              }}
            >
              <Delete />
            </IconButton>
          </span>
        </Can>
      </div>
    ),
  },
];
