import { TYPE_FORM } from 'containers/NSC_PXK/PXK/Business';
import { STATUS_PRODUCT, STATUS_PXK } from 'containers/NSC_PXK/PXK/constants';
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { FaBalanceScale } from 'react-icons/fa';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';

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
            values: { status },
          },
        },
      },
    } = this.props;
    if (
      (data && data.isNotSaved && data.locatorName) ||
      (form === TYPE_FORM.VIEW && ![status].includes(STATUS_PXK.COMPLETE))
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
      `/danh-sach-phieu-xuat-kho/danh-sach-phieu-dang-can-xuat-kho?deliverCode=${deliverCode}&documentId=${id}&subType=${subType}&documentDetailId=${
        data.id
      }`,
    );
  };

  render() {
    const {
      classes,
      context: {
        props: {
          form,
          formik: {
            values: { status },
          },
        },
      },
      data,
    } = this.props;
    const view = [];
    if (
      form === TYPE_FORM.VIEW &&
      ![status].includes(STATUS_PXK.COMPLETE) &&
      [STATUS_PRODUCT.NOT_SCALE_YET, STATUS_PRODUCT.SCALING].includes(
        data.status,
      )
    ) {
      view.push(
        <Tooltip title="Cân" key={Math.random()}>
          <IconButton className={classes.button} onClick={this.scale}>
            <FaBalanceScale className={classes.icon} />
          </IconButton>
        </Tooltip>,
      );
    }
    if (this.isDeleteVisible) {
      let title = 'Xóa dòng';
      if (!data.isNotSaved) {
        title = 'Xóa';
      }
      view.push(
        <Tooltip title={title} key={Math.random()}>
          <IconButton className={classes.button} onClick={this.onRemoveRow}>
            <DeleteIcon fontSize="small" />
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
  rowIndex: PropTypes.number,
  formik: PropTypes.object,
  history: PropTypes.object,
};

export default withStyles(styles)(ActionsRenderer);
