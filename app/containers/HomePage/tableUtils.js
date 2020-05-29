import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

const styles = () => ({
  containerIcon: {
    display: 'flex',
  },
});

function FloatingActionButtons(props) {
  const { classes } = props;
  // console.log(rowData);
  return (
    <div className={classes.containerIcon}>
      <IconButton aria-label="Edit">
        <Edit />
      </IconButton>
      <IconButton aria-label="Delete">
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

FloatingActionButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  // rowData: PropTypes.object,
};

const ActionColums = withStyles(styles)(FloatingActionButtons);

export const columns = [
  {
    title: 'id',
    field: 'id',
    hidden: true,
  },
  { title: 'Mã BBGH', field: 'codeBBGH' },
  { title: 'Loại BBGH', field: 'typeBBGH' },
  { title: 'Trạng thái', field: 'status' },
  { title: 'Đơn vị giao hàng', field: 'unitGH' },
  { title: 'Mã FARM/NCC', field: 'codeFarmNCC' },
  { title: 'Ngày giao', field: 'dateDelivery' },
  { title: 'Đơn vị nhận hàng', field: 'unitRecive' },
  { title: 'Mã NSC', field: 'codeNSC' },
  { title: 'Người tạo BB', field: 'personCreateBB' },
  { title: 'Thời gian tạo BB', field: 'timeCreateBB' },
  {
    title: 'Chức năng',
    field: 'function',
    render: rowData => <ActionColums rowData={rowData} />,
  },
];

export const datas = [
  {
    id: 1,
    codeBBGH: 'BBGH01_20181211',
    typeBBGH: 'Biên bản - Farm',
    status: 'Đang tiếp nhận',
    unitGH: 'VinEco Quảng Ninh',
    codeFarmNCC: 'VECQN',
    dateDelivery: '12/12/2018',
    unitRecive: 'NSC Sài Đồng',
    codeNSC: 'NSCSD',
    personCreateBB: 'Nguyễn Văn A',
    timeCreateBB: '12/12/2018  12:12:12',
    function: '[Sửa]/[Xóa]',
  },
  {
    id: 2,
    codeBBGH: 'BBGH01_20181212',
    typeBBGH: 'Biên bản - Farm',
    status: 'Đang tiếp nhận',
    unitGH: 'VinEco Quảng Ninh',
    codeFarmNCC: 'VECQN',
    dateDelivery: '11/12/2018',
    unitRecive: 'NSC Sài Đồng',
    codeNSC: 'NSCSD',
    personCreateBB: 'Nguyễn Văn A',
    timeCreateBB: '12/12/2018  12:12:12',
    function: '[Sửa]/[Xóa]',
  },
  {
    id: 3,
    codeBBGH: 'BBGH01_20181210',
    typeBBGH: 'Biên bản - Farm',
    status: 'Đang tiếp nhận',
    unitGH: 'HTX Thiện Thanh',
    codeFarmNCC: 'VECQN',
    dateDelivery: '11/12/2018',
    unitRecive: 'NSC Sài Đồng',
    codeNSC: 'NSCSD',
    personCreateBB: 'Nguyễn Văn A',
    timeCreateBB: '12/12/2018  12:12:12',
    function: '[Sửa]/[Xóa]',
  },
];

export const actions = [
  {
    isFreeAction: true,
    icon: 'add_circle_outline',
    tooltip: 'Tạo',
    onClick: (event, rows) => {
      alert(rows.length);
    },
  },
  {
    icon: 'open_in_new',
    tooltip: 'Gửi tiếp nhận',
    onClick: (event, rows) => {
      alert(rows.length);
    },
  },
  {
    icon: 'delete',
    tooltip: 'Xóa',
    onClick: (event, rows) => {
      alert(rows.length);
    },
  },
  {
    icon: 'print',
    tooltip: 'In',
    onClick: (event, rows) => {
      // fake redirect
      // console.log(rows);
      window.location.assign(`/bien-ban-giao-hang/in/${rows[0].id}`);
    },
  },
];
