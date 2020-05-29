/* eslint-disable no-unused-expressions */
import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import { Delete, Edit, CheckCircle, DoneAll } from '@material-ui/icons/index';

import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';

import { linksTo } from './linksTo';
import * as constants from '../constants';

const levelStyle = rowData => {
  if (rowData.level === constants.PYCH_LEVEL.LEVEL_1) {
    return {
      backgroundColor: '#89b5eb',
      color: '#333333',
    };
  }
  if (rowData.level === constants.PYCH_LEVEL.LEVEL_2) {
    return {
      backgroundColor: '#ffbe55',
      color: '#333333',
    };
  }
  if (rowData.level === constants.PYCH_LEVEL.LEVEL_3) {
    return {
      backgroundColor: '#70ffa5',
      color: '#333333',
    };
  }

  return null;
};
export const makeColumnDefs = openDeleteDialog => [
  {
    title: 'Mã PYCH',
    field: 'receiptCode',
    render: rowData => (
      <span style={rowData.isBasket ? { color: 'blue' } : null}>
        {rowData.receiptCode}
      </span>
    ),
  },
  {
    title: 'Loại Phiếu',
    field: 'receiptType',
  },
  {
    title: 'Trạng Thái',
    field: 'status',
    render: rowData => (
      <div style={{ width: 'max-content' }}>
        <span>{rowData.status} </span>
        <div
          style={
            rowData.isLabelVisible
              ? { display: 'inline-flex' }
              : { display: 'none' }
          }
        >
          <span
            style={{
              padding: '4px',
              ...levelStyle(rowData),
            }}
          >
            {rowData.level}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: 'Lý Do',
    field: 'causeOfCancellation',
  },
  {
    title: 'Ngày Tạo',
    field: 'created_date',
  },
  {
    title: 'Đơn Vị',
    field: 'org',
    sorting: false,
  },
  {
    title: 'Phê Duyệt Cấp 1',
    field: 'approverLevelName1',
    sorting: false,
  },
  {
    title: 'Phê Duyệt Cấp 2',
    field: 'approverLevelName2',
    sorting: false,
  },
  {
    title: 'Phê Duyệt Cấp 3',
    field: 'approverLevelName3',
    sorting: false,
  },
  {
    title: 'Thao Tác',
    sorting: false,
    headerStyle: {
      textAlign: 'left',
    },
    width: 150,
    // render: rowData => getAction(rowData, openDeleteDialog),
    render: rowData => defineButton(rowData, openDeleteDialog),
  },
];

// eslint-disable-next-line consistent-return
const defineButton = (rowData, openDeleteDialog) => {
  // const editProduct = rowData.isEditVisible &&

  if (!rowData.isBasket) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Can do={CODE.suaYCH} on={SCREEN_CODE.PYCH}>
          <span style={{ width: 40, height: 40 }}>
            {rowData.isEditVisible ? (
              <Link
                to={`${linksTo.editCancelRequest}${rowData.id}?isBasket=${
                  rowData.isBasket ? 'true' : 'false'
                }`}
                style={{
                  textDecoration: 'none',
                }}
              >
                <IconButton
                  title="Chỉnh sửa"
                  style={{ display: 'inline', padding: '.5rem' }}
                >
                  <Edit />
                </IconButton>
              </Link>
            ) : null}
          </span>
        </Can>
        {rowData.isApproved && (
          <Can do={CODE.pheDuyetLaiYCH} on={SCREEN_CODE.PYCH}>
            <span style={{ width: 40, height: 40 }}>
              <Link
                to={`${linksTo.reApproveCancelRequest}${rowData.id}?isBasket=${
                  rowData.isBasket ? 'true' : 'false'
                }`}
                style={{
                  textDecoration: 'none',
                }}
              >
                <IconButton
                  title="Phê duyệt lại"
                  style={{
                    padding: '.5rem',
                  }}
                >
                  <DoneAll style={{ display: 'inline' }} />
                </IconButton>
              </Link>
            </span>
          </Can>
        )}
        {!rowData.isApproved && (
          <Can do={CODE.pheDuyetYCH} on={SCREEN_CODE.PYCH}>
            <span style={{ width: 40, height: 40 }}>
              {rowData.isVisible && !rowData.isApproved ? (
                <Link
                  to={`${linksTo.approveCancelRequest}${rowData.id}?isBasket=${
                    rowData.isBasket ? 'true' : 'false'
                  }`}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <IconButton
                    title="Phê duyệt"
                    style={{
                      padding: '.5rem',
                    }}
                  >
                    <CheckCircle style={{ display: 'inline' }} />
                  </IconButton>
                </Link>
              ) : null}
            </span>
          </Can>
        )}
        <Can do={CODE.xoaYCH} on={SCREEN_CODE.PYCH}>
          <span style={{ width: 40, height: 40 }}>
            <IconButton
              title="Xóa"
              style={
                rowData.isDeleteVisible
                  ? { display: 'inline', padding: '.5rem' }
                  : { display: 'none', padding: '.5rem' }
              }
              onClick={() => {
                openDeleteDialog(rowData.id, rowData.isBasket);
              }}
            >
              <Delete />
            </IconButton>
          </span>
        </Can>
      </div>
    );
  }

  // Khay sot
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Can do={CODE.suaYCHKS} on={SCREEN_CODE.PYCH}>
        <span style={{ width: 40, height: 40 }}>
          {rowData.isEditVisible ? (
            <Link
              to={`${linksTo.editCancelRequest}${rowData.id}?isBasket=${
                rowData.isBasket ? 'true' : 'false'
              }`}
              style={{
                textDecoration: 'none',
              }}
            >
              <IconButton
                title="Chỉnh sửa"
                style={{ display: 'inline', padding: '.5rem' }}
              >
                <Edit />
              </IconButton>
            </Link>
          ) : null}
        </span>
      </Can>
      {rowData.isApproved && (
        <Can do={CODE.pheDuyetLaiYCHKS} on={SCREEN_CODE.PYCH}>
          <span style={{ width: 40, height: 40 }}>
            <Link
              to={`${linksTo.reApproveCancelRequest}${rowData.id}?isBasket=${
                rowData.isBasket ? 'true' : 'false'
              }`}
              style={{
                textDecoration: 'none',
              }}
            >
              <IconButton
                title="Phê duyệt lại"
                style={{
                  padding: '.5rem',
                }}
              >
                <DoneAll style={{ display: 'inline' }} />
              </IconButton>
            </Link>
          </span>
        </Can>
      )}
      {!rowData.isApproved && (
        <Can do={CODE.pheDuyetYCHKS} on={SCREEN_CODE.PYCH}>
          <span style={{ width: 40, height: 40 }}>
            {rowData.isVisible && !rowData.isApproved ? (
              <Link
                to={`${linksTo.approveCancelRequest}${rowData.id}?isBasket=${
                  rowData.isBasket ? 'true' : 'false'
                }`}
                style={{
                  textDecoration: 'none',
                }}
              >
                <IconButton
                  title="Phê duyệt"
                  style={{
                    padding: '.5rem',
                  }}
                >
                  <CheckCircle style={{ display: 'inline' }} />
                </IconButton>
              </Link>
            ) : null}
          </span>
        </Can>
      )}
      <Can do={CODE.xoaYCHKS} on={SCREEN_CODE.PYCH}>
        <span style={{ width: 40, height: 40 }}>
          <IconButton
            title="Xóa"
            style={
              rowData.isDeleteVisible
                ? { display: 'inline', padding: '.5rem' }
                : { display: 'none', padding: '.5rem' }
            }
            onClick={() => {
              openDeleteDialog(rowData.id, rowData.isBasket);
            }}
          >
            <Delete />
          </IconButton>
        </span>
      </Can>
    </div>
  );
};
