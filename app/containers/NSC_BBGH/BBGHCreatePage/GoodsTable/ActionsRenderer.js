import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

import { FaBalanceScale } from 'react-icons/fa';

import { TYPE_USER_EDIT } from 'containers/NSC_BBGH/BBGHEditPage/constants';

import { TYPE_BBGH } from '../constants';

export const styles = {
  button: {
    margin: 0,
    padding: 5,
    fontSize: 12,
  },
  icon: {
    fontSize: '1.5em',
  },
};

export class ActionsRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.gridApi = props.api;
    this.gridColumnApi = props.columnApi;
  }

  get isScaleVisible() {
    // Sửa BBGH
    if (this.props.context.isEditing) {
      const isEditing = this.props.context.isEditing();
      if (
        isEditing &&
        this.props.data &&
        this.props.data.deliveryOrderId >= 0
      ) {
        // Không hiển thị khi hoàn thành cân nhập kho
        if (this.props.data.isInScale) {
          return false;
        }

        // Không hiển thị khi trạng thái Đã tiếp nhận
        if (this.props.context.isReceived) {
          const isReceived = this.props.context.isReceived();
          if (isReceived) {
            return false;
          }
        }

        // Không hiển thị với bên nhận hàng
        if (this.props.context.getTypeUser) {
          const typeUser = this.props.context.getTypeUser();
          if (typeUser === TYPE_USER_EDIT.RECIVER) {
            return false;
          }
        }
      }
    }

    // Không hiển thị
    if (this.props.context.getDoType) {
      const doType = this.props.context.getDoType();

      if (
        // Không hiển thị khi Từ NCC tới NSC
        doType === TYPE_BBGH.NCC_TO_NSC ||
        // Không hiển thị khi Farm nhập sau thu hoạch
        doType === TYPE_BBGH.FARM_POST_HARVEST ||
        // Không hiển thị khi Từ Farm tới Plant khắc (Không có PXK - Cùng địa điểm)
        doType === TYPE_BBGH.FARM_TO_PLANT_CODE_2 ||
        // Không hiển thị khi Từ Plant tới Plant
        doType === TYPE_BBGH.PLANT_TO_PLANT_CODE_4
      ) {
        return false;
      }
    }

    // Thêm mới sản phẩm
    if (this.props.data && this.props.data.doConnectingId) {
      return true;
    }
    return false;
  }

  get isDeleteVisible() {
    // Thêm mới sản phẩm
    if (this.props.data && this.props.data.doConnectingId !== undefined) {
      return true;
    }
    return false;
  }

  get isWarningVisible() {
    return false;
  }

  removeRow = () => {
    this.props.context.confirmRemoveRecord(
      this.props.data,
      this.props.rowIndex,
    );
  };

  scale = () => {
    this.props.context.scale(this.props.data, this.props.rowIndex);
  };

  warn = () => {
    this.props.context.warn(this.props.data, this.props.rowIndex);
  };

  render() {
    const { classes, data } = this.props;
    const checkDelete = data.ispending !== true && this.isDeleteVisible;
    return (
      <React.Fragment>
        {this.isScaleVisible && (
          <Tooltip title="Cân">
            <IconButton className={classes.button} onClick={this.scale}>
              <FaBalanceScale className={classes.icon} />
            </IconButton>
          </Tooltip>
        )}
        {this.isWarningVisible && (
          <Tooltip title="Cảnh báo">
            <IconButton className={classes.button} onClick={this.warn}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {checkDelete && (
          <Tooltip title="Xóa">
            <IconButton className={classes.button} onClick={this.removeRow}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </React.Fragment>
    );
  }
}

ActionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object,
  data: PropTypes.object,
  rowIndex: PropTypes.number,
  api: PropTypes.any,
  columnApi: PropTypes.any,
};

export default withStyles(styles)(ActionsRenderer);
