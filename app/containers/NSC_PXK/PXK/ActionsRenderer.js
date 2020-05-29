import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { FaBalanceScale } from 'react-icons/fa';

import DeleteIcon from '@material-ui/icons/Delete';

import { TYPE_FORM } from './Business';
import { STATUS_PXK, TYPE_PXK, STATUS_PRODUCT } from './constants';

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
  get isDeleteVisible() {
    const {
      data,
      context: {
        props: {
          form,
          formik: {
            values: { status, subType },
          },
        },
      },
    } = this.props;

    if (
      (data &&
        data.isNotSaved &&
        (data.locatorNameFrom ||
          data.productCode ||
          data.locatorNameTo ||
          data.exportedQuantity)) ||
      (form === TYPE_FORM.VIEW &&
        (status === STATUS_PXK.SCALING || subType === TYPE_PXK.PXK_XUAT_HUY))
    ) {
      return true;
    }
    return false;
  }

  onRemoveRow = () => {
    this.props.context.confirmRemoveRecord(
      this.props.data,
      this.props.rowIndex,
    );
  };

  scale = () => {
    // redirect to 'danh sách phiếu đang cân xuất kho'
    const {
      history: { push },
      formik: {
        values: { deliverCode, id, subType }, // deliverCode, documentId, subType
      },
    } = this.props.context.props;

    const {
      data, // documentDetailId
    } = this.props;

    push(
      `/danh-sach-phieu-xuat-kho/danh-sach-phieu-dang-can-xuat-kho?deliverCode=${
        deliverCode.value
      }&documentId=${id}&subType=${subType}&documentDetailId=${data.id}`,
    );
  };

  render() {
    const {
      classes,
      context: {
        props: {
          form,
          formik: {
            values: { status, subType },
          },
        },
      },
      data,
    } = this.props;

    const view = [];
    if (data.totalCol) return view;
    if (this.isDeleteVisible) {
      let title = 'Xóa dòng';
      if (!data.isNotSaved) {
        title = 'Xóa';
      }

      view.push(
        <Tooltip title={title} key={1}>
          <IconButton className={classes.button} onClick={this.onRemoveRow}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>,
      );
    }

    if (
      form === TYPE_FORM.VIEW &&
      subType !== TYPE_PXK.PXK_XUAT_HUY &&
      ![status].includes(STATUS_PXK.COMPLETE) &&
      [STATUS_PRODUCT.NOT_SCALE_YET, STATUS_PRODUCT.SCALING].includes(
        data.status,
      )
    ) {
      view.push(
        <Tooltip title="Cân" key={2}>
          <IconButton className={classes.button} onClick={this.scale}>
            <FaBalanceScale className={classes.icon} />
          </IconButton>
        </Tooltip>,
      );
    }
    return view;
  }
}

ActionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  context: PropTypes.object,
  data: PropTypes.object,
  formik: PropTypes.object,
  history: PropTypes.object,
  rowIndex: PropTypes.number,
};

export default withStyles(styles)(ActionsRenderer);
