import React from 'react';
import { IconButton } from '@material-ui/core';
import { Delete, Edit, CheckCircle, DoneAll } from '@material-ui/icons/index';
import { SUBMIT_TIMEOUT } from 'utils/constants';
import { debounce } from 'lodash';
import { Can } from 'authorize/ability-context';
import { CODE, SCREEN_CODE } from 'authorize/groupAuthorize';

import { Link } from 'react-router-dom';
import { convertDateString } from '../../../App/utils';
import { localstoreUtilites } from '../../../../utils/persistenceData';
import { LINK } from '../constants';
const auth = localstoreUtilites.getAuthFromLocalStorage();
const { userId } = auth.meta;

const style = {
  buttonApprove: {
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'none',
    display: 'inline-block',
    padding: '.5rem',
  },
  iconSpan: {
    width: 40,
    display: 'inline-block',
  },
};

const ADD_OR_EDIT_STATUS = ['1', '2'];
const APPROVE_OR_REAPPROVE_STATUS = ['1', '3'];

const isStatusExits = (status, array) => array.includes(status.toString());

const renderApproveButton = rowData => {
  const { status = '' } = rowData || {};
  if (!isStatusExits(status, APPROVE_OR_REAPPROVE_STATUS)) return '';
  const butonText = (status === 1 && (
    <CheckCircle style={{ display: 'inline' }} />
  )) || <DoneAll style={{ display: 'inline' }} />;
  const url =
    (status === 1 && `${LINK.APPROVEL}/${rowData.id}`) ||
    `${LINK.UNAPPROVEL}/${rowData.id}`;

  return (
    <Can
      do={rowData.status !== 1 ? CODE.duyetLaiPXBX : CODE.duyetPXBX}
      on={SCREEN_CODE.PXBX}
    >
      <Link to={`${url}`} style={{ textDecoration: 'none' }}>
        <IconButton
          style={style.buttonApprove}
          title={rowData.status !== 1 ? 'Phê duyệt lại' : 'Phê duyệt'}
        >
          {butonText}
        </IconButton>
      </Link>
    </Can>
  );
};

const renderApproveElement = (rowData, history) => {
  const { approverLevel1, approverLevel2, level } = rowData || {};
  return (userId === approverLevel2 && level === 2) ||
    (userId === approverLevel1 && level === 1)
    ? renderApproveButton(rowData, history)
    : '';
};

const renderLabelLevel = rowData => {
  const { level, status, approverLevelName1, approverLevelName2 } =
    rowData || {};
  if (!level || status !== 1 || !approverLevelName1 || !approverLevelName2)
    return '';

  return (
    <span
      style={{
        backgroundColor: level === 1 ? '#02e49b' : '#ff8405',
        color: '#ffffff',
      }}
    >
      Cấp {level}
    </span>
  );
};

export const makeTableColumns = (openDeleteDialog, history) => [
  {
    title: 'Mã PYCBX',
    field: 'exportedRetailRequestCode',
  },
  {
    title: 'Trạng Thái',
    field: 'statusName',
  },
  {
    title: '',
    field: 'level',
    render: rowData => renderLabelLevel(rowData),
  },
  {
    title: 'Đơn vị',
    field: 'deliverName',
    sort: false,
  },
  {
    title: 'Ngày giao hàng',
    field: 'date',
    render: rowData => convertDateString(rowData.date),
  },
  {
    title: 'Người phê duyệt 1',
    field: 'approverLevelName1',
    sort: false,
  },
  {
    title: 'Người phê duyệt 2',
    field: 'approverLevelName2',
    sort: false,
  },
  {
    title: 'Ngày tạo phiếu',
    field: 'createdAt',
  },

  {
    title: 'Thao Tác',
    sort: false,
    headerStyle: {
      textAlign: 'center',
    },
    render: rowData => {
      const { status } = rowData || {};
      const needToAddOrEditItem = isStatusExits(status, ADD_OR_EDIT_STATUS);

      return (
        <div style={{ textAlign: 'center' }}>
          <Can do={CODE.suaPXBX} on={SCREEN_CODE.PXBX}>
            {needToAddOrEditItem && (
              <span style={style.iconSpan}>
                <Link
                  to={`${LINK.UPDATE}/${rowData.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <IconButton
                    style={{
                      padding: '.5rem',
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Link>
              </span>
            )}
          </Can>
          <span style={style.iconSpan}>
            {renderApproveElement(rowData, history)}
          </span>
          <Can do={CODE.xoaPXBX} on={SCREEN_CODE.PXBX}>
            {needToAddOrEditItem && (
              <span style={style.iconSpan}>
                <IconButton
                  style={{
                    padding: '.5rem',
                    visibility: 'visible',
                  }}
                  onClick={debounce(() => {
                    openDeleteDialog(rowData.id);
                  }, SUBMIT_TIMEOUT)}
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
